# BACKEND SETUP GUIDE - O'QITUVCHI SO'ROV TIZIMI

**Muammo:** Frontend'dan so'rovlar yuborilayabdi lekin backend API'lar yo'q  
**Xato:** `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`  
**Sabab:** `/api/teachers/apply/` endpoint'i topilmayapti

---

## 📋 BACKEND PROJECT SETUP

### 1️⃣ DJANGO PROJECT YARATISH

```bash
# Virtual environment yaratish
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# MacOS/Linux:
source venv/bin/activate

# Django o'rnatish
pip install django djangorestframework django-cors-headers python-decouple

# Project yaratish
django-admin startproject education

# App yaratish
cd education
python manage.py startapp teachers
python manage.py startapp users  # Agar yo'q bo'lsa
```

### 2️⃣ SETTINGS.PY KONFIGURATSIYA

```python
# education/settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'teachers',  # Yangi
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Qo'shish
    'django.middleware.common.CommonMiddleware',
    # ... rest
]

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
]

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Timezone
TIME_ZONE = 'Asia/Tashkent'
USE_TZ = True
```

---

## 🗂️ TEACHERS APP - MODELS.PY

```python
# teachers/models.py

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class TeacherRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Kutish'),
        ('approved', 'Tasdiqlandi'),
        ('rejected', 'Rad Etildi'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='teacher_requests')
    full_name = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    qualifications = models.TextField(blank=True, null=True)
    experience_years = models.IntegerField()
    bio = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(blank=True, null=True)
    approved_by = models.ForeignKey(
        User,
        blank=True,
        null=True,
        related_name='approved_teacher_requests',
        on_delete=models.SET_NULL
    )
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "O'qituvchi so'rovi"
        verbose_name_plural = "O'qituvchi so'rovlari"
    
    def __str__(self):
        return f"{self.full_name} - {self.get_status_display()}"


class Teacher(models.Model):
    """Tasdiqlangan o'qituvchilar"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile')
    subject = models.CharField(max_length=255)
    bio = models.TextField(blank=True, null=True)
    experience_years = models.IntegerField(default=0)
    rating = models.FloatField(default=5.0)
    students_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "O'qituvchi"
        verbose_name_plural = "O'qituvchilar"
    
    def __str__(self):
        return f"{self.user.get_full_name()} ({self.subject})"
```

---

## 📤 SERIALIZERS.PY

```python
# teachers/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TeacherRequest, Teacher

class TeacherRequestSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = TeacherRequest
        fields = [
            'id', 'user_id', 'full_name', 'subject',
            'qualifications', 'experience_years', 'bio', 'phone',
            'status', 'created_at', 'user_email'
        ]
        read_only_fields = ['id', 'created_at', 'user_email']


class TeacherSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Teacher
        fields = [
            'id', 'user_id', 'username', 'email', 'full_name',
            'subject', 'bio', 'experience_years', 'rating',
            'students_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
```

---

## 🎯 VIEWS.PY

