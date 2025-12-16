import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_game.settings')
django.setup()

from users.models import Course

# Mavjud kurslarni o'chirish
Course.objects.all().delete()
print("✅ Mavjud kurslar o'chirildi")

# Yangi kurslarni qo'shish
courses_data = [
    {
        'title': 'Dasturlash',
        'teacher': 'Ali Qodirov',
        'lessons': 24,
        'icon': 'code',
        'color': 'from-blue-600 to-blue-500',
        'description': 'Python, JavaScript va web development asoslari',
        'order': 1,
    },
    {
        'title': 'Ingliz tili',
        'teacher': 'Fotima Shodmonova',
        'lessons': 18,
        'icon': 'languages',
        'color': 'from-green-600 to-green-500',
        'description': 'IELTS preparation va English conversation',
        'order': 2,
    },
    {
        'title': 'Matematika',
        'teacher': 'Abdulaziz Olimov',
        'lessons': 30,
        'icon': 'calculator',
        'color': 'from-purple-600 to-purple-500',
        'description': 'Algebra, Geometry va Calculus',
        'order': 3,
    },
    {
        'title': 'Tarix',
        'teacher': 'Shahlo Karimova',
        'lessons': 15,
        'icon': 'book',
        'color': 'from-orange-600 to-orange-500',
        'description': "O'zbek tarixi va Jahon tarixi",
        'order': 4,
    },
    {
        'title': 'Huquq',
        'teacher': 'Oleg Petrov',
        'lessons': 12,
        'icon': 'scale',
        'color': 'from-red-600 to-red-500',
        'description': 'Konstitutsiya va fuqarolik huquqi',
        'order': 5,
    },
]

for course_data in courses_data:
    course = Course.objects.create(
        title=course_data['title'],
        teacher=course_data['teacher'],
        lessons=course_data['lessons'],
        icon=course_data['icon'],
        color=course_data['color'],
        description=course_data['description'],
        order=course_data['order'],
        is_active=True,
    )
    print(f"✅ Kurs qo'shildi: {course.title}")

print("\n" + "="*50)
print("📚 KURSLAR KATALOGI TAYYOR")
print("="*50)
print("Django Admin: http://localhost:8000/admin/users/course/")
print("API: http://localhost:8000/api/users/courses/")
print("="*50)
