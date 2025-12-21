from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import TeacherRequest, Teacher

User = get_user_model()


class TeacherRequestSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = TeacherRequest
        fields = [
            'id', 'user_id', 'full_name', 'subject',
            'qualifications', 'experience_years', 'bio', 'phone',
            'status', 'created_at', 'user_email'
        ]
        read_only_fields = ['id', 'created_at', 'user_email']


class TeacherSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = [
            'id', 'user_id', 'username', 'email', 'full_name',
            'subject', 'bio', 'experience_years', 'rating',
            'students_count', 'avatar', 'is_blocked', 'is_deleted',
            'blocked_at', 'blocked_reason', 'deleted_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'blocked_at', 'deleted_at']
    
    def get_avatar(self, obj):
        """Avatar URL qaytarish - fallback to placeholder if no avatar"""
        try:
            if hasattr(obj.user, 'avatar') and obj.user.avatar:
                # Return full URL if avatar exists
                request = self.context.get('request')
                avatar_url = obj.user.avatar.url if hasattr(obj.user.avatar, 'url') else str(obj.user.avatar)
                if request and not avatar_url.startswith('http'):
                    return request.build_absolute_uri(avatar_url)
                return avatar_url
        except Exception as e:
            # Log error but don't fail - return None to use placeholder
            import logging
            logger = logging.getLogger(__name__)
            logger.warning(f"Error getting avatar for teacher {obj.id}: {str(e)}")
        
        # Fallback - return None and let frontend use initials or default avatar
        return None
