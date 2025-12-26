#!/usr/bin/env python
"""
Ingliz-tili kursining eski videolarini o'chirish
"""
import os
import sys
import django

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_game.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

django.setup()

from edu_game.users.models import Course, Lesson, User

def cleanup_english_course():
    """Ingliz-tili kursini cleanup qilish"""
    try:
        print("=" * 60)
        print("🔍 Ingliz-tili kurs ma'lumotlarini tekshirish...")
        print("=" * 60)
        
        # Ingliz-tili kurs'ini topish
        english_courses = Course.objects.filter(title__icontains='Ingliz')
        
        if not english_courses.exists():
            print("❌ Ingliz-tili kurs topilmadi!")
            return False
        
        print(f"\n✅ Topildi: {english_courses.count()} ta Ingliz-tili kurs\n")
        
        for course in english_courses:
            print(f"📚 Kurs: {course.title}")
            print(f"   ID: {course.id}")
            print(f"   Teacher: {course.teacher}")
            print(f"   Teacher User: {course.teacher_user.username if course.teacher_user else 'None'}")
            
            # Bu kurs'ga tegishli darslarni topish
            lessons = Lesson.objects.filter(course=course)
            
            print(f"   📊 Darslar soni: {lessons.count()}\n")
            
            if lessons.count() > 0:
                print("   Darslar ro'yxati:")
                for i, lesson in enumerate(lessons, 1):
                    print(f"      {i}. {lesson.title} (ID: {lesson.id})")
                    print(f"         Teacher: {lesson.teacher_name if hasattr(lesson, 'teacher_name') else 'N/A'}")
                    print(f"         Video fayli: {lesson.video_file.name if lesson.video_file else 'None'}")
                
                # Confirm deletion
                print("\n" + "=" * 60)
                response = input(f"\n⚠️  Bu kurs'ning {lessons.count()} ta darsini o'chirmoqchimisiz? (yes/no): ")
                
                if response.lower() == 'yes':
                    total_deleted = 0
                    for lesson in lessons:
                        # Video faylni o'chirish
                        if lesson.video_file:
                            try:
                                video_path = lesson.video_file.path
                                if os.path.exists(video_path):
                                    os.remove(video_path)
                                    print(f"      ✓ Video fayl o'chirildi: {lesson.video_file.name}")
                            except Exception as e:
                                print(f"      ⚠️  Video fayl o'chirilmadi: {e}")
                        
                        # Lesson'ni o'chirish
                        lesson.delete()
                        total_deleted += 1
                        print(f"      ✓ Dars o'chirildi: {lesson.title}")
                    
                    # Course darslar sonini update qilish
                    course.lessons = Lesson.objects.filter(course=course).count()
                    course.save()
                    print(f"\n   ✅ {total_deleted} ta dars o'chirildi!")
                    print(f"   ✅ Kurs yangilandi: {course.lessons} ta dars qoldi\n")
                else:
                    print("\n❌ Bekor qilindi!\n")
        
        print("=" * 60)
        print("✨ Jarayon yakunlandi!")
        print("=" * 60)
        return True
        
    except Exception as e:
        print(f"❌ Xato: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    cleanup_english_course()
