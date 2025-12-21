from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser, TeacherApplication, Course, LoginLog, Lesson


def delete_users(modeladmin, request, queryset):
    """Delete selected users action"""
    count = queryset.count()
    queryset.delete()
    modeladmin.message_user(request, f"{count}ta foydalanuvchi o'chirildi.")


delete_users.short_description = _("Tanlangan foydalanuvchilarni o'chirish")


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    """Admin interface for CustomUser model"""
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
    
    list_display = ['username', 'email', 'get_full_name', 'school_name', 'subject', 'is_active', 'is_staff', 'created_at']
    list_filter = ['is_active', 'is_staff', 'is_superuser', 'created_at', 'school_name', 'is_google_user', 'subject']
    search_fields = ['username', 'email', 'school_name', 'first_name', 'last_name', 'subject']
    ordering = ['-created_at']
    
    readonly_fields = ['created_at', 'updated_at']
    actions = [delete_users]
    
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


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    """Admin interface for Course model"""
    list_display = ['title', 'teacher', 'teacher_user', 'lessons', 'icon', 'order', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at', 'icon', 'teacher_user']
    search_fields = ['title', 'teacher', 'description', 'teacher_user__username']
    ordering = ['order', 'created_at']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['order', 'is_active']
    
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


class LessonInline(admin.TabularInline):
    """Inline lessons for Course admin"""
    model = Lesson
    extra = 1
    fields = ['title', 'description', 'video_file', 'views_count', 'order']
    ordering = ['order']


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


# Update CourseAdmin to include inline lessons
class CourseAdminUpdated(admin.ModelAdmin):
    """Admin interface for Course model with inline lessons"""
    list_display = ['title', 'teacher', 'teacher_user', 'lessons', 'icon', 'order', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at', 'icon', 'teacher_user']
    search_fields = ['title', 'teacher', 'description', 'teacher_user__username']
    ordering = ['order', 'created_at']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['order', 'is_active']
    inlines = [LessonInline]  # Add inline lessons
    
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


# Unregister old CourseAdmin and register updated one
admin.site.unregister(Course)
admin.site.register(Course, CourseAdminUpdated)


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
