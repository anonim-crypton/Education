# ⚡ Tez Boshlash (Quick Start)

## 1️⃣ Terminal 1: Django Backend

```bash
cd c:\Users\ozodb\OneDrive\Documents\GitHub\Education\edu_game

# Migrations
python manage.py makemigrations && python manage.py migrate

# Teacher yaratish
python create_teacher.py

# Kurslar yaratish
python create_courses.py

# Server boshlash
python manage.py runserver
```

**Kutish:** "Starting development server at http://127.0.0.1:8000/"

## 2️⃣ Terminal 2: Next.js Frontend

```bash
cd c:\Users\ozodb\OneDrive\Documents\GitHub\Education

npm run dev
```

**Kutish:** "Local: http://localhost:3000"

## 3️⃣ Browser'da Test Qilish

### Student Login
```
URL: http://localhost:3000/login

Username: (har qanday ro'yxatdan o'tgan student)
Password: (student paroli)

Natija: Dashboard'ga yo'naltirilishi kerak (/dashboard)
```

### Teacher Login
```
URL: http://localhost:3000/login

Username: teacher_demo
Password: Teacher@123456

Natija: Django Admin'ga yo'naltirilishi kerak (/admin/)
```

### Django Admin
```
URL: http://localhost:8000/admin/

Username: admin (yoki teacher_demo)
Password: (admin paroli)

Ko'rishlar:
- Courses (5 ta kurs)
- Login Logs (barcha kirishan)
- Teacher Applications (approved status)
```

## 4️⃣ Tekshiruv Qadamlari

✅ **Django API**
```
http://localhost:8000/api/users/courses/
```
5 ta kurs ko'rishi kerak JSON format'da

✅ **Dashboard**
```
http://localhost:3000/dashboard
```
6-column grid'da 5 ta kurs ko'rishi kerak

✅ **Login Log**
```
http://localhost:8000/admin/users/loginlog/
```
Har bir login yozilishi kerak (student/teacher)

## 🎯 System Flow

```
LOGIN FORM (1 ta)
    ↓
    ├─→ Teacher? → /admin/
    └─→ Student? → /dashboard
    
Database:
    ├─ CustomUser (username, password)
    ├─ TeacherApplication (teacher_demo)
    ├─ LoginLog (barcha kirishan)
    └─ Course (5 ta kurs)
```

## ❌ Common Issues

### "ModuleNotFoundError: No module named 'django'"
```bash
pip install django djangorestframework
```

### "sqlite3.OperationalError: table users_course has no column named teacher_user_id"
```bash
python manage.py makemigrations
python manage.py migrate
```

### "Courses ko'rinmayapti"
```bash
python create_courses.py
```

### "Login error"
```bash
python manage.py shell
from users.models import CustomUser
CustomUser.objects.all()  # Tekshirish
```

## 📊 Minimal Test Data

```python
# create_test_user.py
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_game.settings')
django.setup()

from users.models import CustomUser

# Test student
user = CustomUser.objects.create_user(
    username='student1',
    email='student1@test.com',
    password='Test@123456',
    school_name='Test School'
)
print(f"✅ Student created: {user.username}")
```

Ishga tushirish:
```bash
python create_test_user.py
```

## 🚀 Done!

Hamma tayyor! Login qiling va ishni boshlang.

```
🔓 Teacher Panel: /admin/
📊 Student Dashboard: /dashboard
🔑 Default Teacher: teacher_demo / Teacher@123456
```
