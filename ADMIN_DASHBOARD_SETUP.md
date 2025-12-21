# Admin Dashboard Complete Setup Guide

## Yangi o'qituvchi boshqarish tizimi

Bu dokumentda admin-dashboard-ning to'liq ishlash uchun zarur bo'lgan barcha o'rnatishlar keltirilgan.

## 1. Frontend (Next.js) - Allaqachon Tayyorlangan ✅

### O'zgartirilgan fayllar:
- `app/admin-dashboard/page.tsx` - To'liq admin dashboard UI
  - Teacher requests management
  - Teacher approval/rejection system
  - Automatic credential generation
  - Course creation for teachers
  - Notification system
  - Teacher profile management

## 2. Backend (Django) - Zarur o'rnatishlar

### A. Models (Allaqachon tayyorlangan)

#### Notification Model (Yangi)
```python
class Notification(models.Model):
    user = ForeignKey(CustomUser)
    title = CharField
    message = TextField
    type = CharField (approval, rejection, course_created, system)
    is_read = BooleanField
    created_at = DateTimeField
```

### B. API Endpoints (Yangi)

#### 1. Admin Login
```
POST /api/admin/api/login/
Request: {
    "username": "admin_username",
    "password": "admin_password"
}
Response: {
    "success": true,
    "token": "admin_token",
    "admin_username": "admin_username",
    "is_admin": true
}
```

#### 2. Get All Teacher Requests
```
GET /api/admin/teacher-requests/
Headers: Authorization: Token admin_token
Response: [
    {
        "id": 1,
        "user_id": 5,
        "full_name": "Aliyev Mirjon",
        "email": "mirjon@example.com",
        "subject": "Matematika",
        "qualifications": "Bakalavriat",
        "experience_years": 5,
        "bio": "5 yillik tajriba",
        "phone": "+998 99-999-99-99",
        "status": "pending",
        "created_at": "2025-01-15T10:30:00Z"
    }
]
```

#### 3. Approve Teacher Request
```
POST /api/admin/teacher-requests/{request_id}/approve/
Headers: Authorization: Token admin_token
Request: {
    "password": "auto_generated_password"
}
Response: {
    "success": true,
    "message": "Teacher approved successfully",
    "username": "mirjon5",
    "password": "auto_generated_password"
}
```

#### 4. Reject Teacher Request
```
POST /api/admin/teacher-requests/{request_id}/reject/
Headers: Authorization: Token admin_token
Response: {
    "success": true,
    "message": "Teacher request rejected"
}
```

#### 5. Get All Teachers (Approved)
```
GET /api/admin/teachers/
Headers: Authorization: Token admin_token
Response: [
    {
        "id": 1,
        "user_id": 5,
        "first_name": "Aliyev",
        "last_name": "Mirjon",
        "email": "mirjon@example.com",
        "username": "mirjon5",
        "avatar_url": "http://example.com/media/avatars/...",
        "courses_count": 2
    }
]
```

#### 6. Create Course for Teacher
```
POST /api/admin/create-course/
Headers: Authorization: Token admin_token
Request: {
    "teacher_id": 5,
    "title": "Matematika Asoslari",
    "description": "Boshlang'ich matematika kursi"
}
Response: {
    "success": true,
    "message": "Course created successfully",
    "course": {
        "id": 3,
        "teacher_user": 5,
        "title": "Matematika Asoslari",
        "description": "Boshlang'ich matematika kursi",
        ...
    }
}
```

#### 7. Send Notification
```
POST /api/notifications/send/
Headers: Authorization: Token admin_token
Request: {
    "user_id": 5,
    "title": "So'rovingiz Tasdiqlandi",
    "message": "Sizning o'qituvchi so'rovingiz tasdiqlandi!",
    "type": "approval"
}
Response: {
    "success": true,
    "message": "Notification sent successfully"
}
```

#### 8. Get User Notifications
```
GET /api/notifications/
Headers: Authorization: Token user_token
Response: {
    "success": true,
    "count": 5,
    "notifications": [
        {
            "id": 1,
            "title": "So'rovingiz Tasdiqlandi",
            "message": "Sizning o'qituvchi so'rovingiz tasdiqlandi!",
            "type": "approval",
            "is_read": false,
            "created_at": "2025-01-15T10:30:00Z"
        }
    ]
}
```

## 3. Django Settings O'rnatish

### urls.py ni UPDATE qiling:
```python
from django.urls import path, include

urlpatterns = [
    ...
    path('api/', include('users.urls')),
    ...
]
```

### Database Migration

```bash
cd edu_game
python manage.py makemigrations users
python manage.py migrate users
```

## 4. Frontend Integration

### Admin Login (admin-dashboard orqali)
1. Admin username va password kiritadi
2. `/api/admin/api/login/` endpoint ga so'rov yuboriladi
3. Token localStorage-da saqlanadi
4. Admin dashboard ochiladi