```python
# teachers/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from django.utils import timezone
from django.db import transaction
import secrets
import string

from .models import TeacherRequest, Teacher
from .serializers import TeacherRequestSerializer, TeacherSerializer


class TeacherRequestViewSet(viewsets.ModelViewSet):
    queryset = TeacherRequest.objects.all()
    serializer_class = TeacherRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return TeacherRequest.objects.all()
        return TeacherRequest.objects.filter(user=self.request.user)
    
    def create(self, request):
        """O'qituvchi so'rovi yuborish"""
        try:
            data = request.data.copy()
            data['user'] = request.user.id
            
            # Tekshirish: foydalanuvchi allaqachon so'rov bermibmi?
            existing = TeacherRequest.objects.filter(
                user=request.user,
                status='pending'
            ).first()
            
            if existing:
                return Response(
                    {'message': 'Siz allaqachon so\'rov bermishsiz. Iltimos, natijani kuting.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(
                    {
                        'message': 'O\'qituvchi so\'rovingiz muvaffaqiyatli yuborildi!',
                        **serializer.data
                    },
                    status=status.HTTP_201_CREATED
                )
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response(
                {'message': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def approve(self, request, pk=None):
        """O'qituvchi so'rovini tasdiqlash"""
        try:
            teacher_request = self.get_object()
            
            if teacher_request.status != 'pending':
                return Response(
                    {'message': 'Bu so\'rov allaqachon qayta tekshirilgan.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            with transaction.atomic():
                # Username yaratish
                username = self._generate_username(teacher_request.full_name)
                # Parol yaratish
                password = self._generate_password()
                
                # User'ni update qilish
                user = teacher_request.user
                user.username = username
                user.set_password(password)
                user.save()
                
                # Teacher profile yaratish yoki update qilish
                teacher, created = Teacher.objects.get_or_create(user=user)
                teacher.subject = teacher_request.subject
                teacher.bio = teacher_request.bio
                teacher.experience_years = teacher_request.experience_years
                teacher.save()
                
                # TeacherRequest'ni update qilish
                teacher_request.status = 'approved'
                teacher_request.approved_at = timezone.now()
                teacher_request.approved_by = request.user
                teacher_request.save()
                
                # Optional: Email jo'natish
                self._send_approval_email(user, username, password, teacher_request)
            
            return Response({
                'message': 'O\'qituvchi tasdiqlandi! Username va parol yaratildi.',
                'username': username,
                'password': password,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'full_name': user.get_full_name(),
                    'is_teacher': True
                }
            })
        
        except Exception as e:
            return Response(
                {'message': f'Xato: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def reject(self, request, pk=None):
        """O'qituvchi so'rovini rad etish"""
        try:
            teacher_request = self.get_object()
            
            if teacher_request.status != 'pending':
                return Response(
                    {'message': 'Bu so\'rov allaqachon qayta tekshirilgan.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            rejection_reason = request.data.get('rejection_reason', 'Tafsil mavjud emas')
            
            teacher_request.status = 'rejected'
            teacher_request.save()
            
            # Optional: Email jo'natish
            self._send_rejection_email(teacher_request, rejection_reason)
            
            return Response({
                'message': 'O\'qituvchi so\'rovi rad etildi.',
                'user_id': teacher_request.user_id
            })
        
        except Exception as e:
            return Response(
                {'message': f'Xato: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _generate_username(self, full_name):
        """Username generatsiya"""
        base = full_name.lower().replace(' ', '_')
        username = base
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base}{counter}"
            counter += 1
        return username
    
    def _generate_password(self, length=12):
        """Vaqtinchalik parol generatsiya"""
        characters = string.ascii_letters + string.digits
        return ''.join(secrets.choice(characters) for _ in range(length))
    
    def _send_approval_email(self, user, username, password, teacher_request):
        """Approval email jo'natish"""
        from django.core.mail import send_mail
        
        subject = "Tabriklaymark! O'qituvchi so'rovingiz tasdiqlandi!"
        message = f"""
        Assalomu alaykim {user.first_name}!
        
        Sizning o'qituvchi so'rovingiz tasdiqlandi!
        
        Tizimga kirish uchun:
        Username: {username}
        Parol: {password}
        
        EHTIYOT: Bu parolni xavfsiz joyda saqlang va birinchi kirishda o'zingizning parolini yaratib olgan.
        
        Saytga o'ting: http://localhost:3000/login
        
        Shukriya!
        Edugame Team
        """
        
        try:
            send_mail(subject, message, 'info@edugame.uz', [user.email])
        except:
            pass  # Email xatosi bo'lsa, davom et
    
    def _send_rejection_email(self, teacher_request, reason):
        """Rejection email jo'natish"""
        from django.core.mail import send_mail
        
        subject = "O'qituvchi so'rovingiz haqida"
        message = f"""
        Assalomu alaykim {teacher_request.full_name}!
        
        Sizning o'qituvchi so'rovingiz atrofida ko'rib chiqildi.
        
        Af soraeymiz, lekin shu paytda sizning so'rovingiz qabul qilinmadi.
        
        Sabab: {reason}
        
        Agar sizda savollar bo'lsa, admin@edugame.uz ga yozing.
        
        Shukriya va qayta urinib ko'rishdan bo'ymaysiz!
        Edugame Team
        """
        
        try:
            send_mail(subject, message, 'info@edugame.uz', [teacher_request.user.email])
        except:
            pass


class TeacherViewSet(viewsets.ReadOnlyModelViewSet):
    """Tasdiqlangan o'qituvchilarni ko'rish"""
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated]
```

