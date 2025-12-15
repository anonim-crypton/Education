from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser


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
