from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from django.conf import settings
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """Get current user profile"""
    serializer = UserSerializer(request.user)
    return Response({
        'success': True,
        'user': serializer.data
    }, status=status.HTTP_200_OK)


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
        
        # Verify token with Google
        url = 'https://www.googleapis.com/oauth2/v1/tokeninfo'
        response = requests.get(url, params={'access_token': token})
        
        if response.status_code != 200:
            return Response({
                'success': False,
                'errors': {'token': ['Invalid token']}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        token_data = response.json()
        email = token_data.get('email')
        
        if not email:
            return Response({
                'success': False,
                'errors': {'token': ['Email not found in token']}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create user
        user, created = User.objects.get_or_create(email=email)
        
        if created:
            user.username = email.split('@')[0]
            user.school_name = request.data.get('school_name', 'Not specified')
            user.set_unusable_password()
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
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'success': False,
            'errors': {'general': [str(e)]}
        }, status=status.HTTP_400_BAD_REQUEST)

