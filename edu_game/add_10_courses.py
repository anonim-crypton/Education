"""
Django shell script to populate 10 sample courses with teachers and lessons
Run with: python manage.py shell < add_10_courses.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_game.settings')
django.setup()

from users.models import CustomUser, Course, Lesson
from teachers.models import Teacher

# 10 courses data with teachers
COURSES_DATA = [
    {
        'username': 'math_teacher',
        'first_name': 'Ahmadjon',
        'last_name': 'Karimov',
        'email': 'ahmadjon@example.com',
        'subject': 'Matematika',
        'bio': 'Mathematics expert specializing in algebra and geometry',
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
        'subject': 'Fizika',
        'bio': 'Physics teacher with expertise in mechanics and thermodynamics',
        'course_title': 'Fizika Asoslari',
        'course_icon': 'zap',
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
        'subject': 'Kimyo',
        'bio': 'Chemistry professor with research background in organic chemistry',
        'course_title': 'Kimyo Kursi',
        'course_icon': 'beaker',
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
        'subject': 'Biologiya',
        'bio': 'Biology teacher specializing in cell biology and genetics',
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
        'username': 'english_teacher',
        'first_name': 'Nilufar',
        'last_name': 'Rahimova',
        'email': 'nilufar@example.com',
        'subject': 'Ingliz-tili',
        'bio': 'English language teacher with TOEFL certification',
        'course_title': 'Ingliz Tilini O\'rganish',
        'course_icon': 'globe',
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
        'subject': 'Tarix',
        'bio': 'History professor specializing in world history and civilization',
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
        'subject': 'Geografiya',
        'bio': 'Geography teacher with expertise in physical and political geography',
        'course_title': 'Geografiya Kursi',
        'course_icon': 'map',
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
        'subject': 'San\'at',
        'bio': 'Art teacher specializing in painting and digital art',
        'course_title': 'San\'at va Dizayn',
        'course_icon': 'palette',
        'course_color': 'from-pink-600 to-pink-500',
        'lessons': [
            {'title': 'Rang va Shakllar', 'description': 'Rang nazariyasi va vizu..al tuzilish'},
            {'title': 'Rasm Texnikasi', 'description': 'Turli rasm materiallari va texnikalar'},
            {'title': 'Rasm Tarixi', 'description': 'Mashhuor San\'atkorlar va san\'at harakatlari'},
        ]
    },
    {
        'username': 'computer_teacher',
        'first_name': 'Rustam',
        'last_name': 'Abdullayev',
        'email': 'rustam@example.com',
        'subject': 'Informatika',
        'bio': 'Computer science teacher with software development expertise',
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
        'subject': 'Musiqa',
        'bio': 'Music teacher with expertise in classical and contemporary music',
        'course_title': 'Musiqa va Ritm',
        'course_icon': 'music',
        'course_color': 'from-fuchsia-600 to-fuchsia-500',
        'lessons': [
            {'title': 'Notlar va Ritm', 'description': 'Notlar tizimi va ritm o\'lchami'},
            {'title': 'Musiqaviy Asboblar', 'description': 'Turli musiqaviy asboblar va ulardan foydalanish'},
            {'title': 'Musiqa Tarixi', 'description': 'Klassik va zamonaviy musiqa yo\'nalishlari'},
        ]
    },
]

def create_user_and_courses(data):
    """Create user, teacher, course, and lessons"""
    username = data['username']
    
    # Check if user exists
    try:
        user = CustomUser.objects.get(username=username)
        print(f"✓ User '{username}' already exists, skipping...")
    except CustomUser.DoesNotExist:
        # Create user
        user = CustomUser.objects.create_user(
            username=username,
            password='password123',  # Default password
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            school_name='Sample School'
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
        print(f"✓ Created teacher: {teacher.user.get_full_name()} ({data['subject']})")
    else:
        print(f"✓ Teacher exists: {teacher.user.get_full_name()}")
    
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
        print(f"  ✓ Created course: {course.title}")
    else:
        print(f"  ✓ Course exists: {course.title}")
    
    # Create lessons
    for i, lesson_data in enumerate(data.get('lessons', []), 1):
        lesson, created = Lesson.objects.get_or_create(
            course=course,
            title=lesson_data['title'],
            defaults={
                'description': lesson_data['description'],
                'teacher_name': user.get_full_name(),
                'views_count': 100 * i,  # Sample view counts
                'order': i,
            }
        )
        
        if created:
            print(f"    ✓ Created lesson: {lesson.title}")
        else:
            print(f"    ✓ Lesson exists: {lesson.title}")

# Main execution
print("\n" + "="*60)
print("10 ta kurs qo'shilmoqda...")
print("="*60 + "\n")

for course_data in COURSES_DATA:
    try:
        create_user_and_courses(course_data)
    except Exception as e:
        print(f"✗ Error creating {course_data['subject']}: {str(e)}")

print("\n" + "="*60)
print("Done! 10 ta kurs qo'shildi!")
print("="*60)
print("\nBackend: http://localhost:8000/admin/")
print("Frontend: http://localhost:3000/courses")
