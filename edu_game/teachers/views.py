from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.utils import timezone
from django.db import transaction
from django.contrib import messages
from django.views.decorators.http import require_http_methods
import secrets
import string

from .models import TeacherRequest, Teacher
from .serializers import TeacherRequestSerializer, TeacherSerializer
from users.models import Course

User = get_user_model()


class TeacherRequestViewSet(viewsets.ModelViewSet):
    queryset = TeacherRequest.objects.all()
    serializer_class = TeacherRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Admin yoki staff o'z so'rovlarini ko'rishi mumkin
        if user.is_staff or user.is_superuser:
            return TeacherRequest.objects.all().order_by('-created_at')
        # Oddiy foydalanuvchi faqat o'z so'rovlarini ko'rishi mumkin
        return TeacherRequest.objects.filter(user=user).order_by('-created_at')

    def create(self, request):
        """O'qituvchi so'rovi yuborish"""
        try:
            data = request.data.copy()
            data['user'] = request.user.id

            # Tekshirish: foydalanuvchi allaqachon so'rov bermibmi?
            existing = TeacherRequest.objects.filter(
                user=request.user,
                status='pending'
            ).first()

            if existing:
                return Response(
                    {
                        'message': 'Siz allaqachon so\'rov bermishsiz. Iltimos, natijani kuting.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(
                    {
                        'message': 'O\'qituvchi so\'rovingiz muvaffaqiyatli yuborildi!',
                        **serializer.data
                    },
                    status=status.HTTP_201_CREATED
                )

            # Xato detallari frontend uchun
            print(f"Serializer errors: {serializer.errors}")
            print(f"Request data: {data}")
            return Response({
                'message': 'Validation xatosi',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(f"Exception in create: {str(e)}")
            return Response(
                {'message': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """O'qituvchi so'rovini tasdiqlash"""
        if not request.user.is_staff:
            return Response(
                {'message': 'Admin huquqlari kerak!'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            teacher_request = self.get_object()

            if teacher_request.status != 'pending':
                return Response(
                    {'message': 'Bu so\'rov allaqachon qayta tekshirilgan.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            with transaction.atomic():
                # Username yaratish
                username = self._generate_username(teacher_request.full_name)
                # Parol yaratish
                password = self._generate_password()

                # User'ni update qilish
                user = teacher_request.user
                user.username = username
                user.set_password(password)
                # Full name'ni User model'da saqlash
                if not user.first_name and not user.last_name:
                    name_parts = teacher_request.full_name.split(' ', 1)
                    user.first_name = name_parts[0]
                    if len(name_parts) > 1:
                        user.last_name = name_parts[1]
                user.save()

                # Teacher profile yaratish yoki update qilish
                teacher, created = Teacher.objects.get_or_create(user=user)
                teacher.subject = teacher_request.subject
                teacher.bio = teacher_request.bio
                teacher.experience_years = teacher_request.experience_years
                teacher.save()

                # TeacherRequest'ni update qilish
                teacher_request.status = 'approved'
                teacher_request.approved_at = timezone.now()
                teacher_request.approved_by = request.user
                teacher_request.username = username  # O'qituvchi usernameini saqlash
                teacher_request.save()

                # Course avtomatik yaratish
                course, created = Course.objects.get_or_create(
                    teacher_user=user,
                    defaults={
                        'title': teacher_request.subject,  # Course title = subject
                        'teacher': user.get_full_name(),
                        'description': teacher_request.bio or '',
                        'is_active': True,
                        'order': 0
                    }
                )

            return Response({
                'message': 'O\'qituvchi tasdiqlandi! Username va parol yaratildi.',
                'username': username,
                'password': password,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'full_name': user.get_full_name(),
                    'is_teacher': True
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Exception in approve: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {'message': f'Xato: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """O'qituvchi so'rovini rad etish"""
        if not request.user.is_staff:
            return Response(
                {'message': 'Admin huquqlari kerak!'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            teacher_request = self.get_object()

            if teacher_request.status != 'pending':
                return Response(
                    {'message': 'Bu so\'rov allaqachon qayta tekshirilgan.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            teacher_request.status = 'rejected'
            teacher_request.save()

            return Response({
                'message': 'O\'qituvchi so\'rovi rad etildi.',
                'user_id': teacher_request.user_id
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Exception in reject: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {'message': f'Xato: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _generate_username(self, full_name):
        """Username generatsiya"""
        base = full_name.lower().replace(' ', '_')
        username = base
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base}{counter}"
            counter += 1
        return username

    def _generate_password(self, length=12):
        """Vaqtinchalik parol generatsiya"""
        characters = string.ascii_letters + string.digits
        return ''.join(secrets.choice(characters) for _ in range(length))


class TeacherViewSet(viewsets.ModelViewSet):
    """Tasdiqlangan o'qituvchilarni ko'rish va boshqarish"""
    queryset = Teacher.objects.select_related('user').all()
    serializer_class = TeacherSerializer
    permission_classes = []  # No authentication required for public teachers list
    
    def get_permissions(self):
        """Admin actions uchun authentication va permission tekshirish"""
        if self.action in ['update', 'partial_update', 'block', 'unblock', 'delete_teacher']:
            return [IsAuthenticated(), IsAdminUser()]
        return super().get_permissions()
    
    def update(self, request, pk=None):
        """O'qituvchi ma'lumotlarini tahrirlash"""
        if not request.user.is_staff:
            return Response(
                {'message': 'Admin huquqlari kerak!'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            teacher = self.get_object()
            
            # Qabul qilingan ma'lumotlarni update qilish
            serializer = self.get_serializer(teacher, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'O\'qituvchi ma\'lumotlari muvaffaqiyatli yangilandi!',
                    **serializer.data
                }, status=status.HTTP_200_OK)
            
            return Response({
                'message': 'Validation xatosi',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            print(f"Exception in update: {str(e)}")
            return Response(
                {'message': f'Xato: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def block(self, request, pk=None):
        """O'qituvchini blokirovka qilish"""
        if not request.user.is_staff:
            return Response(
                {'message': 'Admin huquqlari kerak!'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            teacher = self.get_object()
            reason = request.data.get('reason', 'Admin tomonidan blokirovka qilindi')
            
            if teacher.is_blocked:
                return Response(
                    {'message': 'Bu o\'qituvchi allaqachon blokirovka qilindi'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            teacher.is_blocked = True
            teacher.blocked_at = timezone.now()
            teacher.blocked_reason = reason
            teacher.save()
            
            # User'ni is_active = False qilish (login qila olmaydi)
            teacher.user.is_active = False
            teacher.user.save()
            
            return Response({
                'message': 'O\'qituvchi muvaffaqiyatli blokirovka qilindi!',
                'teacher': TeacherSerializer(teacher, context={'request': request}).data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Exception in block: {str(e)}")
            return Response(
                {'message': f'Xato: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def unblock(self, request, pk=None):
        """O'qituvchini blokirovkadan chiqarish"""
        if not request.user.is_staff:
            return Response(
                {'message': 'Admin huquqlari kerak!'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            teacher = self.get_object()
            
            if not teacher.is_blocked:
                return Response(
                    {'message': 'Bu o\'qituvchi blokirovka qilinmagan'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            teacher.is_blocked = False
            teacher.blocked_at = None
            teacher.blocked_reason = None
            teacher.save()
            
            # User'ni is_active = True qilish (login qila oladi)
            teacher.user.is_active = True
            teacher.user.save()
            
            return Response({
                'message': 'O\'qituvchi muvaffaqiyatli blokirovkadan chiqarildi!',
                'teacher': TeacherSerializer(teacher, context={'request': request}).data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Exception in unblock: {str(e)}")
            return Response(
                {'message': f'Xato: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def delete_teacher(self, request, pk=None):
        """O'qituvchini o'chirish - darslar qoladi, shaxsiy ma'lumot o'chib ketadi"""
        if not request.user.is_staff:
            return Response(
                {'message': 'Admin huquqlari kerak!'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            teacher = self.get_object()
            user = teacher.user
            
            # Teacher ma'lumotlarini o'chirish (O'qituvchi profili o'chib ketadi)
            teacher.is_deleted = True
            teacher.deleted_at = timezone.now()
            teacher.subject = "[O'chirilgan]"
            teacher.bio = ""
            teacher.save()
            
            # User'ni deaktivate qilish (login qila olmaydi)
            user.is_active = False
            user.first_name = "[Deleted]"
            user.last_name = ""
            user.email = f"deleted_{user.id}@deleted.local"
            user.avatar = None
            user.save()
            
            return Response({
                'message': 'O\'qituvchi muvaffaqiyatli o\'chirildi! Uning darslar qoladi.',
                'teacher_id': teacher.id
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Exception in delete_teacher: {str(e)}")
            return Response(
                {'message': f'Xato: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Teacher Login Views
@require_http_methods(["GET", "POST"])
def teacher_login_view(request):
    """O'qituvchi login sahifasi"""
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '').strip()
        
        if not username or not password:
            messages.error(request, 'Username va parolni to\'ldiring')
            return render(request, 'teachers/login.html')
        
        # Authenticate user
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            # Check if user is a teacher
            if hasattr(user, 'teacher_profile'):
                login(request, user)
                messages.success(request, f'Xush kelibsiz, {user.get_full_name()}!')
                return redirect('teacher_dashboard')
            else:
                messages.error(request, 'Siz o\'qituvchi emassiz')
        else:
            messages.error(request, 'Username yoki parol noto\'g\'ri')
        
        return render(request, 'teachers/login.html')
    
    # GET request
    if request.user.is_authenticated and hasattr(request.user, 'teacher_profile'):
        return redirect('teacher_dashboard')
    
    return render(request, 'teachers/login.html')


@login_required(login_url='teacher_login')
def teacher_dashboard_view(request):
    """O'qituvchi dashboard"""
    # Check if user is a teacher
    if not hasattr(request.user, 'teacher_profile'):
        messages.error(request, 'Siz o\'qituvchi emassiz')
        return redirect('teacher_login')
    
    teacher = request.user.teacher_profile
    
    # Get lessons count (if Lesson model exists)
    lessons_count = 0
    students_count = 0
    
    try:
        from users.models import Lesson, CustomUser
        # Count lessons for this teacher's courses
        from users.models import Course
        teacher_courses = Course.objects.filter(teacher_user=request.user)
        lessons_count = Lesson.objects.filter(course__in=teacher_courses).count()
        # Count all regular users (students)
        students_count = CustomUser.objects.filter(is_staff=False, is_superuser=False).count()
    except ImportError:
        pass
    
    context = {
        'teacher': teacher,
        'lessons_count': lessons_count,
        'students_count': students_count,
    }
    
    return render(request, 'teachers/dashboard.html', context)


@login_required(login_url='teacher_login')
def teacher_logout_view(request):
    """O'qituvchi chiqish"""
    logout(request)
    messages.success(request, 'Siz chiqib ketdingiz')
    return redirect('teacher_login')


def all_teachers_view(request):
    """Barcha o'qituvchilarni ko'rish"""
    teachers = Teacher.objects.select_related('user').all().order_by('user__first_name')
    
    context = {
        'teachers': teachers,
        'teacher_count': teachers.count(),
    }
    
    return render(request, 'teachers/all_teachers.html', context)


@login_required(login_url='teacher_login')
def teacher_upload_lesson_view(request):
    """O'qituvchi darslik yuklash sahifasi"""
    # Check if user is a teacher
    if not hasattr(request.user, 'teacher_profile'):
        messages.error(request, 'Siz o\'qituvchi emassiz')
        return redirect('teacher_login')
    
    teacher = request.user.teacher_profile
    
    if request.method == 'POST':
        try:
            # Form datani o'qish
            title = request.POST.get('title', '').strip()
            description = request.POST.get('description', '').strip()
            video_file = request.FILES.get('video_file')
            
            # Validation
            if not title:
                messages.error(request, 'Dars nomini to\'ldiring')
                return render(request, 'teachers/upload_lesson.html', {'teacher': teacher})
            
            if not video_file:
                messages.error(request, 'Video faylini tanlanig')
                return render(request, 'teachers/upload_lesson.html', {'teacher': teacher})
            
            # Lesson yaratish uchun Course bo'lishi kerak
            from users.models import Course, Lesson
            
            # Default course yaratish yoki oldingi course'ni olish
            course, created = Course.objects.get_or_create(
                teacher_user=request.user,
                defaults={
                    'title': f"{teacher.subject} - Kurs",
                    'teacher': teacher.user.get_full_name(),
                    'icon': 'book-open',
                    'color': 'from-blue-600 to-blue-500',
                    'description': teacher.bio or '',
                }
            )
            
            # Lesson yaratish
            lesson = Lesson.objects.create(
                course=course,
                title=title,
                description=description,
                video_file=video_file,
                teacher_name=teacher.user.get_full_name(),
                order=Lesson.objects.filter(course=course).count() + 1
            )
            
            messages.success(request, f"Dars '{title}' muvaffaqiyatli yuklandi!")
            return redirect('teacher_dashboard')
            
        except Exception as e:
            messages.error(request, f'Xato: {str(e)}')
            return render(request, 'teachers/upload_lesson.html', {'teacher': teacher})
    
    context = {
        'teacher': teacher,
    }
    
    return render(request, 'teachers/upload_lesson.html', context)
