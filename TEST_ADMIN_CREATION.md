# Admin Yaratish Tizimi - Test Plani

## 1. Setup

### 1.1 - Eski Admin'larni O'chirish
```bash
cd edu_game
python manage.py clear_admins
# yoki
python manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.filter(is_superuser=True).delete()
exit()
```

### 1.2 - Server Boshlash
```bash
cd edu_game
python manage.py runserver 127.0.0.1:8000
```

## 2. Test Ssenariylari

### Test 1: Birinchi Admin Yaratish (Hech Qanday Autentifikatsiya Yo'q)

**Taqlid:**
1. Browser'da `http://127.0.0.1:8000/` ni oching
2. API Status Dashboard ko'rinsing
3. O'ng pastki burchakda `+` tugmasini bosing
4. Modal ochiladiM
5. Forma toldiringM:
   - Username: `superadmin`
   - Parol: `SecurePassword123`
6. "Yaratish" tugmasini bosing

**Kutilgan Natija:**
- Modal "Muvaffaqiyatli!" xabarini ko'rsatadi
- 3 soniya keyin admin login sahifasiga yo'naltiriladi
- Browser URL o'zgaradi: `/api/users/admin/login/`

**Tekshirish:**
```bash
# Database'da tekshirish
python manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()
admin = User.objects.get(username='superadmin')
print(f"Username: {admin.username}")
print(f"Is Superuser: {admin.is_superuser}")
print(f"Is Staff: {admin.is_staff}")
```

### Test 2: Admin Login

**Taqlid:**
1. Login sahifasiga kirasiz (`/api/users/admin/login/`)
2. Username: `superadmin`
3. Parol: `SecurePassword123`
4. "Login" tugmasini bosing

**Kutilgan Natija:**
- Admin Dashboard sahifasiga yo'naltiriladi
- Teacher requests va approvals ko'rinadi

### Test 3: Duplicate Username

**Taqlid:**
1. Admin sifatida login qiling
2. API Status sahifasiga (`http://127.0.0.1:8000/`) kirib, `+` tugmasini bosing
3. Username: `superadmin` (bilan bir xil)
4. Parol: `AnotherPassword123`
5. "Yaratish" tugmasini bosing

**Kutilgan Natija:**
- Error xabari: "Username \"superadmin\" allaqachon mavjud"
- Modal ochiq qoladi
- Form reset bo'lmaydi

### Test 4: Weak Parol

**Taqlid:**
1. Admin sifatida login qiling
2. `+` tugmasini bosing
3. Username: `newadmin`
4. Parol: `123` (3 ta belgi)
5. "Yaratish" tugmasini bosing

**Kutilgan Natija:**
- Error xabari: "Parol kamida 6 ta belgidan iborat bo'lishi kerak"
- Form ichida qoladi

### Test 5: Yangi Admin Yaratish (Token orqali)

**Taqlid:**
1. Ilk admin sifatida login qiling
2. `+` tugmasini bosing
3. Username: `admin2`
4. Parol: `SecurePassword456`
5. "Yaratish" tugmasini bosing

**Kutilgan Natija:**
- Muvaffaqiyatli admin yaratiladi
- Login xabarida username ko'rsatiladi
- Admin dashboard'ga yo'naltiriladi

**Tekshirish:**
```bash
python manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()
admin2 = User.objects.get(username='admin2')
print(f"Admin2 Created: {admin2.created_at}")
print(f"Is Superuser: {admin2.is_superuser}")
```

### Test 6: Permission Check - Non-Admin User

**Taqlid:**
1. Oddiy foydalanuvchi sifatida register va login qiling
2. Token'ni oling
3. API'ga POST request yuboring:

```bash
curl -X POST http://127.0.0.1:8000/api/users/admin/api/create/ \
  -H "Authorization: Token <USER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "hacker",
    "password": "password123"
  }'
```

**Kutilgan Natija:**
- Error: 403 Forbidden
- Xabar: "Faqat admin yangi admin yarata oladi"

### Test 7: Empty Fields

**Taqlid:**
1. `+` tugmasini bosing
2. Forma bo'sh qoldiring
3. "Yaratish" tugmasini bosing

**Kutilgan Natija:**
- HTML5 validation: "Please fill out this field"
- Server-side validation ham to'g'ri ishlashi kerak

## 3. API Testing (cURL/Postman)

### 3.1 - Birinchi Admin Yaratish

```bash
curl -X POST http://127.0.0.1:8000/api/users/admin/api/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "apiadmin",
    "password": "ApiPassword123"
  }'
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Yangi admin muvaffaqiyatli yaratildi",
  "admin": {
    "id": 1,
    "username": "apiadmin",
    "email": "apiadmin@admin.local",
    "created_at": "2025-12-19T10:30:00Z"
  },
  "token": "abc123def456..."
}
```

### 3.2 - Duplicate Username

```bash
curl -X POST http://127.0.0.1:8000/api/users/admin/api/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "apiadmin",
    "password": "AnotherPassword123"
  }'
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Username \"apiadmin\" allaqachon mavjud"
}
```

### 3.3 - Yangi Admin (Token required)

```bash
curl -X POST http://127.0.0.1:8000/api/users/admin/api/create/ \
  -H "Authorization: Token abc123def456..." \
  -H "Content-Type: application/json" \
  -d '{
    "username": "secondadmin",
    "password": "SecondPassword123"
  }'
```

## 4. Database Check

```bash
python manage.py shell
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()

# Barcha admin'larni ko'rish
admins = User.objects.filter(is_superuser=True)
for admin in admins:
    token = Token.objects.get(user=admin)
    print(f"Username: {admin.username}")
    print(f"Email: {admin.email}")
    print(f"Created: {admin.created_at}")
    print(f"Token: {token.key}")
    print("---")
```

## 5. Security Checks

- [ ] Birinchi admin hech qanday token tekshiruvsiz yaratiladi
- [ ] Keyingi admin'lar faqat login qilgan admin tomonidan yaratiladi
- [ ] Weak parollar reject qilinadi
- [ ] Username duplication prevent qilinadi
- [ ] CSRF token bo'lishi kerak form submission'da

## 6. Rollback Test

Agar hammasi xato ketsa:

```bash
# Barcha superuser'larni o'chirish
python manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.filter(is_superuser=True).delete()
# Yangi admin yaratishni qayta urinib ko'ring
```

## 7. Production Deployment Check

Deployment'da:
- `ALLOWED_HOSTS` to'g'ri configur
- `DEBUG = False`
- CSRF protection enabled
- HTTPS enabled (recommended)
- Token generation secure
