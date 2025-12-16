# Butun Sistema Setup Qo'llanmasi

## 🎯 Maqsad
- **Bitta Login Form** - Students va Teachers uchun
- **Avtomatik Yo'naltirishlar** - Teacher → Admin Panel, Student → Dashboard
- **Login Log** - Barcha kirishan loglar database'da saqlanadi

## 📋 Prerequisites
- Python 3.11+
- Django 4.2+
- Node.js 18+
- SQLite3 (default)

## 🚀 Step-by-Step Setup

### Stage 1: Django Backend Sozlamasi

#### 1.1 Django Migrations Yaratish
```bash
cd edu_game
python manage.py makemigrations users
python manage.py migrate
```

Output bo'lishi kerak:
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions, users
Running migrations:
  Applying users.0XXX_add_loginlog... OK
```

#### 1.2 Teacher Akkaunt Yaratish
```bash
python create_teacher.py
```

Output:
```
✅ Yangi teacher user yaratildi: teacher_demo
✅ TeacherApplication approved qilindi

🔐 O'qituvchi Paneli:
Django Admin: http://localhost:8000/admin/
Username: teacher_demo
Password: Teacher@123456
```

#### 1.3 Kurslarni Qo'shish
```bash
python create_courses.py
```

Output:
```
✅ Mavjud kurslar o'chirildi
✅ Kurs qo'shildi: Dasturlash
✅ Kurs qo'shildi: Ingliz tili
✅ Kurs qo'shildi: Matematika
✅ Kurs qo'shildi: Tarix
✅ Kurs qo'shildi: Huquq
```

#### 1.4 Superuser (Admin) Yaratish
```bash
python manage.py createsuperuser
```

Prompt'lar:
```
Username: admin
Email: admin@example.com
Password: ••••••••
Password (again): ••••••••
Superuser created successfully.
```

### Stage 2: Database Tekshiruvi

```bash
python manage.py shell
```

```python
from users.models import Course, LoginLog, CustomUser, TeacherApplication

# Kurslarni tekshirish
print(f"Kurslar soni: {Course.objects.count()}")
for course in Course.objects.all():
    print(f"  - {course.title} ({course.lessons} dars)")

# Teacher'larni tekshirish
print(f"\nTeacher'lar soni: {TeacherApplication.objects.filter(status='approved').count()}")
for teacher in TeacherApplication.objects.filter(status='approved'):
    print(f"  - {teacher.full_name} ({teacher.subject})")

# Users'ni tekshirish
print(f"\nJami Users: {CustomUser.objects.count()}")
exit()
```

### Stage 3: Django Server Boshlash

```bash
python manage.py runserver
```

Output:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

**Tekshirish:**
- Django Admin: http://localhost:8000/admin/ (teacher_demo / Teacher@123456)
- API: http://localhost:8000/api/users/courses/

### Stage 4: Next.js Frontend Sozlamasi

#### 4.1 Frontend Development Server Boshlash
```bash
npm run dev
```

Output:
```
▲ Next.js 15.1.0
  - Local:        http://localhost:3000
  - Environments: .env.local
```

#### 4.2 Browser'da Tekshirish
- Dashboard: http://localhost:3000
- Login: http://localhost:3000/login

### Stage 5: Test Cases

#### Test 1: Student Login va Dashboard
```
1. http://localhost:3000/login ga o'ting
2. Student username va parol kiriting
3. Kutilgan natija: /dashboard ga yo'naltirilishi kerak
4. Django Admin -> Login Logs -> 'student' yozilishi kerak
```

#### Test 2: Teacher Login va Admin Panel
```
1. http://localhost:3000/login ga o'ting
2. Teacher ma'lumotlari:
   Username: teacher_demo
   Password: Teacher@123456
3. Kutilgan natija: http://localhost:8000/admin/ ga yo'naltirilishi kerak
4. Django Admin -> Login Logs -> 'teacher' yozilishi kerak
```

#### Test 3: Kurslarni Ko'rish
```
1. Student bo'lib login qiling
2. Dashboard'da 6 ta kurs ko'rishi kerak (har qatorida 6 ta)
3. API endpoint tekshirish: GET http://localhost:8000/api/users/courses/
```

#### Test 4: Login Log's Tekshiruvi
```
1. Django Admin'ga kiring (superuser)
2. "Login Logs" bo'limiga o'ting
3. Barcha login'lar yozilishi kerak (student/teacher)
4. IP address va device info saqlanishi kerak
```

## 📁 File O'zgarishlari Qisqachasi

```
✅ users/models.py
   - LoginLog model qo'shildi

