"""
Django shell script to populate sample courses with teachers and lessons
Run with: python manage.py shell < populate_courses.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_game.settings')
django.setup()

from users.models import CustomUser, Course, Lesson
from teachers.models import Teacher

# Sample courses data with teachers
COURSES_DATA = [
    {
        'username': 'english_teacher',
        'first_name': 'John',
        'last_name': 'Smith',
        'email': 'john@example.com',
        'subject': 'Ingliz-tili',
        'bio': 'Professional English teacher with 15 years experience',
        'course_title': 'English Fundamentals',
        'course_icon': 'languages',
        'course_color': 'from-green-600 to-green-500',
        'lessons': [
            {
                'title': 'English Basics - Lesson 1',
                'description': 'Introduction to English language and pronunciation',
            },
            {
                'title': 'English Basics - Lesson 2',
                'description': 'Common English phrases and greetings',
            },
            {
                'title': 'English Basics - Lesson 3',
                'description': 'Basic grammar rules and sentence structure',
            },
        ]
    },
    {
        'username': 'math_teacher',
        'first_name': 'Ahmadjon',
        'last_name': 'Karimov',
        'email': 'ahmadjon@example.com',
        'subject': 'Matematika',
        'bio': 'Mathematics expert specializing in algebra and geometry',
        'course_title': 'Mathematics Essentials',
        'course_icon': 'calculator',
        'course_color': 'from-blue-600 to-blue-500',
        'lessons': [
            {
                'title': 'Basic Arithmetic',
                'description': 'Addition, subtraction, multiplication, and division',
            },
            {
                'title': 'Algebra Fundamentals',
                'description': 'Understanding variables and linear equations',
            },
            {
                'title': 'Geometry Basics',
                'description': 'Shapes, angles, and geometric properties',
            },
        ]
    },
    {
        'username': 'physics_teacher',
        'first_name': 'Dilshod',
        'last_name': 'Nazarov',
        'email': 'dilshod@example.com',
        'subject': 'Fizika',
        'bio': 'Physics teacher with expertise in mechanics and thermodynamics',
        'course_title': 'Physics Fundamentals',
        'course_icon': 'code',
        'course_color': 'from-purple-600 to-purple-500',
        'lessons': [
            {
                'title': 'Motion and Forces',
                'description': 'Understanding Newton\'s laws of motion',
            },
            {
                'title': 'Energy and Work',
                'description': 'Kinetic and potential energy concepts',
            },
            {
                'title': 'Waves and Sound',
                'description': 'Properties of waves and sound propagation',
            },
        ]
    },
    {
        'username': 'chemistry_teacher',
        'first_name': 'Feruza',
        'last_name': 'Abdullayeva',
        'email': 'feruza@example.com',
        'subject': 'Kimyo',
        'bio': 'Chemistry professor with research background in organic chemistry',
        'course_title': 'Chemistry Essentials',
        'course_icon': 'book-open',
        'course_color': 'from-yellow-600 to-yellow-500',
        'lessons': [
            {
                'title': 'Atomic Structure',
                'description': 'Understanding atoms, electrons, and atomic orbitals',
            },
            {
                'title': 'Chemical Bonding',
                'description': 'Ionic and covalent bonds explained',
            },
            {
                'title': 'Reactions and Equations',
                'description': 'Balancing chemical equations and reaction types',
            },
        ]
    },
    {
        'username': 'biology_teacher',
        'first_name': 'Shoxista',
        'last_name': 'Qodirova',
        'email': 'shoxista@example.com',
        'subject': 'Biologiya',
        'bio': 'Biology teacher specializing in cell biology and genetics',
        'course_title': 'Biology Basics',
        'course_icon': 'leaf',
        'course_color': 'from-green-600 to-green-500',
        'lessons': [
            {
                'title': 'Cell Structure and Function',
                'description': 'Understanding prokaryotic and eukaryotic cells',
            },
            {
                'title': 'Genetics and Inheritance',
                'description': 'Mendel\'s laws and DNA structure',
            },
            {
                'title': 'Evolution and Natural Selection',
                'description': 'Darwin\'s theory and evolution mechanisms',
            },
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
print("Populating courses with teachers and lessons...")
print("="*60 + "\n")

for course_data in COURSES_DATA:
    try:
        create_user_and_courses(course_data)
    except Exception as e:
        print(f"✗ Error creating {course_data['subject']}: {str(e)}")

print("\n" + "="*60)
print("Done! Courses populated successfully.")
print("="*60)
print("\nAdmin panel: http://localhost:8000/admin/")
print("Test Frontend: http://localhost:3000/courses")
