from django.db import models
from django.conf import settings
from django.utils import timezone


class TeacherRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Kutish'),
        ('approved', 'Tasdiqlandi'),
        ('rejected', 'Rad Etildi'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='teacher_requests'
    )
    full_name = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    qualifications = models.TextField(blank=True, null=True)
    experience_years = models.IntegerField()
    bio = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(blank=True, null=True)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=True,
        null=True,
        related_name='approved_teacher_requests',
        on_delete=models.SET_NULL
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = "O'qituvchi so'rovi"
        verbose_name_plural = "O'qituvchi so'rovlari"

    def __str__(self):
        return f"{self.full_name} - {self.get_status_display()}"


class Teacher(models.Model):
    """Tasdiqlangan o'qituvchilar"""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='teacher_profile'
    )
    subject = models.CharField(max_length=255)
    bio = models.TextField(blank=True, null=True)
    experience_years = models.IntegerField(default=0)
    rating = models.FloatField(default=5.0)
    students_count = models.IntegerField(default=0)
    is_blocked = models.BooleanField(default=False, help_text="Blokirovka qilish - o'qituvchi login qila olmaydi")
    is_deleted = models.BooleanField(default=False, help_text="O'qituvchini o'chirish - darslar qoladi, shaxsiy ma'lumot o'chib ketadi")
    blocked_at = models.DateTimeField(blank=True, null=True)
    blocked_reason = models.TextField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "O'qituvchi"
        verbose_name_plural = "O'qituvchilar"

    def __str__(self):
        status = ""
        if self.is_blocked:
            status = " [Blokirovka]"
        elif self.is_deleted:
            status = " [O'chirilgan]"
        return f"{self.user.get_full_name()} ({self.subject}){status}"