✅ users/views.py  
   - login_view() - login_type qaytaradi
   - LoginLog yazuvi qo'shildi

✅ users/admin.py
   - LoginLogAdmin panel qo'shildi

✅ components/ui/login-signup.tsx
   - Bitta login form (Teacher button o'chirildi)
   - Teacher/Student redirect logic

✅ app/dashboard/page.tsx
   - 6-column grid layout fixed
   - API dan courses fetch

✅ Scripts
   - create_teacher.py - updated
   - create_courses.py - new

✅ Documentation
   - LOGIN_SYSTEM_SEPARATION.md - new
   - COURSES_INTEGRATION.md - updated
```

## 🔧 Debugging

### Agar migrations error bo'lsa:
```bash
# Oxirgi migration'ni o'chirish
python manage.py migrate users 0XXX

# Qayta yaratish
python manage.py makemigrations
python manage.py migrate
```

### Agar courses API error bo'lsa:
```bash
# Course table'ni tekshirish
python manage.py shell
>>> from users.models import Course
>>> Course.objects.all()  # Agar bo'sh bo'lsa:
>>> python create_courses.py
```

### Agar login error bo'lsa:
```bash
# Django logs'ni tekshirish
tail -f /tmp/django.log

# Teacher application tekshirish
python manage.py shell
>>> from users.models import TeacherApplication
>>> TeacherApplication.objects.filter(status='approved')
```

## 📊 Database Structure

```sql
-- Teachers Login vs Students
Users Table:
├── CustomUser
│   ├── username (teacher_demo, john_doe, etc.)
│   ├── password (hashed)
│   └── is_staff (teachers = True)
│
├── TeacherApplication (agar mavjud bo'lsa = teacher)
│   └── status = 'approved'
│
└── LoginLog (barcha kirishan)
    ├── login_type ('student' yoki 'teacher')
    ├── username
    ├── login_time
    └── ip_address
```

## 🔐 Security Notes

1. **Passwords**: Har doim hashed saqlanadi
2. **Login Logs**: IP address va device info saqlanadi
3. **CSRF Protection**: Hamma POST request'lar token bilan himoyalangan
4. **Token Auth**: DRF Token authentication ishlatiladi

## ✅ Verification Checklist

- [ ] Django migrations muvaffaqiyatli qo'llanildi
- [ ] Teacher akkaunt yaratildi (teacher_demo)
- [ ] Kurslar database'da saqlanadi (5 ta)
- [ ] LoginLog table yaratildi
- [ ] Django Admin login ishlaydi
- [ ] Student login dashboard'ga yo'naltiradi
- [ ] Teacher login admin panel'ga yo'naltiradi
- [ ] Login logs saqlanadi
- [ ] API endpoints ishchi holatda

## 🎓 Qo'shimcha Qadamlar (Optional)

### Yangi Student Akkaunt Yaratish
```python
# Django shell
from users.models import CustomUser

user = CustomUser.objects.create_user(
    username='student1',
    email='student1@example.com',
    password='Student@123',
    school_name='Demo School'
)
```

### Yangi Teacher Yaratish
```bash
python create_teacher.py  # Skript allaqachon bor
```

Yoki manual:
```python
# Django shell
from users.models import CustomUser, TeacherApplication

teacher_user = CustomUser.objects.create_user(
    username='teacher2',
    email='teacher2@example.com',
    password='Teacher@123',
    school_name='Demo School',
    is_staff=True
)

TeacherApplication.objects.create(
    user=teacher_user,
    full_name='Teacher Name',
    subject='Subject',
    experience_years=5,
    status='approved'
)
```

## 📞 Support

Agar problem bo'lsa:
1. Logs'ni tekshirish
2. Django shell'da models'ni tekshirish
3. Browser console'da errors'ni tekshirish
4. Network tab'da API requests'ni tekshirish

## 🎉 Tayyor!

Hamma setup tugadi. Login qiling va boshlang!

```
Teacher:
  - Username: teacher_demo
  - Password: Teacher@123456
  - Yo'nalishi: Django Admin

Student:
  - Har qanday ro'yxatdan o'tgan user
  - Yo'nalishi: Dashboard
```
