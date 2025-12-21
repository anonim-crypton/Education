@echo off
REM Admin Dashboard Setup Script (Windows)
REM Bu script barcha zarur migrations va admin account sozlamalarini qiladi

setlocal enabledelayedexpansion

echo === Admin Dashboard Setup ===
echo.

REM 1. Database migrations
echo 1. Running migrations...
python manage.py makemigrations users
python manage.py migrate users

REM 2. Admin account yaratish
echo.
echo 2. Admin account yaratish...
set /p ADMIN_USERNAME="Admin username kiriting: "
set /p ADMIN_PASSWORD="Admin parol kiriting: "
set /p ADMIN_EMAIL="Admin email kiriting: "

REM 3. Python orqali superuser yaratish
python -c ^
"from django.contrib.auth import get_user_model; ^
User = get_user_model(); ^
if User.objects.filter(username='%ADMIN_USERNAME%').exists(): ^
    print('Admin account allaqachon mavjud!'); ^
else: ^
    User.objects.create_superuser(username='%ADMIN_USERNAME%', email='%ADMIN_EMAIL%', password='%ADMIN_PASSWORD%', school_name='Admin School'); ^
    print(f'Admin account yaratildi: %ADMIN_USERNAME%')"

echo.
echo === Setup Complete! ===
echo.
echo Admin dasboardga kirish uchun:
echo URL: http://localhost:3000/admin-dashboard
echo Username: %ADMIN_USERNAME%
echo.
pause
