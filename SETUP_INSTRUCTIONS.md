# Sozlash Ko'rsatmalari - Django & Next.js Autentifikatsiyasi

## Backend Sozlash (Django)

### 1. Bog'liqliklarni O'rnatish

```bash
cd edu_game
pip install -r requirements.txt
```

### 2. Atrof-muhit O'zgaruvchilari

`edu_game/` katalogida `.env` faylini yarating:

```
DJANGO_SECRET_KEY=siz-maxfiy-kalit
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 3. Ma'lumotlar Bazasi Migratsiyalari

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Superuser Yaratish

```bash
python manage.py createsuperuser
```

### 5. Ishlab Chiqarish Serverini Ishga Tushirish

```bash
python manage.py runserver
```

Server `http://localhost:8000` da ishlaydi

## Frontend Sozlash (Next.js)

### 1. Atrof-muhit O'zgaruvchilari

Loyihaning asosiy katalogida `.env.local` yarating:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=siz-google-mijoz-id
```

### 2. Bog'liqliklarni O'rnatish

```bash
npm install
```

### 3. Ishlab Chiqarish Serverini Ishga Tushirish

```bash
npm run dev
```

Frontend `http://localhost:3000` da ishlaydi

## Google OAuth Sozlash

### 1. Google Cloud Konsoli

1. [Google Cloud Konsoliga](https://console.cloud.google.com) o'ting
2. Yangi loyiha yarating yoki mavjudini tanlang
3. Google+ API ni faollashtiring
4. Identifikatsiyalar → Identifikatsiyalar Yaratish → OAuth 2.0 Mijoz ID ga o'ting
5. "Veb ilova" ni tanlang
6. Avtorizatsiya qilingan yo'naltiruvchi URI-larni qo'shing:
   - `http://localhost:3000`
   - `http://localhost:3000/login`
   - `http://localhost:3000/register`

### 2. Identifikatsiyalarni Frontend ga Qo'shing

Google Mijoz ID ni `.env.local` ga qo'shing:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=siz-google-mijoz-id
```

## API Yo'naltiruvchi Nuqtalari

### Autentifikatsiya

- **POST** `/api/auth/register/` - Foydalanuvchi ro'yxatdan o'tishi
  - Tanasi: `{username, email, password, password_confirm, school_name}`
  - Javob: `{success, message, user, access, refresh}`

- **POST** `/api/auth/login/` - Foydalanuvchi tizimga kirishi
  - Tanasi: `{username, password}`
  - Javob: `{success, message, user, access, refresh}`

- **POST** `/api/auth/google/` - Google OAuth
  - Tanasi: `{token, school_name}`
  - Javob: `{success, message, user, access, refresh}`

- **GET** `/api/auth/profile/` - Joriy foydalanuvchini olish (token talab qiladi)
  - Sarlavha: `Authorization: Token <access_token>`
  - Javob: `{success, user}`

- **POST** `/api/auth/logout/` - Chiqish (token talab qiladi)
  - Sarlavha: `Authorization: Token <access_token>`
  - Javob: `{success, message}`

## Ma'lumotlar Bazasi Sxemasi

### CustomUser Modeli

```python
- id: AutoField (Asosiy Kalit)
- username: CharField (noyob)
- email: EmailField (noyob)
- first_name: CharField
- last_name: CharField
- password: [REDACTED:password] (shifrlangan)
- school_name: CharField (talab qiladi)
- is_active: BooleanField (default=True)
- created_at: DateTimeField (auto_now_add=True)
- updated_at: DateTimeField (auto_now=True)
```

## Amalga Oshirilgan Funksiyalar

✅ Tekshiruvi bilan foydalanuvchi ro'yxatdan o'tishi
✅ Token-asosidagi autentifikatsiya bilan foydalanuvchi tizimga kirishi
✅ Parol tekshiruvi (minimal 8 belgidan, katta harf, kichik harf, raqam, maxsus belgisi)
✅ Google OAuth Tizimga Kirish
✅ Google OAuth Ro'yxatdan O'tish
✅ Maktab nomi kuzatilishi
✅ Frontend-backend aloqasi uchun CORS ni faollashtirish
✅ Foydalanuvchilarni boshqarish uchun administrator paneli
✅ Token-asosidagi autentifikatsiya
✅ Profil yo'naltiruvchi nuqtasi

## Sinov

### Foydalanuvchini Ro'yxatdan O'tkazish

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "password_confirm": "TestPass123!",
    "school_name": "Test School"
  }'
```

### Tizimga Kirish

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123!"
  }'
```

### Profilni Olish (token bilan)

```bash
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Token SIZNING_TOKEN_SOZI_SINI_SHUNGA_ALMASHTIRING"
```

## Muammolarni Hal Qilish

### CORS Xatoliklari

Quyidagi narsalarni tekshiring:
- `CORS_ALLOWED_ORIGINS` Django sozlamalarida siz frontend URL ni o'z ichiga oladi
- Frontend ruxsat berilgan portda ishlaydi (3000 yoki 3001)

### Ma'lumotlar Bazasi Xatoliklari

Migratsiyalarni ishga tushiring:
```bash
python manage.py makemigrations users
python manage.py migrate
```

### Google OAuth Muammolari

- Google Mijoz ID to'g'ri ekanligini tekshiring
- Google Cloud Konsolida yo'naltiruvchi URI-larni tekshiring
- `.env.local` faylida to'g'ri `NEXT_PUBLIC_GOOGLE_CLIENT_ID` ni tekshiring

## Keyingi Qadamlar

1. Parolni tiklash funksiyasini amalga oshirish
2. Elektron pochta tekshirusini qo'shish
3. Yangilash token aylanishini amalga oshirish
4. Foydalanuvchi profilini tahrirlashni qo'shish
5. Rol-asosidagi kirish huquqini qo'shish
6. Ikki faktorli autentifikatsiyani amalga oshirish
