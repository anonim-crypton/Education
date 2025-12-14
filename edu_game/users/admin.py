from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    """Admin interface for CustomUser model"""
    fieldsets = BaseUserAdmin.fieldsets + (
        ('School Information', {
            'fields': ('school_name',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    list_display = ['username', 'email', 'school_name', 'first_name', 'last_name', 'is_active']
    list_filter = ['is_active', 'created_at', 'school_name']
    search_fields = ['username', 'email', 'school_name']
    ordering = ['-created_at']
    
    readonly_fields = ['created_at', 'updated_at']
