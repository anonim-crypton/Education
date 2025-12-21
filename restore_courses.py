#!/usr/bin/env python
"""
Restore all courses for all teachers
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_game.settings')
django.setup()

from django.contrib.auth import get_user_model
from edu_game.users.models import Course
from edu_game.teachers.models import Teacher

User = get_user_model()

print("=== COURSES RESTORE ===\n")

# Get all teachers
teachers = Teacher.objects.select_related('user').all()

if not teachers.exists():
    print("❌ Hech qanday o'qituvchi topilmadi!")
else:
    created_count = 0
    for teacher in teachers:
        user = teacher.user
        
        course, created = Course.objects.get_or_create(
            teacher_user=user,
            defaults={
                'title': teacher.subject,
                'teacher': user.get_full_name(),
                'description': teacher.bio or '',
                'is_active': True,
                'order': 0
            }
        )
        
        if created:
            print(f"✅ NEW: {teacher.subject} - {user.get_full_name()}")
            created_count += 1
        else:
            print(f"⏭️  EXISTS: {teacher.subject} - {user.get_full_name()}")

print(f"\n✅ TAMAMLANDI! {created_count} ta yangi course yaratildi")

# Show all courses
print("\n=== BARCHA COURSES ===")
courses = Course.objects.all()
for c in courses:
    print(f"  {c.id}. {c.title} - {c.teacher} ({c.videos.count()} video)")

print(f"\nJami: {courses.count()} ta course")
