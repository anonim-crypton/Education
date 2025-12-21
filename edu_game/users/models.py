from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator

class CustomUser(AbstractUser):
    """Extended User model with school information"""
    SUBJECT_CHOICES = [
        ('matematika', 'Matematika'),
        ('fizika', 'Fizika'),
        ('kimyo', 'Kimyo'),
        ('biologiya', 'Biologiya'),
        ('ingliz-tili', 'Ingliz-tili'),
        ('rus-tili', 'Rus-tili'),
        ('uzbek-tili', "O'zbek-tili"),
        ('tarix', "O'zbekiston-tarixi"),
        ('geografiya', 'Geografiya'),
        ('dasturlash', 'Web-Dasturlash'),
    ]
    
    school_name = models.CharField(
        max_length=255,
        blank=False,
        null=False,
        help_text="Name of the school"
    )
    is_google_user = models.BooleanField(
        default=False,
        help_text="Whether user registered via Google OAuth"
    )
    subject = models.CharField(
        max_length=50,
        choices=SUBJECT_CHOICES,
        null=True,
        blank=True,
        help_text="Subject taught by teacher"
    )
    avatar = models.ImageField(
        upload_to='avatars/',
        null=True,
        blank=True,
        help_text="User profile picture"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users_customuser'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.username} ({self.school_name})"


class TeacherApplication(models.Model):
    """Model for teacher applications"""
    STATUS_CHOICES = [
        ('pending', 'Kutilmoqda'),
        ('approved', 'Tasdiqlandi'),
        ('rejected', 'Rad qilindi'),
    ]
    
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='teacher_application'
    )
    full_name = models.CharField(
        max_length=255,
        help_text="Teacher's full name"
    )
    subject = models.CharField(
        max_length=255,
        help_text="Subject to teach"
    )
    experience_years = models.PositiveIntegerField(
        help_text="Years of teaching experience"
    )
    qualifications = models.TextField(
        blank=True,
        help_text="Certifications and qualifications"
    )
    bio = models.TextField(
        blank=True,
        help_text="Teacher bio/description"
    )
    phone = models.CharField(
        max_length=20,
        blank=True,
        help_text="Contact phone number"
    )
    assigned_courses = models.ManyToManyField(
        'Course',
        blank=True,
        related_name='teacher_assignments',
        help_text="Courses assigned to this teacher"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users_teacherapplication'
        verbose_name = 'Teacher Application'
        verbose_name_plural = 'Teacher Applications'
    
    def __str__(self):
        return f"{self.full_name} - {self.subject} ({self.status})"


class Course(models.Model):
    """Model for courses displayed in dashboard"""
    ICON_CHOICES = [
        ('code', 'Dasturlash (Code)'),
        ('languages', 'Tillar (Languages)'),
        ('calculator', 'Matematika (Calculator)'),
        ('book', 'Tarix (Book)'),
        ('scale', 'Huquq (Scale)'),
        ('book-open', 'Kitob (BookOpen)'),
    ]
    
    teacher_user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='courses',
        null=True,
        blank=True,
        help_text="Teacher user account"
    )
    title = models.CharField(
        max_length=255,
        help_text="Course name"
    )
    teacher = models.CharField(
        max_length=255,
        help_text="Teacher name"
    )
    lessons = models.PositiveIntegerField(
        default=0,
        help_text="Number of lessons"
    )
    icon = models.CharField(
        max_length=50,
        choices=ICON_CHOICES,
        default='book-open',
        help_text="Course icon type"
    )
    color = models.CharField(
        max_length=100,
        default='from-blue-600 to-blue-500',
        help_text="Gradient color (e.g., 'from-blue-600 to-blue-500')"
    )
    description = models.TextField(
        blank=True,
        help_text="Course description"
    )
    teacher_image = models.ImageField(
        upload_to='teacher_images/',
        null=True,
        blank=True,
        help_text="Teacher profile image"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display order in catalog"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether course is visible"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users_course'
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"{self.title} - {self.teacher}"


class Lesson(models.Model):
    """Model for video lessons uploaded by teachers"""
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='videos',
        help_text="Associated course"
    )
    title = models.CharField(
        max_length=255,
        help_text="Lesson title"
    )
    description = models.TextField(
        blank=True,
        help_text="Lesson description/notes"
    )
    video_file = models.FileField(
        upload_to='videos/',
        help_text="Video file (MP4, WebM, etc.)"
    )
    teacher_name = models.CharField(
        max_length=255,
        help_text="Teacher name"
    )
    views_count = models.PositiveIntegerField(
        default=0,
        help_text="Number of times video has been viewed"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display order in course"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users_lesson'
        verbose_name = 'Lesson'
        verbose_name_plural = 'Lessons'
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"{self.title} - {self.course.title}"


class LoginLog(models.Model):
    """Login history for students and teachers"""
    LOGIN_TYPE_CHOICES = [
        ('student', "O'quvchi"),
        ('teacher', "O'qituvchi"),
    ]
    
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='login_logs'
    )
    login_type = models.CharField(
        max_length=20,
        choices=LOGIN_TYPE_CHOICES,
        help_text="Login turi - student yoki teacher"
    )
    username = models.CharField(
        max_length=255,
        help_text="Logged in username"
    )
    login_time = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text="User IP address"
    )
    device = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Device/Browser info"
    )
    
    class Meta:
        db_table = 'users_loginlog'
        verbose_name = 'Login Log'
        verbose_name_plural = 'Login Logs'
        ordering = ['-login_time']
    
    def __str__(self):
        return f"{self.username} ({self.login_type}) - {self.login_time.strftime('%Y-%m-%d %H:%M')}"


class Notification(models.Model):
    """User notifications for teacher approvals/rejections"""
    NOTIFICATION_TYPES = [
        ('approval', 'Tasdiqlash'),
        ('rejection', 'Rad etish'),
        ('course_created', 'Kurs yaratildi'),
        ('system', 'Tizim'),
    ]
    
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    title = models.CharField(
        max_length=255,
        help_text="Notification title"
    )
    message = models.TextField(
        help_text="Notification message"
    )
    type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPES,
        default='system'
    )
    is_read = models.BooleanField(
        default=False,
        help_text="Whether user has read the notification"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'users_notification'
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"
