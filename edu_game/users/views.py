from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model, login, logout
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_http_methods
from django.db import transaction
from django.utils import timezone
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    GoogleRegisterSerializer, ProfileUpdateSerializer,
    TeacherApplicationSerializer, CourseSerializer
)
from .models import TeacherApplication, Course, LoginLog, Lesson, Notification
from teachers.models import TeacherRequest, Teacher
from teachers.serializers import TeacherRequestSerializer, TeacherSerializer
import json
import requests
import secrets
import string

User = get_user_model()


def api_status(request):
    """API status page - shows API is connected"""
    return render(request, 'api_status.html')


def admin_create_page(request):
    """Admin creation page"""
    return render(request, 'admin_create.html')


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """User registration endpoint"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Create token for the user
        token, created = Token.objects.get_or_create(user=user)
        
        user_serializer = UserSerializer(user)
        return Response({
            'success': True,
            'message': 'User registered successfully',
            'user': user_serializer.data,
            'access': token.key,
            'refresh': None,  # For compatibility with frontend
        }, status=status.HTTP_201_CREATED)
    
    # Format errors for frontend
    errors = {}
    for field, messages in serializer.errors.items():
        errors[field] = messages if isinstance(messages, list) else [messages]
    
    return Response({
        'success': False,
        'errors': errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """User login endpoint - automatically detects student, teacher, or admin"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        # Check user type: admin > teacher > student
        is_teacher = False
        is_admin = False
        teacher_status = None
        login_type = 'student'  # Default to student
        
        # Check if admin/superuser
        if user.is_staff or user.is_superuser:
            is_admin = True
            login_type = 'admin'
        # Check if teacher
        elif hasattr(user, 'teacher_application') and user.teacher_application.status == 'approved':
            is_teacher = True
            teacher_status = user.teacher_application.status
            login_type = 'teacher'
        
        # Log the login
        try:
            ip_address = request.META.get('REMOTE_ADDR', '')
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            LoginLog.objects.create(
                user=user,
                username=user.username,
                login_type=login_type,
                ip_address=ip_address,
                device=user_agent[:255] if user_agent else ''
            )
        except Exception as e:
            print(f"LoginLog save error: {str(e)}")
        
        user_serializer = UserSerializer(user)
        return Response({
            'success': True,
            'message': 'Login successful',
            'user': user_serializer.data,
            'access': token.key,
            'refresh': None,
            'is_teacher': is_teacher,
            'is_admin': is_admin,
            'teacher_status': teacher_status,
            'login_type': login_type,  # 'student', 'teacher', or 'admin'
        }, status=status.HTTP_200_OK)
    
    # Format errors for frontend
    errors = {}
    for field, messages in serializer.errors.items():
        errors[field] = messages if isinstance(messages, list) else [messages]
    
    return Response({
        'success': False,
        'errors': errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """Get or update current user profile"""
    if request.method == 'GET':
        serializer = UserSerializer(request.user, context={'request': request})
        return Response({
            'success': True,
            'user': serializer.data
        }, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        # Update user profile
        serializer = ProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        
        if serializer.is_valid():
            user = serializer.save()
            user_serializer = UserSerializer(user, context={'request': request})
            return Response({
                'success': True,
                'message': 'Profile updated successfully',
                'user': user_serializer.data
            }, status=status.HTTP_200_OK)
        
        # Format errors for frontend
        errors = {}
        for field, messages in serializer.errors.items():
            errors[field] = messages if isinstance(messages, list) else [messages]
        
        return Response({
            'success': False,
            'errors': errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_avatar_view(request):
    """Delete user avatar"""
    user = request.user
    
    if user.avatar:
        # Rasm faylini o'chirish
        user.avatar.delete(save=False)
        user.avatar = None
        user.save()
        
        return Response({
            'success': True,
            'message': 'Avatar deleted successfully'
        }, status=status.HTTP_200_OK)
    
    return Response({
        'success': False,
        'error': 'No avatar to delete'
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout user by deleting token"""
    try:
        request.user.auth_token.delete()
        return Response({
            'success': True,
            'message': 'Logged out successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_view(request):
    """Get user dashboard data"""
    serializer = UserSerializer(request.user)
    
    # Get courses count for teachers
    courses_count = 0
    courses = []
    
    try:
        user_courses = Course.objects.filter(teacher_user=request.user, is_active=True)
        courses_count = user_courses.count()
        courses_serializer = CourseSerializer(user_courses, many=True, context={'request': request})
        courses = courses_serializer.data
    except Exception as e:
        print(f"Error fetching courses: {e}")
    
    return Response({
        'success': True,
        'user': serializer.data,
        'courses_count': courses_count,
        'courses': courses
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_google_registration(request):
    """Complete Google registration by setting school name"""
    user = request.user
    
    if not user.is_google_user:
        return Response({
            'success': False,
            'errors': {'general': ['This endpoint is only for Google users']}
        }, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = GoogleRegisterSerializer(data=request.data)
    if serializer.is_valid():
        user.school_name = serializer.validated_data['school_name']
        user.save()
        
        user_serializer = UserSerializer(user)
        return Response({
            'success': True,
            'message': 'Registration completed successfully',
            'user': user_serializer.data,
        }, status=status.HTTP_200_OK)
    
    # Format errors for frontend
    errors = {}
    for field, messages in serializer.errors.items():
        errors[field] = messages if isinstance(messages, list) else [messages]
    
    return Response({
        'success': False,
        'errors': errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def google_login_view(request):
    """Google OAuth login endpoint"""
    try:
        token = request.data.get('token')
        if not token:
            return Response({
                'success': False,
                'errors': {'token': ['Token is required']}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify token with Google userinfo endpoint
        url = 'https://www.googleapis.com/oauth2/v2/userinfo'
        response = requests.get(url, headers={'Authorization': f'Bearer {token}'})
        
        if response.status_code != 200:
            return Response({
                'success': False,
                'errors': {'token': ['Invalid token']}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user_info = response.json()
        email = user_info.get('email')
        
        if not email:
            return Response({
                'success': False,
                'errors': {'token': ['Email not found in token']}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create user
        user, created = User.objects.get_or_create(email=email)
        
        if created:
            # Generate unique username from email
            username = email.split('@')[0]
            # Agar username allaqachon mavjud bo'lsa, suffix qo'shamiz
            counter = 1
            original_username = username
            while User.objects.filter(username=username).exists():
                username = f"{original_username}{counter}"
                counter += 1
            
            user.username = username
            user.first_name = user_info.get('given_name', '')
            user.last_name = user_info.get('family_name', '')
            # Google users uchun password = email (hashed)
            user.set_password(email)
            # School name hozircha bo'sh - keyin profile update endpoint orqali o'rnatiladi
            user.school_name = 'Not specified'
            user.is_google_user = True
            # Set default avatar
            user.avatar = 'avatars/placeholder-user.jpg'
            user.save()
        
        # Create or get token
        auth_token, _ = Token.objects.get_or_create(user=user)
        
        # Check if user is a teacher
        is_teacher = False
        teacher_status = None
        if hasattr(user, 'teacher_application'):
            is_teacher = user.teacher_application.status == 'approved'
            teacher_status = user.teacher_application.status
        
        user_serializer = UserSerializer(user)
        return Response({
            'success': True,
            'message': 'Google login successful',
            'user': user_serializer.data,
            'access': auth_token.key,
            'refresh': None,
            'is_new_user': created,  # Frontend uchun - yangi user bo'lsa school name so'rov ko'rsatish
            'needs_school_name': created and user.school_name == 'Not specified',  # School name hali to'ldirilganmi
            'is_teacher': is_teacher,
            'teacher_status': teacher_status,
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        import traceback
        print(f"Google login error: {str(e)}")
        print(traceback.format_exc())
        return Response({
            'success': False,
            'errors': {'general': [str(e)]}
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def teacher_apply_view(request):
    """Endpoint for applying to become a teacher"""
    try:
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
        
        # Create new teacher request
        data = request.data.copy()
        data['user'] = request.user.id
        
        serializer = TeacherRequestSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({
                'message': 'O\'qituvchi so\'rovingiz muvaffaqiyatli yuborildi!',
                **serializer.data
            }, status=status.HTTP_201_CREATED)
        
        # Xato detallari frontend uchun
        print(f"Serializer errors: {serializer.errors}")
        print(f"Request data: {data}")
        return Response({
            'message': 'Validation xatosi',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        print(f"Exception in teacher_apply_view: {str(e)}")
        return Response(
            {'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_application_status_view(request):
    """Check user's teacher application status"""
    try:
        application = request.user.teacher_application
        serializer = TeacherApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except TeacherApplication.DoesNotExist:
        return Response({
            'message': 'Teacher application not found',
            'has_application': False
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def courses_list_view(request):
    """List all active courses or create a new course (admin only)"""
    if request.method == 'GET':
        courses = Course.objects.filter(is_active=True).order_by('order', 'created_at')
        serializer = CourseSerializer(courses, many=True, context={'request': request})
        return Response({
            'success': True,
            'count': courses.count(),
            'courses': serializer.data
        }, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        # Only allow staff/admin to create courses
        if not request.user.is_authenticated or not (request.user.is_staff or request.user.is_superuser):
            return Response({
                'success': False,
                'error': 'Permission denied. Only admin can create courses.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = CourseSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Course created successfully',
                'course': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_teachers_by_subject(request, subject):
    """Get all teachers for a specific subject"""
    try:
        # Map subject names to teacher subject field values
        subject_map = {
            'Web-Dasturlash': 'dasturlash',
            'Matematika': 'matematika',
            'Fizika': 'fizika',
            'Kimyo': 'kimyo',
            'Biologiya': 'biologiya',
            'Ingliz-tili': 'ingliz-tili',
            'Rus-tili': 'rus-tili',
            "O'zbek-tili": 'uzbek-tili',
            "O'zbekiston-tarixi": 'tarix',
            'Geografiya': 'geografiya',
        }
        
        teacher_subject = subject_map.get(subject)
        if not teacher_subject:
            return Response({
                'success': False,
                'error': f'Subject "{subject}" not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get teachers for this subject
        teachers = User.objects.filter(
            subject=teacher_subject,
            is_active=True
        ).exclude(
            is_superuser=True,
            is_staff=True
        )
        
        teachers_data = []
        for teacher in teachers:
            # Get courses for this teacher in this subject
            courses = Course.objects.filter(
                teacher_user=teacher,
                is_active=True
            )
            
            courses_data = []
            for course in courses:
                # Get lessons/videos for this course
                lessons = Lesson.objects.filter(course=course)
                videos_count = lessons.count()
                
                courses_data.append({
                    'id': course.id,
                    'title': course.title,
                    'description': course.description,
                    'videos_count': videos_count,
                    'total_views': sum([l.views_count for l in lessons]),
                })
            
            teachers_data.append({
                'id': teacher.id,
                'username': teacher.username,
                'full_name': teacher.get_full_name() or teacher.username,
                'subject': teacher.subject,
                'avatar': teacher.avatar.url if teacher.avatar else f'https://api.dicebear.com/7.x/avataaars/svg?seed={teacher.username}',
                'school': teacher.school_name,
                'courses': courses_data
            })
        
        return Response({
            'success': True,
            'subject': subject,
            'teachers_count': len(teachers_data),
            'teachers': teachers_data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def teacher_courses_view(request):
    """Get all courses for the logged-in teacher or create a new course"""
    if request.method == 'GET':
        courses = Course.objects.filter(teacher_user=request.user, is_active=True).order_by('order', 'created_at')
        serializer = CourseSerializer(courses, many=True, context={'request': request})
        return Response({
            'success': True,
            'count': courses.count(),
            'courses': serializer.data
        }, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        # Create new course for teacher
        try:
            # Get teacher name
            teacher_name = f"{request.user.first_name} {request.user.last_name}".strip() or request.user.username
            
            # Create course object directly
            course = Course.objects.create(
                teacher_user=request.user,
                title=request.data.get('title', ''),
                teacher=teacher_name,
                description=request.data.get('description', ''),
                lessons=int(request.data.get('lessons', 1)),
                icon=request.data.get('icon', 'book-open'),
                teacher_image=request.FILES.get('teacher_image'),
                is_active=True,
                order=0
            )
            
            serializer = CourseSerializer(course, context={'request': request})
            return Response({
                'success': True,
                'message': 'Course created successfully',
                'course': serializer.data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'success': False,
                'errors': {'general': str(e)}
            }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_students_view(request):
    """Get all students enrolled in teacher's courses"""
    try:
        # Get all courses for this teacher
        teacher_courses = Course.objects.filter(teacher_user=request.user, is_active=True)
        
        # Get all students (for now, return all non-staff, non-superuser users)
        # In a more advanced version, you would track actual enrollments
        students = User.objects.filter(
            is_staff=False, 
            is_superuser=False
        ).order_by('first_name', 'last_name')
        
        # Prepare student data
        students_data = []
        for student in students:
            student_info = {
                'id': student.id,
                'username': student.username,
                'first_name': student.first_name,
                'last_name': student.last_name,
                'email': student.email,
                'school_name': getattr(student, 'school_name', ''),
                'avatar_url': getattr(student, 'avatar_url', None) if hasattr(student, 'avatar_url') else None,
            }
            
            # Try to get avatar from profile if it exists
            try:
                if hasattr(student, 'avatar') and student.avatar:
                    student_info['avatar_url'] = request.build_absolute_uri(student.avatar.url)
            except:
                pass
            
            students_data.append(student_info)
        
        return Response({
            'success': True,
            'count': len(students_data),
            'students': students_data,
            'courses_count': teacher_courses.count()
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        import traceback
        print(f"Error fetching students: {str(e)}")
        traceback.print_exc()
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def course_detail_view(request, course_id):
    """Get, update, or delete a specific course"""
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Course not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = CourseSerializer(course, context={'request': request})
        return Response({
            'success': True,
            'course': serializer.data
        }, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        # Only allow staff/admin to update
        if not request.user.is_authenticated or not (request.user.is_staff or request.user.is_superuser):
            return Response({
                'success': False,
                'error': 'Permission denied. Only admin can update courses.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = CourseSerializer(course, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Course updated successfully',
                'course': serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Only allow staff/admin to delete
        if not request.user.is_authenticated or not (request.user.is_staff or request.user.is_superuser):
            return Response({
                'success': False,
                'error': 'Permission denied. Only admin can delete courses.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        course.delete()
        return Response({
            'success': True,
            'message': 'Course deleted successfully'
        }, status=status.HTTP_200_OK)


# ============= DJANGO TEACHER PANEL VIEWS =============

@login_required(login_url='teacher_login')
def teacher_dashboard(request):
    """Teacher admin panel dashboard"""
    # Check if user is approved teacher
    if not hasattr(request.user, 'teacher_application') or request.user.teacher_application.status != 'approved':
        return redirect('teacher_login')
    
    courses = Course.objects.filter(teacher_user=request.user).order_by('order', 'created_at')
    
    return render(request, 'teacher/dashboard.html', {
        'courses': courses,
        'user': request.user,
    })


def teacher_login_view(request):
    """Teacher login page"""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                # Check if teacher (either teacher_profile or teacher_application approved)
                is_teacher = False
                
                # Check teacher_profile (admin created)
                if hasattr(user, 'teacher_profile'):
                    is_teacher = True
                # Check teacher_application (user requested)
                elif hasattr(user, 'teacher_application') and user.teacher_application.status == 'approved':
                    is_teacher = True
                
                if is_teacher:
                    login(request, user)
                    return redirect('teacher_dashboard')
                else:
                    error_msg = "Siz o'qituvchi akkaunt bilan ro'yxatdan o'tmargansiz"
            else:
                error_msg = "Username yoki parol noto'g'ri"
        except User.DoesNotExist:
            error_msg = "Username yoki parol noto'g'ri"
        
        return render(request, 'teacher/login.html', {'error': error_msg})
    
    return render(request, 'teacher/login.html')


@login_required(login_url='teacher_login')
def teacher_logout_view(request):
    """Logout teacher"""
    logout(request)
    return redirect('teacher_login')


@login_required(login_url='teacher_login')
@require_http_methods(["GET", "POST"])
def teacher_add_course(request):
    """Add new course"""
    if not hasattr(request.user, 'teacher_application') or request.user.teacher_application.status != 'approved':
        return redirect('teacher_login')
    
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        lessons = int(request.POST.get('lessons', 1))
        icon = request.POST.get('icon', 'book-open')
        teacher_image = request.FILES.get('teacher_image')
        
        teacher_name = f"{request.user.first_name} {request.user.last_name}".strip() or request.user.username
        
        course = Course.objects.create(
            teacher_user=request.user,
            title=title,
            teacher=teacher_name,
            description=description,
            lessons=lessons,
            icon=icon,
            teacher_image=teacher_image,
            is_active=True,
            order=0
        )
        
        return redirect('teacher_dashboard')
    
    return render(request, 'teacher/dashboard.html')


@login_required(login_url='teacher_login')
@require_http_methods(["POST"])
def teacher_delete_course(request, course_id):
    """Delete course"""
    if not hasattr(request.user, 'teacher_application') or request.user.teacher_application.status != 'approved':
        return redirect('teacher_login')
    
    course = get_object_or_404(Course, id=course_id, teacher_user=request.user)
    course.delete()
    
    return redirect('teacher_dashboard')


# ============= TEACHER API ENDPOINTS =============

@api_view(['POST'])
@permission_classes([AllowAny])
def teacher_login_api(request):
    """Teacher login via API"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'success': False,
            'error': 'Username va parol majburiy'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(username=username)
        if user.check_password(password):
            # Check if user is a teacher
            if hasattr(user, 'teacher_profile'):
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'success': True,
                    'message': 'Teacher login successful',
                    'token': token.key,
                    'teacher_username': user.username,
                    'is_teacher': True,
                    'teacher_id': user.teacher_profile.id
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'error': 'Siz o\'qituvchi profiliga ega emasissiz',
                }, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({
                'success': False,
                'error': 'Username yoki parol noto\'g\'ri'
            }, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Username yoki parol noto\'g\'ri'
        }, status=status.HTTP_401_UNAUTHORIZED)


# ============= ADMIN API ENDPOINTS =============

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login_api(request):
    """Admin login via API"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'success': False,
            'error': 'Username va parol majburiy'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(username=username)
        if user.check_password(password):
            if user.is_staff or user.is_superuser:
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'success': True,
                    'message': 'Admin login successful',
                    'token': token.key,
                    'admin_username': user.username,
                    'is_admin': True,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'error': 'Siz admin emadasiz',
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser
                }, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({
                'success': False,
                'error': 'Username yoki parol noto\'g\'ri'
            }, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Username yoki parol noto\'g\'ri'
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_teacher_requests_view(request):
    """Get all teacher requests for admin"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({
            'message': 'Admin huquqlari kerak'
        }, status=status.HTTP_403_FORBIDDEN)
    
    requests_list = TeacherRequest.objects.all().order_by('-created_at')
    serializer = TeacherRequestSerializer(requests_list, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_approve_teacher_view(request, request_id):
    """Approve teacher request and generate credentials"""
    print(f"DEBUG: approve_teacher - user={request.user}, is_staff={request.user.is_staff}")
    if not (request.user.is_staff or request.user.is_superuser):
        print(f"DEBUG: User tidak admin - rejecting")
        return Response({
            'message': 'Admin huquqlari kerak'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        teacher_request = TeacherRequest.objects.get(id=request_id)
        
        if teacher_request.status != 'pending':
            return Response({
                'message': 'Bu so\'rov allaqachon qayta tekshirilgan.',
            }, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            # Update application status only - do NOT create user account or teacher profile
            # User remains as regular user, not a teacher yet
            teacher_request.status = 'approved'
            teacher_request.approved_at = timezone.now()
            teacher_request.approved_by = request.user
            teacher_request.save()
            
            # Send notification
            Notification.objects.create(
                user=teacher_request.user,
                title="So'rovingiz Tasdiqlandi",
                message="Sizning o'qituvchi so'rovingiz tasdiqlandi! Admin sizni o'qituvchi sifatida qo'shadi.",
                type='approval'
            )
        
        return Response({
            'success': True,
            'message': 'O\'qituvchi so\'rovi tasdiqlandi. Admin sizni o\'qituvchi sifatida qo\'shadi.',
        }, status=status.HTTP_200_OK)
    
    except TeacherRequest.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Teacher request not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_reject_teacher_view(request, request_id):
    """Reject teacher request"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({
            'success': False,
            'error': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        teacher_request = TeacherRequest.objects.get(id=request_id)
        teacher_request.status = 'rejected'
        teacher_request.save()
        
        # Send rejection notification
        Notification.objects.create(
            user=teacher_request.user,
            title="So'rovingiz Rad Etildi",
            message="Afsuski, sizning o'qituvchi so'rovingiz rad etildi.",
            type='rejection'
        )
        
        return Response({
            'success': True,
            'message': 'Teacher request rejected'
        }, status=status.HTTP_200_OK)
    
    except TeacherRequest.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Teacher request not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_teachers_list_view(request):
    """Get all approved teachers"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({
            'message': 'Admin huquqlari kerak'
        }, status=status.HTTP_403_FORBIDDEN)
    
    teachers = Teacher.objects.select_related('user')
    serializer = TeacherSerializer(teachers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_create_course_view(request):
    """Create course for teacher"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({
            'success': False,
            'error': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        teacher_id = request.data.get('teacher_id')
        title = request.data.get('title')
        description = request.data.get('description', '')
        
        teacher_user = User.objects.get(id=teacher_id)
        teacher_name = f"{teacher_user.first_name} {teacher_user.last_name}".strip() or teacher_user.username
        
        course = Course.objects.create(
            teacher_user=teacher_user,
            title=title,
            teacher=teacher_name,
            description=description,
            is_active=True,
            order=0
        )
        
        serializer = CourseSerializer(course, context={'request': request})
        return Response({
            'success': True,
            'message': 'Course created successfully',
            'course': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    except User.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Teacher not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


# ============= ADMIN PANEL VIEWS (DJANGO) =============

def admin_login_view(request):
    """Admin login page"""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                if user.is_staff or user.is_superuser:
                    login(request, user)
                    return redirect('admin_dashboard:dashboard')
                else:
                    error_msg = "Siz admin emadasiz"
            else:
                error_msg = "Username yoki parol noto'g'ri"
        except User.DoesNotExist:
            error_msg = "Username yoki parol noto'g'ri"
        
        return render(request, 'admin/login.html', {'error': error_msg})
    
    return render(request, 'admin/login.html')


@login_required(login_url='admin_login')
def admin_dashboard(request):
    """Admin dashboard - manage teacher applications and courses"""
    if not (request.user.is_staff or request.user.is_superuser):
        return redirect('admin_login')
    
    pending_applications = TeacherRequest.objects.filter(status='pending').order_by('-created_at')
    approved_teachers = TeacherRequest.objects.filter(status='approved').order_by('-created_at')
    
    return render(request, 'admin/dashboard.html', {
        'pending_applications': pending_applications,
        'approved_teachers': approved_teachers,
        'user': request.user,
    })


@login_required(login_url='admin_login')
def approve_teacher_view(request, application_id):
    """Approve teacher application - Legacy view, redirects to admin dashboard"""
    if not (request.user.is_staff or request.user.is_superuser):
        return redirect('admin_login')
    
    try:
        application = TeacherRequest.objects.get(id=application_id)
        
        if request.method == 'POST':
            action = request.POST.get('action')
            
            if action == 'approve':
                # Approve teacher using the API function logic
                from django.db import transaction
                
                with transaction.atomic():
                    # Update application status only - do NOT create user account or teacher profile
                    # User remains as regular user, not a teacher yet
                    application.status = 'approved'
                    application.approved_at = timezone.now()
                    application.approved_by = request.user
                    application.save()
            
            return redirect('admin_dashboard')
        
        # GET request - redirect to dashboard
        return redirect('admin_dashboard')
        
    except TeacherRequest.DoesNotExist:
        return redirect('admin_dashboard')


@login_required(login_url='admin_login')
@require_http_methods(["POST"])
def reject_teacher_view(request, application_id):
    """Reject teacher application"""
    if not (request.user.is_staff or request.user.is_superuser):
        return redirect('admin_login')
    
    application = get_object_or_404(TeacherRequest, id=application_id)
    application.status = 'rejected'
    application.save()
    
    return redirect('admin_dashboard')


@login_required(login_url='admin_login')
def admin_logout_view(request):
    """Logout admin"""
    logout(request)
    return redirect('admin_login')


def admin_logout_api(request):
    """Logout admin via API (JSON response)"""
    if request.method == "POST":
        logout(request)
        return JsonResponse({
            'success': True,
            'message': 'Admin logout successful'
        })
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@login_required(login_url='teacher_login')
@require_http_methods(["GET", "POST"])
def teacher_upload_lesson(request):
    """Upload video lesson"""
    if not hasattr(request.user, 'teacher_application') or request.user.teacher_application.status != 'approved':
        return redirect('teacher_login')
    
    if request.method == 'POST':
        course_id = request.POST.get('course_id')
        title = request.POST.get('title')
        description = request.POST.get('description')
        video_file = request.FILES.get('video_file')
        
        course = get_object_or_404(Course, id=course_id, teacher_user=request.user)
        
        lesson = Lesson.objects.create(
            course=course,
            title=title,
            description=description,
            video_file=video_file,
            teacher_name=f"{request.user.first_name} {request.user.last_name}".strip() or request.user.username,
            order=0
        )
        
        return redirect('teacher_dashboard')
    
    # GET request - show form
    courses = Course.objects.filter(teacher_user=request.user, is_active=True)
    return render(request, 'teacher/upload_lesson.html', {'courses': courses})


# ============= NOTIFICATION ENDPOINTS =============

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_notification_view(request):
    """Send notification to user"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({
            'success': False,
            'error': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user_id = request.data.get('user_id')
        title = request.data.get('title')
        message = request.data.get('message')
        notif_type = request.data.get('type', 'system')
        
        user = User.objects.get(id=user_id)
        
        notification = Notification.objects.create(
            user=user,
            title=title,
            message=message,
            type=notif_type
        )
        
        return Response({
            'success': True,
            'message': 'Notification sent successfully',
            'notification': {
                'id': notification.id,
                'title': notification.title,
                'message': notification.message,
                'type': notification.type,
                'created_at': notification.created_at
            }
        }, status=status.HTTP_201_CREATED)
    
    except User.DoesNotExist:
        return Response({
            'success': False,
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_notifications_view(request):
    """Get user notifications"""
    notifications = Notification.objects.filter(user=request.user).order_by('-created_at')[:10]
    
    data = []
    for notif in notifications:
        data.append({
            'id': notif.id,
            'title': notif.title,
            'message': notif.message,
            'type': notif.type,
            'is_read': notif.is_read,
            'created_at': notif.created_at
        })
    
    return Response({
        'success': True,
        'count': len(data),
        'notifications': data
    }, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def lessons_list_view(request):
    """Get all lessons/videos for the logged-in teacher, or upload a new lesson"""
    try:
        # Handle POST - Upload new lesson
        if request.method == 'POST':
            course_id = request.data.get('course_id')
            title = request.data.get('title', '').strip()
            description = request.data.get('description', '').strip()
            video_file = request.FILES.get('video_file')
            duration = request.data.get('duration', 0)
            
            # Validate required fields
            if not title:
                return Response({
                    'success': False,
                    'error': 'Video sarlavhasi majburiy'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if not video_file:
                return Response({
                    'success': False,
                    'error': 'Video fayli majburiy'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if not course_id:
                return Response({
                    'success': False,
                    'error': 'Kurs tanlang'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get course and verify it belongs to teacher
            try:
                course = Course.objects.get(id=course_id, teacher_user=request.user)
            except Course.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'Kurs topilmadi yoki sizga tegishli emas'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create lesson
            try:
                lesson = Lesson.objects.create(
                    title=title,
                    description=description,
                    video_file=video_file,
                    course=course,
                    teacher_name=f"{request.user.first_name} {request.user.last_name}".strip() or request.user.username,
                    duration=int(duration) if duration else 0,
                    order=Lesson.objects.filter(course=course).count() + 1
                )
                
                from .serializers import LessonSerializer
                serializer = LessonSerializer(lesson, context={'request': request})
                return Response({
                    'success': True,
                    'message': 'Video muvaffaqiyatli yuklandi',
                    'lesson': serializer.data
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    'success': False,
                    'error': f'Video saqlashda xato: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Handle GET - Retrieve lessons
        # Get query parameters
        subject = request.query_params.get('subject', '').strip()
        course_id = request.query_params.get('course_id')
        public = request.query_params.get('public', '').lower() == 'true'
        
        # If public=true, allow anyone to see lessons. Otherwise, only authenticated teachers see their own
        if public:
            # Public mode - show all lessons
            queryset = Lesson.objects.select_related('course').order_by('order', 'created_at')
        else:
            # Teacher mode - show only their lessons
            queryset = Lesson.objects.filter(
                course__teacher_user=request.user
            ).select_related('course').order_by('order', 'created_at')
        
        # Filter by subject (if provided)
        if subject:
            # Filter by course title or course teacher (subject-like filtering)
            queryset = queryset.filter(
                course__title__icontains=subject
            ) | queryset.filter(
                course__teacher__icontains=subject
            )
            
            # Also try matching by teacher subject through Teacher model
            from teachers.models import Teacher
            teachers = Teacher.objects.filter(subject__icontains=subject).values_list('user_id', flat=True)
            if teachers:
                queryset = queryset.filter(course__teacher_user_id__in=teachers)
        
        # Filter by course_id (if provided)
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        
        # Serialize data with comprehensive information
        lessons_data = []
        for lesson in queryset:
            lessons_data.append({
                'id': lesson.id,
                'title': lesson.title,
                'description': lesson.description,
                'video_url': request.build_absolute_uri(lesson.video_file.url) if lesson.video_file else None,
                'video_file': request.build_absolute_uri(lesson.video_file.url) if lesson.video_file else None,
                'duration': getattr(lesson, 'duration', None),
                'views_count': lesson.views_count,
                'rating': getattr(lesson, 'rating', 4.5),
                'teacher_name': lesson.teacher_name,
                'course_id': lesson.course_id,
                'course_title': lesson.course.title if lesson.course else 'Unknown',
                'course_name': lesson.course.title if lesson.course else 'Unknown',
                'order': lesson.order,
                'created_at': lesson.created_at.isoformat() if lesson.created_at else None,
                'uploaded_date': lesson.created_at.isoformat() if lesson.created_at else None,
            })
        
        return Response({
            'success': True,
            'count': len(lessons_data),
            'lessons': lessons_data,
            'results': lessons_data  # For compatibility
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        import traceback
        print(f"Error fetching lessons: {str(e)}")
        traceback.print_exc()
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_delete_teacher(request, user_id):
    """Admin deletes teacher account but keeps courses and videos"""
    # Only admin can delete teachers
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({
            'error': 'Admin huquqlari yo\'q'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = User.objects.get(id=user_id)
        
        # Courses'ni anonymize qil - teacher_user'ni NULL qil va teacher nomini o'zgartir
        courses = Course.objects.filter(teacher_user=user)
        for course in courses:
            course.teacher_user = None
            course.teacher = "Nomalum"
            course.save()
        
        # TeacherApplication'ni o'chir
        TeacherApplication.objects.filter(user=user).delete()
        
        # User akountini o'chir
        user.delete()
        
        return Response({
            'success': True,
            'message': 'O\'qituvchi ma\'lumotlari o\'chirildi, kurslar va video darsliklari qoldi'
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({
            'error': 'O\'qituvchi topilmadi'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def create_admin_user(request):
    """Yangi admin user yaratish - birinchi admin yoki token orqali"""
    try:
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()
        
        if not username or not password:
            return Response({
                'success': False,
                'error': 'Username va parol majburiy'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if len(username) < 3:
            return Response({
                'success': False,
                'error': 'Username kamida 3 ta belgidan iborat bo\'lishi kerak'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if len(password) < 6:
            return Response({
                'success': False,
                'error': 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Agar admin allaqachon mavjud bo'lsa, permission check qil
        admin_count = User.objects.filter(is_staff=True, is_superuser=True).count()
        
        if admin_count > 0:
            # Admin token orqali verify qilish kerak
            if not request.user.is_authenticated:
                return Response({
                    'success': False,
                    'error': 'Admin faqat mavjud admin tomonidan yaratilishi mumkin'
                }, status=status.HTTP_403_FORBIDDEN)
            
            if not (request.user.is_staff or request.user.is_superuser):
                return Response({
                    'success': False,
                    'error': 'Faqat admin yangi admin yarata oladi'
                }, status=status.HTTP_403_FORBIDDEN)
        
        # Username mavjud tekshirish
        if User.objects.filter(username=username).exists():
            return Response({
                'success': False,
                'error': f'Username "{username}" allaqachon mavjud'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Yangi admin user yaratish
        with transaction.atomic():
            admin_user = User.objects.create_user(
                username=username,
                password=password,
                email=f"{username}@admin.local",
                first_name='Admin',
                last_name='User',
                is_staff=True,
                is_superuser=True,
                school_name='Admin Account'
            )
            
            # Token yaratish
            token, created = Token.objects.get_or_create(user=admin_user)
            
            # Django session login
            login(request, admin_user)
            
            return Response({
                'success': True,
                'message': 'Yangi admin muvaffaqiyatli yaratildi',
                'admin': {
                    'id': admin_user.id,
                    'username': admin_user.username,
                    'email': admin_user.email,
                    'created_at': admin_user.created_at
                },
                'token': token.key,
                'redirect_url': '/api/users/admin/dashboard/'
            }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Xato: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_teacher_user(request):
    """Create a new teacher user with subject assignment"""
    try:
        # Check if user is admin
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({
                'success': False,
                'error': 'Faqat admin o\'qituvchi yarata oladi'
            }, status=status.HTTP_403_FORBIDDEN)
        
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()
        subject = request.data.get('subject', '').strip()
        first_name = request.data.get('first_name', '').strip()
        last_name = request.data.get('last_name', '').strip()
        school_name = request.data.get('school_name', '').strip()
        
        # Validation
        if not username or not password:
            return Response({
                'success': False,
                'error': 'Username va parol majburiy'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not subject:
            return Response({
                'success': False,
                'error': 'Fani tanlang'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if len(username) < 3:
            return Response({
                'success': False,
                'error': 'Username kamita 3 ta belgidan iborat bo\'lishi kerak'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if len(password) < 6:
            return Response({
                'success': False,
                'error': 'Parol kamita 6 ta belgidan iborat bo\'lishi kerak'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if username exists
        if User.objects.filter(username=username).exists():
            return Response({
                'success': False,
                'error': f'Username "{username}" allaqachon mavjud'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate subject
        valid_subjects = ['dasturlash', 'matematika', 'fizika', 'kimyo', 'biologiya', 
                         'ingliz-tili', 'rus-tili', 'uzbek-tili', 'tarix', 'geografiya']
        if subject not in valid_subjects:
            return Response({
                'success': False,
                'error': 'Noto\'g\'ri fan tanlandi'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create teacher user
        with transaction.atomic():
            teacher_user = User.objects.create_user(
                username=username,
                password=password,
                email=f"{username}@teacher.local",
                first_name=first_name or 'Teacher',
                last_name=last_name or 'User',
                school_name=school_name or 'School',
                subject=subject,
                avatar='avatars/placeholder-user.jpg',
                is_staff=False,
                is_superuser=False,
                is_active=True
            )
            
            # Create token
            token, created = Token.objects.get_or_create(user=teacher_user)
            
            return Response({
                'success': True,
                'message': 'O\'qituvchi muvaffaqiyatli yaratildi',
                'teacher': {
                    'id': teacher_user.id,
                    'username': teacher_user.username,
                    'first_name': teacher_user.first_name,
                    'last_name': teacher_user.last_name,
                    'subject': teacher_user.subject,
                    'school': teacher_user.school_name,
                    'email': teacher_user.email,
                    'created_at': teacher_user.created_at
                },
                'token': token.key
            }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Xato: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)