### Teacher Requests Flow
```
become-teacher page -> /api/teachers/apply/ -> TeacherApplication yaratiladi
                                                ↓
                                        admin-dashboard
                                                ↓
                              Admin tasktomonidan ko'riladi
                                                ↓
                                    Tasdiqlash/Rad etish
                                                ↓
                    Notification tizimiga xabar yuboriladi
                                                ↓
                    Teacher to'rtmaydda habarnoma ko'rinadi
```

### Teacher Profile Creation Flow
```
Admin approves -> Credentials generate -> Teacher account updated
       ↓
Teacher dashboard -> /api/teacher/courses/
       ↓
Can create courses -> /api/admin/create-course/
       ↓
Can upload lessons -> /api/teacher/upload-lesson/
```

## 5. Become-Teacher Page O'rnatish

`app/become-teacher/page.tsx` allaqachon to'g'ri sozlangan:
- Form validation ✅
- Phone number formatting ✅
- API integration ✅
- Success/Error messages ✅
- Redirect to dashboard ✅

## 6. Testing Checklist

### Admin Funktsiyalari
- [ ] Admin login qilishi
- [ ] Teacher requests ro'yxatini ko'rishi
- [ ] Teacher request ma'lumotlarini to'liq ko'rishi
- [ ] Teacher request tasdiqlash
- [ ] Teacher request rad etish
- [ ] Credentials avtomatik yaratilishi
- [ ] Approved teachers ro'yxatini ko'rishi
- [ ] O'qituvchi uchun kurs yaratishi

### Teacher Funktsiyalari
- [ ] So'rov yuborish
- [ ] Admin tasdiqlash xabarini olishi
- [ ] Kurs yaratishi
- [ ] Video qo'shishi

### Notification Funktsiyalari
- [ ] Tasdiqlash xabarnomasi yuborilishi
- [ ] Rad etish xabarnomasi yuborilishi
- [ ] User notification'larni ko'rishi

## 7. API URL Mapping

```
POST   /api/admin/api/login/                                  - Admin login
GET    /api/admin/teacher-requests/                           - Barcha requests
POST   /api/admin/teacher-requests/{id}/approve/              - Tasdiqlash
POST   /api/admin/teacher-requests/{id}/reject/               - Rad etish
GET    /api/admin/teachers/                                   - Approved teachers
POST   /api/admin/create-course/                              - Course yaratish
POST   /api/notifications/send/                               - Notification send
GET    /api/notifications/                                    - User notifications
```

## 8. Environment Variables

Kerak bo'lgan o'zgaruvchilar (.env faylida):
```
DJANGO_SECRET_KEY=your_secret_key
DEBUG=False (production-da)
ALLOWED_HOSTS=localhost,127.0.0.1,your_domain.com
DATABASE_URL=sqlite:///db.sqlite3
```

## 9. Admin Account Yaratish

Agar admin account yo'q bo'lsa:
```bash
cd edu_game
python manage.py createsuperuser
```

Keyin Django admin panelida user-ni staff qilish:
```python
# manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(username='admin')
user.is_staff = True
user.is_superuser = True
user.save()
```

## 10. Muhim Eslatmalar

1. **Token Authentication**: Barcha API endpoint-lari token-based authentication dan foydalanadi
2. **Permission Checks**: Admin API-lar `is_staff` yoki `is_superuser` tekshiradi
3. **Automatic Credentials**: Admin tasdiqlasa, system avtomatik username va parol yaratadi
4. **Notifications**: Har bir approval/rejection automatik notification yuboradi
5. **Course Management**: O'qituvchi courselari ko'rsatiladi va manage qilinadi

## 11. Xato Tuzatish

Agar Notification model qo'shilaganda xato bo'lsa:
```bash
python manage.py makemigrations
python manage.py migrate
```

Agar token authentication xatoga kelsa:
```bash
# Terminal-dan
python manage.py drf_create_token <username>
```

## Frontend Testing

Admin dashboard test qilish:
1. `http://localhost:3000/admin-dashboard`
2. Admin credentials bilan login
3. Teacher requests ko'rish va approve/reject qilish
4. Teachers ro'yxatini ko'rish
5. Course yaratish

## Mumkin Bo'lgan Muammolar va Yechimi

### Problem: "Permission denied" xatosi
**Solution**: Admin user `is_staff=True` bo'lishini tekshiring

### Problem: Notification yo'q
**Solution**: Migration qilganini tekshiring va `Notification` modeli DB-da bor-yo'qligini ko'ring

### Problem: Password shakllantirilmay
**Solution**: `admin_approve_teacher_view` function-ida password parameter pass qilganini tekshiring

---

**Barcha sistem hozir to'liq ishlashga tayyorlangan!** ✅
