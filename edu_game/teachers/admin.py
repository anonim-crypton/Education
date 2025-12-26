from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import TeacherRequest, Teacher
from users.models import Course, Lesson
import os


def delete_teacher_completely(modeladmin, request, queryset):
    """O'qituvchini butunlay o'chirish - ma'lumot, videolar, barcha bog'lanishlar"""
    count = 0
    deleted_courses = 0
    deleted_lessons = 0
    
    for teacher in queryset:
        teacher_name = teacher.user.get_full_name() or teacher.user.username
        
        # O'qituvchi o'z kurslarini topish
        courses = Course.objects.filter(teacher_user=teacher.user)
        
        for course in courses:
            # Kursning barcha videolarini o'chirish
            lessons = course.videos.all()
            for lesson in lessons:
                # Video faylni o'chirish
                if lesson.video_file and os.path.exists(lesson.video_file.path):
                    try:
                        os.remove(lesson.video_file.path)
                    except Exception as e:
                        print(f"Video o'chirishda xato: {e}")
                deleted_lessons += 1
            
            # Teacher rasmi o'chirish
            if course.teacher_image and os.path.exists(course.teacher_image.path):
                try:
                    os.remove(course.teacher_image.path)
                except Exception as e:
                    print(f"Rasm o'chirishda xato: {e}")
            
            course.delete()
            deleted_courses += 1
        
        # Avatar o'chirish
        if teacher.user.avatar and os.path.exists(teacher.user.avatar.path):
            try:
                os.remove(teacher.user.avatar.path)
            except Exception as e:
                print(f"Avatar o'chirishda xato: {e}")
        
        # O'qituvchi profilini o'chirish
        teacher.delete()
        
        # CustomUser accountini o'chirish
        teacher.user.delete()
        
        count += 1
    
    modeladmin.message_user(
        request, 
        f"✓ {count}ta o'qituvchi ({deleted_courses}ta kurs, {deleted_lessons}ta video) butunlay o'chirildi."
    )

delete_teacher_completely.short_description = _("🗑️ O'qituvchini TO'LIQ o'chirish (barcha ma'lumot va videolar)")


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
    actions = [delete_teacher_completely]
    
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
