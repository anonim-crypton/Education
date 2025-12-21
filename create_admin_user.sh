#!/bin/bash
cd "c:\Users\ozodb\OneDrive\Documents\GitHub\Education\edu_game"
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()

# Check if admin exists
if User.objects.filter(username='admin').exists():
    print("Admin user allaqachon mavjud!")
else:
    # Create admin
    User.objects.create_superuser(
        username='admin',
        email='admin@edugame.com',
        password='Admin@12345',
        school_name='Admin Panel'
    )
    print("✓ Admin user yaratildi!")
    print("Username: admin")
    print("Password: Admin@12345")
EOF
