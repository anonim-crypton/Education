# teachers/views.py - FIXED VERSION

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.contrib.auth.models import User
from django.utils import timezone
from django.db import transaction
import secrets
import string

from .models import TeacherRequest, Teacher
from .serializers import TeacherRequestSerializer, TeacherSerializer


class IsAdminOrReadOnly(BasePermission):
    """Custom permission: admin huquqlari, yoki faqat o'qish"""
    def has_permission(self, request, view):
        # Admin o'qish huquqi
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return request.user and request.user.is_authenticated
        
        # POST/PUT/DELETE uchun admin bo'lish kerak
        return request.user and request.user.is_staff and request.user.is_authenticated


class TeacherRequestViewSet(viewsets.ModelViewSet):
    queryset = TeacherRequest.objects.all()
    serializer_class = TeacherRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return TeacherRequest.objects.all()
        return TeacherRequest.objects.filter(user=self.request.user)
    
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
                    {'message': 'Siz allaqachon so\'rov bermishsiz. Iltimos, natijani kuting.'},
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
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response(
                {'message': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def approve(self, request, pk=None):
        """O'qituvchi so'rovini tasdiqlash - ADMIN UCHUN"""
        
        # Admin check
        if not request.user.is_staff:
            return Response(
                {'message': 'Admin huquqlari kerak. Siz admin emasiz!'},
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
                teacher_request.save()
                
                # Optional: Email jo'natish
                self._send_approval_email(user, username, password, teacher_request)
            
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
            })
        
        except Exception as e:
            return Response(
                {'message': f'Xato: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def reject(self, request, pk=None):
        """O'qituvchi so'rovini rad etish - ADMIN UCHUN"""
        
        # Admin check
        if not request.user.is_staff:
            return Response(
                {'message': 'Admin huquqlari kerak. Siz admin emasiz!'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            teacher_request = self.get_object()
            
            if teacher_request.status != 'pending':
                return Response(
                    {'message': 'Bu so\'rov allaqachon qayta tekshirilgan.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            rejection_reason = request.data.get('rejection_reason', 'Tafsil mavjud emas')
            
            teacher_request.status = 'rejected'
            teacher_request.save()
            
            # Optional: Email jo'natish
            self._send_rejection_email(teacher_request, rejection_reason)
            
            return Response({
                'message': 'O\'qituvchi so\'rovi rad etildi.',
                'user_id': teacher_request.user_id
            })
        
        except Exception as e:
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
    
    def _send_approval_email(self, user, username, password, teacher_request):
        """Approval email jo'natish"""
        from django.core.mail import send_mail
        
        subject = "Tabriklaymark! O'qituvchi so'rovingiz tasdiqlandi!"
        message = f"""
        Assalomu alaykim {user.first_name}!
        
        Sizning o'qituvchi so'rovingiz tasdiqlandi!
        
        Tizimga kirish uchun:
        Username: {username}
        Parol: {password}
        
        EHTIYOT: Bu parolni xavfsiz joyda saqlang va birinchi kirishda o'zingizning parolini yaratib olgan.
        
        Saytga o'ting: http://localhost:3000/login
        
        Shukriya!
        Edugame Team
        """
        
        try:
            send_mail(subject, message, 'info@edugame.uz', [user.email])
        except:
            pass
    
    def _send_rejection_email(self, teacher_request, reason):
        """Rejection email jo'natish"""
        from django.core.mail import send_mail
        
        subject = "O'qituvchi so'rovingiz haqida"
        message = f"""
        Assalomu alaykim {teacher_request.full_name}!
        
        Sizning o'qituvchi so'rovingiz atrofida ko'rib chiqildi.
        
        Af soraeymiz, lekin shu paytda sizning so'rovingiz qabul qilinmadi.
        
        Sabab: {reason}
        
        Agar sizda savollar bo'lsa, admin@edugame.uz ga yozing.
        
        Shukriya va qayta urinib ko'rishdan bo'ymaysiz!
        Edugame Team
        """
        
        try:
            send_mail(subject, message, 'info@edugame.uz', [teacher_request.user.email])
        except:
            pass


class TeacherViewSet(viewsets.ReadOnlyModelViewSet):
    """Tasdiqlangan o'qituvchilarni ko'rish"""
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated]
