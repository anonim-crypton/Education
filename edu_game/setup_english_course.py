"""
Script to add English course with lessons to existing teacher
Run with: python manage.py shell < setup_english_course.py
Or: Get-Content setup_english_course.py | python manage.py shell (PowerShell)
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_game.settings')
django.setup()

from users.models import Course, Lesson
from teachers.models import Teacher

try:
    # Mavjud Ingliz-tili o'qituvchisini topish
    teacher = Teacher.objects.filter(subject__icontains='ingliz').first() or Teacher.objects.filter(subject__icontains='english').first()
    
    if not teacher:
        print("❌ Xato: Ingliz-tili o'qituvchisi topilmadi!")
        print("Iltimos avval Teachers qismida Ingliz-tili o'qituvchisini qo'shing: http://localhost:8000/admin/")
        exit()
    
    print(f"✓ O'qituvchi topildi: {teacher.user.get_full_name()}")
    
    # Mavjud kursni o'chirish (agar bo'lsa)
    Course.objects.filter(teacher_user=teacher.user).delete()
    print("✓ Eski kurslar o'chirildi")
    
    # Kurs qo'shish
    course = Course.objects.create(
        title='Ingliz-tili Asoslari',
        teacher=teacher.user.get_full_name(),
        teacher_user=teacher.user,
        lessons=3,
        icon='languages',
        color='from-green-600 to-green-500',
        description=teacher.bio or 'Ingliz tilini o\'rganish uchun to\'liq kurs',
        is_active=True,
        order=0
    )
    
    print(f"✓ Kurs qo'shildi: {course.title}")
    
    # 3 ta dars qo'shish
    lessons = [
        {
            'title': 'Salom va tanishish - Dars 1',
            'description': 'Ingliz tilida salom berish, nomini aytish va tanishish',
        },
        {
            'title': 'Kundalik gaplar - Dars 2',
            'description': 'Kundalik hayotda eng ko\'p ishlatiladigan gaplar va iboralар',
        },
        {
            'title': 'Grammatika asoslari - Dars 3',
            'description': 'Ingliz tilining asosiy grammatika qoidalari va tuzilmasi',
        },
    ]
    
    for i, lesson_data in enumerate(lessons, 1):
        Lesson.objects.create(
            course=course,
            title=lesson_data['title'],
            description=lesson_data['description'],
            teacher_name=teacher.user.get_full_name(),
            views_count=150 - (i * 20),
            order=i
        )
        print(f"  ✓ {lesson_data['title']}")
    
    print("\n" + "="*60)
    print("✅ TAMAM! Ingliz-tili kursi muvaffaqiyatli qo'shildi!")
    print("="*60)
    print(f"\nO'qituvchi: {teacher.user.get_full_name()}")
    print(f"Fani: {teacher.subject}")
    print(f"Darslar soni: 3")
    print("\nTest uchun: http://localhost:3000/courses")
    
except Exception as e:
    print(f"❌ Xato: {str(e)}")
    import traceback
    traceback.print_exc()
