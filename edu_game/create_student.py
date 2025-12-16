#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_game.settings')
django.setup()

from users.models import CustomUser

# Yangi student yaratish
user, created = CustomUser.objects.get_or_create(
    username='student1',
    defaults={
        'email': 'student1@example.com',
        'school_name': 'Demo School'
    }
)

if created:
    user.set_password('Student@123')
    user.save()
    print(f"✅ Yangi student yaratildi: {user.username}")
else:
    print(f"⚠️  Student allaqachon mavjud: {user.username}")

print(f"Email: {user.email}")
print(f"School: {user.school_name}")
print(f"\n🔐 Daxlga kirish uchun:")
print(f"Username: student1")
print(f"Password: Student@123")
