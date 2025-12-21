#!/usr/bin/env python
"""
Script to create superuser/admin account
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_game.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Check if admin already exists
if User.objects.filter(username='admin').exists():
    print("Admin foydalanuvchi allaqachon mavjud!")
    admin = User.objects.get(username='admin')
    print(f"Username: admin")
    print(f"Email: {admin.email}")
    print(f"Is Staff: {admin.is_staff}")
    print(f"Is Superuser: {admin.is_superuser}")
else:
    # Create superuser
    admin = User.objects.create_superuser(
        username='admin',
        email='admin@edugame.com',
        password='Admin@12345',
        school_name='Main Admin School'
    )
    print("✓ Admin user muvaffaqiyatli yaratildi!")
    print(f"\nUsername: admin")
    print(f"Password: Admin@12345")
    print(f"Email: admin@edugame.com")
    print(f"Is Staff: {admin.is_staff}")
    print(f"Is Superuser: {admin.is_superuser}")
    print(f"\nAdmin panelga kirish: /users/admin/login/")
