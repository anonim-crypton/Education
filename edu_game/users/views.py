from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from django.conf import settings
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    GoogleRegisterSerializer, ProfileUpdateSerializer,
    TeacherApplicationSerializer
)
from .models import TeacherApplication
import json
import requests

User = get_user_model()


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
    """User login endpoint"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        user_serializer = UserSerializer(user)
        return Response({
            'success': True,
            'message': 'Login successful',
            'user': user_serializer.data,
            'access': token.key,
            'refresh': None,  # For compatibility with frontend
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
        
        user_serializer = UserSerializer(user)
        return Response({
            'success': True,
            'message': 'Google login successful',
            'user': user_serializer.data,
            'access': auth_token.key,
            'refresh': None,
            'is_new_user': created,  # Frontend uchun - yangi user bo'lsa school name so'rov ko'rsatish
            'needs_school_name': created and user.school_name == 'Not specified',  # School name hali to'ldirilganmi
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

