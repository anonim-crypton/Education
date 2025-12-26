#!/usr/bin/env python
"""
Ingliz-tili kursining eski videolarini o'chirish script'i
"""
import os
import sys
import django

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_game.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

django.setup()

from edu_game.users.models import Course, Lesson

def delete_english_course_lessons():
    """Ingliz-tili kursining barcha videolarini o'chirish"""
    try:
        # Ingliz-tili kurs'ini topish
        courses = Course.objects.filter(title__icontains='Ingliz')
        
        if not courses.exists():
            print("❌ Ingliz-tili kurs topilmadi!")
            return False
        
        print(f"✅ Topildi: {courses.count()} ta Ingliz-tili kurs")
        
        total_deleted = 0
        for course in courses:
            print(f"\n📚 Kurs: {course.title}")
            print(f"   Teacher: {course.teacher}")
            
            # Bu kurs'ga tegishli darslarni topish
            lessons = Lesson.objects.filter(course=course)
            
            if not lessons.exists():
                print(f"   ℹ️  Darslar topilmadi")
                continue
            
            print(f"   🎬 Darslar soni: {lessons.count()}")
            
            # Darslarni o'chirish
            for lesson in lessons:
                print(f"      🗑️  O'chirilyapti: {lesson.title} (ID: {lesson.id})")
                
                # Video faylni o'chirish
                if lesson.video_file:
                    try:
                        if os.path.exists(lesson.video_file.path):
                            os.remove(lesson.video_file.path)
                            print(f"         ✓ Video fayl o'chirildi")
                    except Exception as e:
                        print(f"         ⚠️  Video fayl o'chirilmadi: {e}")
                
                # Lesson'ni o'chirish
                lesson_title = lesson.title
                lesson.delete()
                print(f"         ✓ Dars ma'lumoti o'chirildi")
                total_deleted += 1
            
            # Course darslar sonini update qilish
            course.lessons = Lesson.objects.filter(course=course).count()
            course.save()
            print(f"   ✓ Kurs yangilandi: {course.lessons} ta dars qoldi")
        
        print(f"\n{'='*50}")
        print(f"✅ Jami o'chirildi: {total_deleted} ta dars")
        print(f"{'='*50}")
        return True
        
    except Exception as e:
        print(f"❌ Xato: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("🔄 Ingliz-tili kursining videolarini o'chirish boshlandi...\n")
    success = delete_english_course_lessons()
    
    if success:
        print("\n✨ Jarayon muvaffaqiyatli yakunlandi!")
    else:
        print("\n❌ Jarayon xatosi bilan yakunlandi!")
    
    sys.exit(0 if success else 1)
