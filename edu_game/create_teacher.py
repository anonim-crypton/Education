import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_game.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.models import TeacherApplication

User = get_user_model()

# Teacher ma'lumotlari
username = "teacher_demo"
password = "Teacher@123456"
email = "teacher@edugame.uz"
first_name = "Ali"
last_name = "O'qituvchi"

# User yaratish
user, created = User.objects.get_or_create(
    username=username,
    defaults={
        'email': email,
        'first_name': first_name,
        'last_name': last_name,
        'school_name': 'Demo Maktab',
        'is_active': True,
        'is_staff': True,  # Teacher uchun staff huquqi
        'is_superuser': False,
    }
)

if created:
    user.set_password(password)
    user.save()
    print(f"✅ Yangi teacher user yaratildi: {username}")
else:
    user.set_password(password)
    user.is_staff = True
    user.save()
    print(f"✅ Teacher user yangilandi: {username}")

# TeacherApplication yaratish
teacher_app, app_created = TeacherApplication.objects.get_or_create(
    user=user,
    defaults={
        'full_name': f"{first_name} {last_name}",
        'subject': 'Dasturlash',
        'experience_years': 5,
        'qualifications': 'Bachelor in Computer Science',
        'bio': 'Dasturlash va web development o\'qituvchi',
        'phone': '+998901234567',
        'status': 'approved',
    }
)

if app_created:
    print(f"✅ TeacherApplication yaratildi: {teacher_app.status}")
else:
    teacher_app.status = 'approved'
    teacher_app.save()
    print(f"✅ TeacherApplication approved qilindi")

print("\n" + "="*50)
print("📝 TEACHER ACCOUNT MA'LUMOTLARI:")
print("="*50)
print(f"Username: {username}")
print(f"Password: {password}")
print(f"Email: {email}")
print(f"Status: {teacher_app.status}")
print("="*50)
print("\n🔐 O'qituvchi Paneli:")
print("Django Admin: http://localhost:8000/admin/")
print("Username: teacher_demo")
print("Password: Teacher@123456")
print("\n📚 Kurslarni qo'shish:")
print("1. Django Admin-ga kiring")
print("2. 'Courses' bo'limiga o'ting")
print("3. 'Add Course' tugmasini bosing")
print("4. Kurs ma'lumotlarini to'ldiring")
print("="*50)
