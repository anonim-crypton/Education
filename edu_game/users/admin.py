from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from django import forms
from django.urls import path
from django.template.response import TemplateResponse
from django.http import HttpResponse
from django.shortcuts import render
from django.contrib import messages
from django.utils.html import format_html
import os
from .models import CustomUser, TeacherApplication, Course, LoginLog, Lesson


class CustomAdminSite(admin.AdminSite):
    """Customize Django admin site"""
    site_header = "Edugame Admin Paneli"
    site_title = "Edugame"
    index_title = "Xush kelibsiz Edugame Admin Panelga"
    
    def index(self, request, extra_context=None):
        """Admin index page - ma'lumotlar bilan"""
        extra_context = extra_context or {}
        
        # Admin soni
        admin_count = CustomUser.objects.filter(is_staff=True, is_superuser=True).count()
        extra_context['admin_count'] = admin_count
        
        # O'qituvchi soni
        from teachers.models import Teacher
        teacher_count = Teacher.objects.count()
        extra_context['teacher_count'] = teacher_count
        
        # Foydalanuvchi soni
        user_count = CustomUser.objects.count()
        extra_context['user_count'] = user_count
        
        # Kurs soni
        course_count = Course.objects.count()
        extra_context['course_count'] = course_count
        
        return super().index(request, extra_context)


# Custom admin site-ni ro'yxatga qo'shish
admin.site = CustomAdminSite()


def delete_courses_with_videos(modeladmin, request, queryset):
    """Kursni va uning barcha videolarini o'chirish"""
    count = 0
    deleted_lessons = 0
    
    for course in queryset:
        # Videolarni o'chirish oldin
        lessons = course.videos.all()
        for lesson in lessons:
            # Video faylni o'chirish
            if lesson.video_file and os.path.exists(lesson.video_file.path):
                try:
                    os.remove(lesson.video_file.path)
                except Exception as e:
                    print(f"Video o'chirishda xato: {e}")
            deleted_lessons += 1
        
        # Kurs ma'lumotlarini o'chirish
        course.delete()
        count += 1
    
    modeladmin.message_user(
        request, 
        f"✓ {count}ta kurs va {deleted_lessons}ta video butunlay o'chirildi."
    )

delete_courses_with_videos.short_description = _("🗑️ Kurslarni va videolarni to'liq o'chirish")


def delete_users(modeladmin, request, queryset):
    """Delete selected users action"""
    count = queryset.count()
    queryset.delete()
    modeladmin.message_user(request, f"{count}ta foydalanuvchi o'chirildi.")


delete_users.short_description = _("Tanlangan foydalanuvchilarni o'chirish")


class AdminCreationForm(forms.ModelForm):
    """Form to create admin user with username and password"""
    password1 = forms.CharField(
        label='Parol',
        widget=forms.PasswordInput,
        required=False,
        help_text='Admin yaratishda parol kiriting'
    )
    password2 = forms.CharField(
        label='Parolni tasdiqlang',
        widget=forms.PasswordInput,
        required=False,
        help_text='Parolni qayta kiriting'
    )
    
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'first_name', 'last_name', 'school_name', 'subject', 'avatar')
    
    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        
        # Yangi admin yaratishda parol majburiy
        if not self.instance.pk and not password1:
            raise forms.ValidationError('Yangi admin uchun parol majburiy!')
        
        if password1 != password2:
            raise forms.ValidationError('Parollar bir-biriga mos emas!')
        
        return cleaned_data
    
    def save(self, commit=True):
        user = super().save(commit=False)
        password = self.cleaned_data.get('password1')
        if password:
            user.set_password(password)
        if commit:
            user.save()
        return user


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    """Admin interface for CustomUser model"""
    change_list_template = "admin/users/customuser_change_list.html"
    
    def get_form(self, request, obj=None, **kwargs):
        """Use AdminCreationForm for adding new users"""
        if obj is None:  # Adding new user
            return AdminCreationForm
        return super().get_form(request, obj, **kwargs)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('School Information', {
            'fields': ('school_name',)
        }),
        ('Teacher Information', {
            'fields': ('subject',),
            'classes': ('collapse',)
        }),
        ('Profile', {
            'fields': ('avatar', 'is_google_user'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'first_name', 'last_name', 'school_name', 'subject', 'password1', 'password2'),
        }),
        ('Huquqlar', {
            'classes': ('collapse',),
            'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Profil', {
            'classes': ('collapse',),
            'fields': ('avatar', 'is_google_user'),
        }),
    )
    
    list_display = ['username', 'email', 'get_full_name', 'school_name', 'subject', 'is_active', 'is_staff', 'created_at']
    list_filter = ['is_active', 'is_staff', 'is_superuser', 'created_at', 'school_name', 'is_google_user', 'subject']
    search_fields = ['username', 'email', 'school_name', 'first_name', 'last_name', 'subject']
    ordering = ['-created_at']
    
    readonly_fields = ['created_at', 'updated_at']
    actions = [delete_users]
    
    def changelist_view(self, request, extra_context=None):
        """Add create_admin_link to context"""
        extra_context = extra_context or {}
        extra_context['create_admin_link'] = '/users/admin/create/'
        return super().changelist_view(request, extra_context)
    
    def get_full_name(self, obj):
        """Display user's full name"""
        return obj.get_full_name() or obj.username
    get_full_name.short_description = "To'liq ism"


