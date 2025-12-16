# Login Sistema Alohida Yo'nalishlar (Teachers vs Students)

## Tavsif

Bitta login form'dan foydalanib:
- **Students** - Dashboard-ga yo'naltiriladi (`/dashboard`)
- **Teachers** - Django Admin Panelga yo'naltiriladi (`/admin/`)

Avtomatik ravishda user tipi tekshiriladi va to'g'ri joyga yo'naltiriladi.

## Qilgan Ishlar

### 1. Backend Changes (Django)

#### LoginLog Model yaratildi
```python
# users/models.py
class LoginLog(models.Model):
    LOGIN_TYPE_CHOICES = [
        ('student', "O'quvchi"),
        ('teacher', "O'qituvchi"),
    ]
    
    user = ForeignKey(CustomUser)
    login_type = CharField()  # 'student' yoki 'teacher'
    username = CharField()
    login_time = DateTimeField(auto_now_add=True)
    ip_address = GenericIPAddressField()
    device = CharField()
```

#### Login View o'zgartirildi
```python
# users/views.py - login_view()
- Avtomatik ravishda teacher status tekshiradi
- login_type = 'teacher' yoki 'student' qaytaradi
- LoginLog'ga kirish yoziladi
- IP address va device info saqlanadi
```

#### Admin Panel
```
http://localhost:8000/admin/
- LoginLog bo'limi - barcha kirishan loglar
- Filter qilish mumkin: login_type, foydalanuvchi, sana
```

### 2. Frontend Changes (Next.js)

#### Login Form (Bitta toza forma)
```
┌─────────────────────────┐
│   Welcome back          │
├─────────────────────────┤
│ Username yoki Email     │
│ ▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭  │
├─────────────────────────┤
│ Parol                   │
│ ▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭  │
├─────────────────────────┤
│ ☐ Meni eslab qol       │
│      [Parolni unutdingiz?]
├─────────────────────────┤
│      [KIRISH]           │
├─────────────────────────┤
│    Google Login         │
└─────────────────────────┘
```

#### Login Logic
```javascript
// /components/ui/login-signup.tsx

handleLogin() {
  1. Username va parol yuborish
  2. Backend javobni kutish
  3. response.login_type tekshirish:
     
     if (login_type === 'teacher') {
       // Django Admin paneliga yo'naltir
       window.location.href = "http://localhost:8000/admin/"
     } else if (login_type === 'student') {
       // Dashboard-ga yo'naltir
       router.push("/dashboard")
     }
  
  4. localStorage'ga saqlash:
     - authToken
     - isLoggedIn
     - userType ('teacher' yoki 'student')
}
```

## Flow Diagrammasi

```
┌─────────────────────────┐
│  LOGIN PAGE (/login)    │
├─────────────────────────┤
│  Username + Password    │
│      [KIRISH]           │
└────────────┬────────────┘
             │
    POST /api/users/login/
             │
    ┌────────▼────────┐
    │  BACKEND CHECK  │
    ├─────────────────┤
    │ hasTeacherApp?  │
    │  status='approved'?
    └────────┬────────┘
             │
    ┌────────┴──────────────┐
    │                       │
    ▼ (is teacher)         ▼ (is student)
┌──────────────┐      ┌─────────────────┐
│ login_type=  │      │  login_type=    │
│ 'teacher'    │      │  'student'      │
└──────┬───────┘      └────────┬────────┘
       │                       │
       │ response.login_type   │
       │                       │
       ▼                       ▼
 ADMIN PANEL            DASHBOARD
 /admin/                /dashboard
```

## Setup Qadamlari

### 1. Migrations Yaratish
```bash
cd edu_game
python manage.py makemigrations
python manage.py migrate
```

### 2. Teacher Yaratish
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

### 3. Test qilish

#### Test 1: Student Login
1. Biror student user bilan login qilish
2. Dashboard-ga yo'naltirilishi kerak (`/dashboard`)
3. LoginLog'da 'student' yozilishi kerak

#### Test 2: Teacher Login
1. `teacher_demo` bilan login qilish:
   - Username: `teacher_demo`
   - Password: `Teacher@123456`
2. Django Admin-ga yo'naltirilishi kerak (`/admin/`)
3. LoginLog'da 'teacher' yozilishi kerak

## Backend API Javob

### Success Response
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "school_name": "Demo School"
  },
  "access": "token_here",
  "is_teacher": false,
  "teacher_status": null,
  "login_type": "student"
}
```

### Teacher Response
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 2,
    "username": "teacher_demo",
    "email": "teacher@edugame.uz",
    "school_name": "Demo Maktab"
  },
  "access": "token_here",
  "is_teacher": true,
  "teacher_status": "approved",
  "login_type": "teacher"
}
```

## LoginLog View (Admin)

Django Admin'da barcha login'larni ko'rish:

```
http://localhost:8000/admin/users/loginlog/
```

**Qidiruv filterlari:**
- login_type: Student/Teacher
- Foydalanuvchi: username bo'yicha qidiruv
- Login vaqti: Date range
- IP address: Qaysi kompyuterdan

**Har bir log'da:**
- Username
- Login type (Student/Teacher)
- Sana va vaqt
- IP address
- Device/Browser info

## Important Notes

⚠️ **O'qituvchilar uchun:**
- StudentLogin form'da login qila oladi
- Automatic ravishda teacher status tekshiriladi
- Agar teacher bo'lsa, admin panelga yo'naltiriladi
- Admin panelda o'z kurslarni qo'sha oladi

✅ **O'quvchilar uchun:**
- StudentLogin form'da login qiladi
- Dashboard-ga yo'naltiriladi
- Kurslarni ko'ra va o'rganishi mumkin

## Qo'shimcha Xususiyatlar

- **Login History**: Barcha kirishan vaqt va IP address saqlanadi
- **User Type Detection**: Avtomatik ravishda teacher/student ajratiladi
- **Secure Redirect**: Teacher'lar admin panelga to'g'ridan-to'g'ri yo'naltiriladi
- **Device Tracking**: Device/Browser info saqlanadi monitoring uchun

## File o'zgarishlari

```
✅ users/models.py
   - LoginLog model qo'shildi

✅ users/views.py
   - login_view updated (login_type qaytaradi)
   - LoginLog yozish qo'shildi

✅ users/admin.py
   - LoginLog admin panel qo'shildi

✅ components/ui/login-signup.tsx
   - Bitta login form (Teacher button olib tashlandi)
   - login_type ni tekshirish qo'shildi
   - Teacher -> /admin/, Student -> /dashboard

✅ scripts
   - create_teacher.py updated
   - create_courses.py created
```
