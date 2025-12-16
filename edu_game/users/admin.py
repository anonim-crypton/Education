from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser, TeacherApplication, Course, LoginLog


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
        ('Profile', {
            'fields': ('avatar', 'is_google_user'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    list_display = ['username', 'email', 'school_name', 'first_name', 'last_name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at', 'school_name', 'is_google_user']
    search_fields = ['username', 'email', 'school_name', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    readonly_fields = ['created_at', 'updated_at']
    actions = [delete_users]


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
