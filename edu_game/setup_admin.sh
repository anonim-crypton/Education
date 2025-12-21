#!/bin/bash

# Admin Dashboard Setup Script
# Bu script barcha zarur migrations va admin account sozlamalarini qiladi

echo "=== Admin Dashboard Setup ==="
echo ""

# 1. Database migrations
echo "1. Running migrations..."
python manage.py makemigrations users
python manage.py migrate users

# 2. Superuser yaratish uchun javob berishni so'rash
echo ""
echo "2. Admin account yaratish..."
read -p "Admin username kiriting: " ADMIN_USERNAME
read -sp "Admin parol kiriting: " ADMIN_PASSWORD
echo ""
read -p "Admin email kiriting: " ADMIN_EMAIL

# 3. Superuser yaratish
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()

if User.objects.filter(username='$ADMIN_USERNAME').exists():
    print("Admin account allaqachon mavjud!")
else:
    user = User.objects.create_superuser(
        username='$ADMIN_USERNAME',
        email='$ADMIN_EMAIL',
        password='$ADMIN_PASSWORD',
        school_name='Admin School'
    )
    print(f"Admin account yaratildi: {user.username}")
END

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "Admin dasboardga kirish uchun:"
echo "URL: http://localhost:3000/admin-dashboard"
echo "Username: $ADMIN_USERNAME"
echo ""
