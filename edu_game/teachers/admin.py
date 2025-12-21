from django.contrib import admin
from .models import TeacherRequest, Teacher


@admin.register(TeacherRequest)
class TeacherRequestAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'subject', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('full_name', 'subject', 'user__email')
    readonly_fields = ('created_at', 'approved_at', 'approved_by')

    fieldsets = (
        ('Foydalanuvchi', {'fields': ('user',)}),
        ('Shaxsiy Ma\'lumot', {'fields': ('full_name', 'subject', 'experience_years')}),
        ('Batafsil', {'fields': ('qualifications', 'bio', 'phone')}),
        ('Status', {'fields': ('status', 'created_at', 'approved_at', 'approved_by')}),
    )


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('get_full_name', 'subject', 'experience_years', 'rating', 'students_count', 'is_blocked', 'created_at')
    list_filter = ('rating', 'created_at', 'is_blocked', 'subject')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'subject', 'bio')
    readonly_fields = ('created_at', 'updated_at', 'blocked_at', 'deleted_at')
    ordering = ['-created_at']
    
    fieldsets = (
        ('Foydalanuvchi', {
            'fields': ('user',)
        }),
        ('O\'qituvchi Ma\'lumotlari', {
            'fields': ('subject', 'bio', 'experience_years', 'rating')
        }),
        ('O\'quvchilar', {
            'fields': ('students_count',)
        }),
        ('Blokirovka', {
            'fields': ('is_blocked', 'blocked_at', 'blocked_reason'),
            'classes': ('collapse',)
        }),
        ('O\'chirish', {
            'fields': ('is_deleted', 'deleted_at'),
            'classes': ('collapse',)
        }),
        ('Vaqtlar', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_full_name(self, obj):
        """Display full name"""
        return obj.user.get_full_name() or obj.user.username
    get_full_name.short_description = "O'qituvchi"
