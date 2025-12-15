from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator

class CustomUser(AbstractUser):
    """Extended User model with school information"""
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
