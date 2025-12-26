#!/usr/bin/env python
"""
Script to add 10 courses with 3 lessons each
Run: python add_courses_complete.py
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_game.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'edu_game'))
django.setup()

from users.models import CustomUser, Course, Lesson
from teachers.models import Teacher
from django.core.files.base import ContentFile

# 10 courses with teachers and lessons
COURSES_DATA = [
    {
        'username': 'math_teacher',
        'first_name': 'Ahmadjon',
        'last_name': 'Karimov',
        'email': 'ahmadjon@example.com',
        'subject': 'matematika',
        'bio': 'Matematika professionali - algebra va geometriya',
        'course_title': 'Matematika Asoslari',
        'course_icon': 'calculator',
        'course_color': 'from-blue-600 to-blue-500',
        'lessons': [
            {'title': 'Asosiy Arifmetika', 'description': 'Qo\'shish, ayirish, ko\'paytirish va bo\'lish'},
            {'title': 'Algebra Fundamentals', 'description': 'Variables va chiziqli tenglamalarni tushunish'},
            {'title': 'Geometriya Asoslari', 'description': 'Shakllar, burchaklar va geometrik xususiyatlar'},
        ]
    },
    {
        'username': 'physics_teacher',
        'first_name': 'Dilshod',
        'last_name': 'Nazarov',
        'email': 'dilshod@example.com',
        'subject': 'fizika',
        'bio': 'Fizika o\'qituvchisi - mekanika va termodinamika',
        'course_title': 'Fizika Asoslari',
        'course_icon': 'code',
        'course_color': 'from-purple-600 to-purple-500',
        'lessons': [
            {'title': 'Harakat va Kuchlar', 'description': 'Nyuton harakatlar qonunlarini tushunish'},
            {'title': 'Energiya va Ish', 'description': 'Kinetik va potensial energiya tushunchasi'},
            {'title': 'Tolalar va Tovush', 'description': 'Tolalar xossalari va tovush tarqalishi'},
        ]
    },
    {
        'username': 'chemistry_teacher',
        'first_name': 'Feruza',
        'last_name': 'Abdullayeva',
        'email': 'feruza@example.com',
        'subject': 'kimyo',
        'bio': 'Kimyo professori - organik kimyoni izlanish',
        'course_title': 'Kimyo Kursi',
        'course_icon': 'book-open',
        'course_color': 'from-yellow-600 to-yellow-500',
        'lessons': [
            {'title': 'Atom Strukturasi', 'description': 'Atomlar, elektronlar va orbital tushunchasi'},
            {'title': 'Kimyoviy Bog\'lanishlar', 'description': 'Ion va kovalent bog\'lanishlar'},
            {'title': 'Kimyoviy Reaksiyalar', 'description': 'Tenglamalarni tenglashtirish va reaksiya turlari'},
        ]
    },
    {
        'username': 'biology_teacher',
        'first_name': 'Shoxista',
        'last_name': 'Qodirova',
        'email': 'shoxista@example.com',
        'subject': 'biologiya',
        'bio': 'Biologiya o\'qituvchisi - hujayra biologiyasi va genetika',
        'course_title': 'Biologiya Asoslari',
        'course_icon': 'leaf',
        'course_color': 'from-green-600 to-green-500',
        'lessons': [
            {'title': 'Hujayra Strukturasi', 'description': 'Prokariot va eukariota hujayralarni tushunish'},
            {'title': 'Genetika va Meros', 'description': 'Mendel qonunlari va DNK strukturasi'},
            {'title': 'Evolyutsiya', 'description': 'Darvin nazariyasi va evolyutsiya mexanizmlari'},
        ]
    },
    {
        'username': 'english_teacher2',
        'first_name': 'Nilufar',
        'last_name': 'Rahimova',
        'email': 'nilufar@example.com',
        'subject': 'ingliz-tili',
        'bio': 'Ingliz tili o\'qituvchisi - TOEFL sertifikatli',
        'course_title': 'Ingliz Tilini O\'rganish',
        'course_icon': 'book-open',
        'course_color': 'from-red-600 to-red-500',
        'lessons': [
            {'title': 'Abjadiyot va Ovozlar', 'description': 'Ingliz abjadiyoti va fonetika'},
            {'title': 'Grammatika Asoslari', 'description': 'Sodda va murakkab grammatika'},
            {'title': 'Gapirish Va Eshitish', 'description': 'Inglizcha gapirish va tinglash ko\'nikmalari'},
        ]
    },
    {
        'username': 'history_teacher',
        'first_name': 'Bahodir',
        'last_name': 'Shodmonov',
        'email': 'bahodir@example.com',
        'subject': 'tarix',
        'bio': 'Tarix professori - jahon tarixi va tsivilizatsiya',
        'course_title': 'Jahon Tarixi',
        'course_icon': 'book',
        'course_color': 'from-amber-600 to-amber-500',
        'lessons': [
            {'title': 'Qadimiy Tamaddun', 'description': 'Misr, Mesopotamiya va Hindus sanoati'},
            {'title': 'O\'rta Asr Davri', 'description': 'Yevropa va Islom Sharq tarixshunosligi'},
            {'title': 'Zamonaviy Davr', 'description': 'Sanoat inqilobi va zamonaviy qirollik'},
        ]
    },
    {
        'username': 'geography_teacher',
        'first_name': 'Yulduz',
        'last_name': 'Kamalova',
        'email': 'yulduz@example.com',
        'subject': 'geografiya',
        'bio': 'Geografiya o\'qituvchisi - fizik va siyosiy geografiya',
        'course_title': 'Geografiya Kursi',
        'course_icon': 'book-open',
        'course_color': 'from-cyan-600 to-cyan-500',
        'lessons': [
            {'title': 'Yer Shakllanishi', 'description': 'Kontinentlar, okeanlar va tog\'lar'},
            {'title': 'Iqlim va Ob-Havo', 'description': 'Iqlim zonalari va ob-havo turlari'},
            {'title': 'Aholi va Madaniyat', 'description': 'Dunyoning muxtlif mintaqalaridagi odamlar'},
        ]
    },
    {
        'username': 'art_teacher',
        'first_name': 'Gozal',
        'last_name': 'Mirovna',
        'email': 'gozal@example.com',
        'subject': 'matematika',
        'bio': 'San\'at o\'qituvchisi - rasm va raqamli san\'at',
        'course_title': 'San\'at va Dizayn',
        'course_icon': 'book-open',
        'course_color': 'from-pink-600 to-pink-500',
        'lessons': [
            {'title': 'Rang va Shakllar', 'description': 'Rang nazariyasi va vizual tuzilish'},
            {'title': 'Rasm Texnikasi', 'description': 'Turli rasm materiallari va texnikalar'},
            {'title': 'Rasm Tarixi', 'description': 'Mashhur San\'atkorlar va san\'at harakatlari'},
        ]
    },
    {
        'username': 'computer_teacher',
        'first_name': 'Rustam',
        'last_name': 'Abdullayev',
        'email': 'rustam@example.com',
        'subject': 'dasturlash',
        'bio': 'Dasturlash o\'qituvchisi - dastur ishlab chiqish',
        'course_title': 'Dasturlash Asoslari',
        'course_icon': 'code',
        'course_color': 'from-indigo-600 to-indigo-500',
        'lessons': [
            {'title': 'Dasturlash Tushunchasi', 'description': 'Algoritmlar va dasturlash logikasi'},
            {'title': 'Python Asoslari', 'description': 'Python tilining sintaksisi va misollar'},
            {'title': 'Web Dasturlash', 'description': 'HTML, CSS va JavaScript asoslari'},
        ]
    },
    {
        'username': 'music_teacher',
        'first_name': 'Aziza',
        'last_name': 'Karamatova',
        'email': 'aziza@example.com',
        'subject': 'matematika',
        'bio': 'Musiqa o\'qituvchisi - klassik va zamonaviy musiqa',
        'course_title': 'Musiqa va Ritm',
        'course_icon': 'book-open',
        'course_color': 'from-fuchsia-600 to-fuchsia-500',
        'lessons': [
            {'title': 'Notlar va Ritm', 'description': 'Notlar tizimi va ritm o\'lchami'},
            {'title': 'Musiqaviy Asboblar', 'description': 'Turli musiqaviy asboblar va ulardan foydalanish'},
            {'title': 'Musiqa Tarixi', 'description': 'Klassik va zamonaviy musiqa yo\'nalishlari'},
        ]
    },
]

def create_dummy_video():
    """Create a minimal dummy video file"""
    # Create a minimal MP4 file (just enough bytes to be valid)
    dummy_video_data = b'\x00\x00\x00\x20ftypmp42'
    return ContentFile(dummy_video_data, name='dummy_video.mp4')

def create_user_and_course(data):
    """Create user, teacher, course, and lessons"""
    username = data['username']
    
    # Check if user exists
    try:
        user = CustomUser.objects.get(username=username)
        print(f"✓ User '{username}' already exists")
    except CustomUser.DoesNotExist:
        # Create user
        user = CustomUser.objects.create_user(
            username=username,
            password='password123',
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            school_name='O\'zbekiston Maktabi',
            subject=data.get('subject', 'matematika')
        )
        print(f"✓ Created user: {user.get_full_name()}")
    
    # Create or update teacher
    teacher, created = Teacher.objects.get_or_create(
        user=user,
        defaults={
            'subject': data['subject'],
            'bio': data['bio'],
            'experience_years': 10,
            'rating': 4.8,
        }
    )
    
    if created:
        print(f"  ✓ Created teacher: {teacher.user.get_full_name()}")
    
    # Check if course exists
    course, created = Course.objects.get_or_create(
        teacher_user=user,
        defaults={
            'title': data['course_title'],
            'teacher': user.get_full_name(),
            'description': data['bio'],
            'lessons': len(data.get('lessons', [])),
            'icon': data.get('course_icon', 'book-open'),
            'color': data.get('course_color', 'from-blue-600 to-blue-500'),
            'is_active': True,
            'order': 0,
        }
    )
    
    if created:
        print(f"    ✓ Created course: {course.title}")
    else:
        print(f"    ✓ Course exists: {course.title}")
        return  # Skip lessons if course already exists
    
    # Create lessons
    for i, lesson_data in enumerate(data.get('lessons', []), 1):
        lesson, created = Lesson.objects.get_or_create(
            course=course,
            title=lesson_data['title'],
            defaults={
                'description': lesson_data['description'],
                'teacher_name': user.get_full_name(),
                'video_file': create_dummy_video(),
                'views_count': 100 * i,
                'order': i,
                'duration': 300,  # 5 minutes
            }
        )
        
        if created:
            print(f"      ✓ Created lesson: {lesson.title}")

# Main execution
print("\n" + "="*70)
print("10 TA KURS QOSHA SHAHARIDA...")
print("="*70 + "\n")

for i, course_data in enumerate(COURSES_DATA, 1):
    print(f"\n[{i}/10] {course_data['course_title']}")
    print("-" * 70)
    try:
        create_user_and_course(course_data)
    except Exception as e:
        print(f"✗ Error: {str(e)}")
        import traceback
        traceback.print_exc()

print("\n" + "="*70)
print("✅ TAYYORLIK TUGADI!")
print("="*70)
print("\nAdminPanel: http://localhost:8000/admin/")
print("Frontend: http://localhost:3000/courses")
print("Dashboard: http://localhost:3000/dashboard")
