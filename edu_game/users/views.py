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
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    GoogleRegisterSerializer, ProfileUpdateSerializer,
    TeacherApplicationSerializer, CourseSerializer
)
from .models import TeacherApplication, Course, LoginLog
import json
import requests

User = get_user_model()


def api_status(request):
    """API status page - shows API is connected"""
    return render(request, 'api_status.html')


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
    """User login endpoint - automatically detects student or teacher"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        # Check if user is a teacher
        is_teacher = False
        teacher_status = None
        login_type = 'student'  # Default to student
        
        if hasattr(user, 'teacher_application') and user.teacher_application.status == 'approved':
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
            'teacher_status': teacher_status,
            'login_type': login_type,  # 'student' or 'teacher'
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
    return Response({
        'success': True,
        'user': serializer.data
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
    # Check if user already has a teacher application
    if hasattr(request.user, 'teacher_application'):
        return Response({
            'message': 'Siz allaqachon o\'qituvchi so\'rovini yuborgan edingiz.',
            'status': request.user.teacher_application.status
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Create new teacher application
    data = request.data.copy()
    data['user'] = request.user.id
    
    serializer = TeacherApplicationSerializer(data=data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response({
            'message': 'O\'qituvchi so\'rovingiz muvaffaqiyatli yuborildi.',
            'application': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'message': 'Xato yuz berdi',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


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
                # Check if teacher
                if hasattr(user, 'teacher_application') and user.teacher_application.status == 'approved':
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