---

## 🔗 URLS.PY

```python
# teachers/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeacherRequestViewSet, TeacherViewSet

router = DefaultRouter()
router.register(r'teachers/requests', TeacherRequestViewSet, basename='teacher-request')
router.register(r'teachers', TeacherViewSet, basename='teacher')

urlpatterns = [
    path('', include(router.urls)),
]
```

---

## 🌐 MAIN URLS.PY

```python
# education/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('teachers.urls')),
]
```

---

## 📦 ADMIN.PY

```python
# teachers/admin.py

from django.contrib import admin
from .models import TeacherRequest, Teacher

@admin.register(TeacherRequest)
class TeacherRequestAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'subject', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('full_name', 'subject', 'user__email')
    readonly_fields = ('created_at', 'approved_at', 'approved_by')
    
    fieldsets = (
        ('Foydalanuvchi', {'fields': ('user',)}),
        ('Shaxsiy Ma\'lumot', {'fields': ('full_name', 'subject', 'experience_years')}),
        ('Batafsil', {'fields': ('qualifications', 'bio', 'phone')}),
        ('Status', {'fields': ('status', 'created_at', 'approved_at', 'approved_by')}),
    )


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('user', 'subject', 'rating', 'students_count')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__username', 'subject')
```

---

## 🚀 MIGRATION VA RUN

```bash
# Model migration yaratish
python manage.py makemigrations

# Migration apply qilish
python manage.py migrate

# Admin user yaratish
python manage.py createsuperuser
# Username: admin
# Email: admin@example.com
# Password: (o'zingizning paroli)

# Server ishga tushirish
python manage.py runserver
# http://localhost:8000 da bo'ladi
```

---

## ✅ TEST QILISH

### Admin Portal Test
```bash
# 1. Admin'ga kirish
http://localhost:8000/admin
Username: admin
Password: (yaratgan parol)

# 2. TeacherRequest'lar ko'rish
# 3. Status'larni tekshirish
```

### API Test (Postman yoki curl)
```bash
# So'rov yuborish
curl -X POST http://localhost:8000/api/teachers/requests/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token YOUR_TOKEN" \
  -d '{
    "full_name": "Ali Qodirov",
    "subject": "Dasturlash",
    "experience_years": 5,
    "qualifications": "Bakalavriat",
    "bio": "5 yil tajribam bor",
    "phone": "+998 91 234 5678"
  }'

# So'rovlar ro'yxati
curl -X GET http://localhost:8000/api/teachers/requests/ \
  -H "Authorization: Token YOUR_TOKEN"

# Tasdiqlash
curl -X POST http://localhost:8000/api/teachers/requests/1/approve/ \
  -H "Authorization: Token ADMIN_TOKEN"

# Rad etish
curl -X POST http://localhost:8000/api/teachers/requests/1/reject/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token ADMIN_TOKEN" \
  -d '{"rejection_reason": "Tavsiya xat yo'q"}'
```

---

## 🔐 .ENV.LOCAL KONFIGURATSIYA

Frontend .env.local:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📋 CHECKLIST

- [ ] Django project yaratish
- [ ] teachers app yaratish
- [ ] models.py implement
- [ ] serializers.py implement
- [ ] views.py implement
- [ ] urls.py implement
- [ ] migration yaratish va apply
- [ ] Admin super user yaratish
- [ ] Server ishga tushirish
- [ ] API test qilish (Postman)
- [ ] Frontend test qilish

---

## ❓ MUAMMOLAR VA SOLUTIONS

### Muammo: "No such table: teachers_teacherrequest"
```bash
# Solution: Migration'lar ishlamagan
python manage.py migrate
```

### Muammo: CORS Error
```python
# settings.py'da CORS_ALLOWED_ORIGINS'ni tekshiring
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Frontend port
    "http://127.0.0.1:3000",
]
```

### Muammo: "AuthenticationFailed"
```
# Frontend'da token'ni tekshiring
localStorage.getItem('access_token')
```

---

**Tayyor! Backend'ga kin berildi. Endi API'lar ishlaya boshlaydi!** 🚀
