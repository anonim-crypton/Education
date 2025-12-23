from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import TeacherApplication, Course

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data"""
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'school_name', 'avatar', 'avatar_url']
        read_only_fields = ['id']
    
    def get_avatar_url(self, obj):
        """Get full avatar URL or default avatar"""
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        # Return default avatar URL
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri('/placeholder-user.jpg')
        return '/placeholder-user.jpg'


class GoogleRegisterSerializer(serializers.Serializer):
    """Serializer for Google OAuth registration completion"""
    school_name = serializers.CharField(required=True, max_length=255)
    
    def validate_school_name(self, value):
        """Check if school name is provided"""
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("Maktab nomini kiriting.")
        return value


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    school_name = serializers.CharField(required=True, max_length=255)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'school_name']
        extra_kwargs = {
            'username': {
                'validators': [],  # Remove default Django validators
            }
        }
    
    def validate_username(self, value):
        """Check if username already exists"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Bunday username allaqachon mavjud.")
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("Username majburiy.")
        return value
    
    def validate_email(self, value):
        """Email validation"""
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("Email majburiy.")
        return value
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Parollar mos kelmadi."})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        # Set default avatar if not provided
        if not user.avatar:
            user.avatar = 'avatars/placeholder-user.jpg'
            user.save()
        return user


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'school_name', 'avatar']
        extra_kwargs = {
            'email': {'read_only': True},  # Email o'zgartirilmasligi kerak
            'school_name': {'read_only': True},  # School name o'zgartirilmasligi kerak
            'first_name': {'read_only': True},
            'last_name': {'read_only': True},
            'avatar': {'required': False},
        }
    
    def validate_username(self, value):
        """Check if username already exists (excluding current user)"""
        user = self.instance
        if User.objects.filter(username=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("Bunday username allaqachon mavjud.")
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("Username majburiy.")
        return value
    
    def update(self, instance, validated_data):
        """Update user profile"""
        # Ma'lumotlarni yangilash
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            raise serializers.ValidationError("Both username and password are required.")
        
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError("Bunday Username va Login mavjud emas.")
        
        if not user.check_password(password):
            raise serializers.ValidationError("Bunday Username va Login mavjude emas.")
        
        if not user.is_active:
            raise serializers.ValidationError("User account is inactive.")
        
        data['user'] = user
        return data


class TeacherApplicationSerializer(serializers.ModelSerializer):
    """Serializer for teacher applications"""
    user_id = serializers.ReadOnlyField(source='user.id')
    username = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = TeacherApplication
        fields = [
            'id', 'user_id', 'username', 'full_name', 'subject',
            'experience_years', 'qualifications', 'bio', 'phone',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user_id', 'username', 'status', 'created_at', 'updated_at']
    
    def validate_experience_years(self, value):
        """Validate experience years"""
        if value < 0:
            raise serializers.ValidationError("Tajriba soni manfiy bo'lishi mumkin emas.")
        if value > 70:
            raise serializers.ValidationError("Tajriba soni 70 yildan ko'p bo'lishi mumkin emas.")
        return value
    
    def validate_full_name(self, value):
        """Validate full name"""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("To'liq ism kamida 2 ta belgidan iborat bo'lishi kerak.")
        return value
    
    def validate_subject(self, value):
        """Validate subject"""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Fan nomi kamida 2 ta belgidan iborat bo'lishi kerak.")
        return value


class LessonSerializer(serializers.ModelSerializer):
    """Serializer for lessons/videos"""
    video_url = serializers.SerializerMethodField()
    course_id = serializers.IntegerField(source='course.id', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    
    class Meta:
        from .models import Lesson
        model = Lesson
        fields = ['id', 'title', 'description', 'video_file', 'video_url', 'teacher_name', 'views_count', 'order', 'created_at', 'duration', 'course_id', 'course_title']
        read_only_fields = ['id', 'created_at']
    
    def get_video_url(self, obj):
        """Get full video URL"""
        if obj.video_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.video_file.url)
            return obj.video_file.url
        return None


class CourseSerializer(serializers.ModelSerializer):
    """Serializer for courses"""
    teacher_image_url = serializers.SerializerMethodField()
    videos_count = serializers.SerializerMethodField()
    total_views = serializers.SerializerMethodField()
    videos = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'teacher', 'lessons', 'icon', 'color', 'description', 'teacher_image', 'teacher_image_url', 'order', 'is_active', 'videos_count', 'total_views', 'videos', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_teacher_image_url(self, obj):
        """Get full teacher image URL or default avatar"""
        if obj.teacher_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.teacher_image.url)
            return obj.teacher_image.url
        # Return default avatar URL
        return '/placeholder-user.jpg'
    
    def get_videos_count(self, obj):
        """Get count of videos in this course"""
        return obj.videos.count()
    
    def get_total_views(self, obj):
        """Get total views of all videos in this course"""
        return sum(video.views_count for video in obj.videos.all())
    
    def get_videos(self, obj):
        """Get all videos in this course"""
        videos = obj.videos.all()
        request = self.context.get('request')
        return LessonSerializer(videos, many=True, context={'request': request}).data
