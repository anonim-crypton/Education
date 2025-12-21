#!/usr/bin/env python
"""
Django management script to cleanup duplicate courses
Run: python cleanup_duplicates.py
"""
import os
import django

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_game.settings')
django.setup()

from edu_game.users.models import Course

print("=== DUPLICATE COURSES CLEANUP ===\n")

# Group courses by title
course_titles = Course.objects.values('title').distinct()

for title_obj in course_titles:
    title = title_obj['title']
    courses = Course.objects.filter(title=title).order_by('id')
    count = courses.count()
    
    if count > 1:
        print(f"Title: '{title}' - {count} ta course topildi:")
        for c in courses:
            print(f"  ID: {c.id}, Teacher: {c.teacher}, Videos: {c.videos.count()}")
        
        # Keep first, delete rest
        to_delete = courses[1:]
        delete_count = len(to_delete)
        to_delete.delete()
        print(f"  ✓ {delete_count} ta duplicate o'chirildi\n")

print("✅ CLEANUP TAMAMLANDI!")

# Show remaining courses
print("\nQolgan courses:")
for c in Course.objects.all():
    print(f"  - {c.title} ({c.teacher}) - {c.videos.count()} video")