@admin.register(TeacherApplication)
class TeacherApplicationAdmin(admin.ModelAdmin):
    """Admin interface for TeacherApplication model"""
    list_display = ['full_name', 'subject', 'experience_years', 'status', 'created_at']
    list_filter = ['status', 'created_at', 'subject']
    search_fields = ['full_name', 'subject', 'user__username', 'user__email']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at', 'user']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Application Details', {
            'fields': ('full_name', 'subject', 'experience_years', 'qualifications', 'bio', 'phone')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class LessonInline(admin.TabularInline):
    """Inline lessons for Course admin"""
    model = Lesson
    extra = 1
    fields = ['title', 'description', 'video_file', 'views_count', 'order']
    ordering = ['order']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    """Admin interface for Course model with inline lessons"""
    list_display = ['title', 'teacher', 'teacher_user', 'lessons', 'icon', 'order', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at', 'icon', 'teacher_user']
    search_fields = ['title', 'teacher', 'description', 'teacher_user__username']
    ordering = ['order', 'created_at']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['order', 'is_active']
    inlines = [LessonInline]
    actions = [delete_courses_with_videos]
    
    fieldsets = (
        ('Kurs Ma\'lumotlari', {
            'fields': ('title', 'teacher', 'teacher_user', 'description')
        }),
        ('O\'qituvchi', {
            'fields': ('teacher_image',)
        }),
        ('Kurs Tafsilotlari', {
            'fields': ('lessons', 'icon', 'color', 'order')
        }),
        ('Holat', {
            'fields': ('is_active',)
        }),
        ('Vaqtlar', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        """Make created_at and updated_at read-only"""
        if obj:
            return self.readonly_fields + ['created_at', 'updated_at']
        return self.readonly_fields


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    """Admin interface for Lesson model"""
    list_display = ['title', 'course', 'teacher_name', 'views_count', 'order', 'created_at']
    list_filter = ['created_at', 'course', 'order']
    search_fields = ['title', 'description', 'course__title', 'teacher_name']
    ordering = ['course', 'order', 'created_at']
    readonly_fields = ['created_at', 'updated_at', 'views_count']
    
    fieldsets = (
        ('Dars Ma\'lumotlari', {
            'fields': ('course', 'title', 'description')
        }),
        ('Video Fayl', {
            'fields': ('video_file',)
        }),
        ('O\'qituvchi', {
            'fields': ('teacher_name',)
        }),
        ('Tartib va Ko\'rinishlar', {
            'fields': ('order', 'views_count')
        }),
        ('Vaqtlar', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(LoginLog)
class LoginLogAdmin(admin.ModelAdmin):
    """Admin interface for LoginLog model"""
    list_display = ['username', 'login_type', 'user', 'login_time', 'ip_address']
    list_filter = ['login_type', 'login_time', 'user']
    search_fields = ['username', 'user__username', 'ip_address']
    ordering = ['-login_time']
    readonly_fields = ['user', 'login_type', 'username', 'login_time', 'ip_address', 'device']
    
    fieldsets = (
        ('Login Ma\'lumotlari', {
            'fields': ('user', 'username', 'login_type')
        }),
        ('Sanab-Solishtirmalar', {
            'fields': ('login_time', 'ip_address', 'device')
        }),
    )
    
    def has_add_permission(self, request):
        """Don't allow manual creation"""
        return False
    
    def has_delete_permission(self, request, obj=None):
        """Allow deletion"""
        return True
