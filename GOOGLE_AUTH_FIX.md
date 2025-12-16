# Google OAuth Login Fix

## O'zgarishlar

### 1. Login Komponenti (components/ui/login-signup.tsx)
- ✅ Google OAuth integratsiyasi qo'shildi
- ✅ `useGoogleLogin` hook va `@react-oauth/google` import qo'shildi
- ✅ `handleGoogleLogin` funksiyasi yaratildi
- ✅ Google tugmasi (button) amaldagi qilib o'zgartirildi
- ✅ API endpoint: `/api/users/google/` sahihlab berildi
- ✅ Token saqlab olish (localStorage) sozlandi

### 2. Register Komponenti (components/ui/register.tsx)
- ✅ Google OAuth integratsiyasi qo'shildi
- ✅ `useGoogleLogin` hook va router import qo'shildi
- ✅ `handleRegister` funksiyasi yaratildi
- ✅ `handleGoogleLogin` funksiyasi yaratildi
- ✅ Form fields (fullName, email, password) state management qo'shildi
- ✅ Error handling o'zgartirildi
- ✅ Google tugmasi (button) amaldagi qilib o'zgartirildi

### 3. Django Settings (edu_game/edu_game/settings.py)
- ✅ Google OAuth credentials environment variables orqali o'qitilyapti
- ✅ Hardcoded values o'riniga `os.getenv()` ishlatildi

## Konfiguratsiya

### Frontend (.env.local)
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=301631056596-t52vlard6tjapc4oakf7cnev6ssugp1r.apps.googleusercontent.com
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend Environment (Django)
Google OAuth credentials quyidagi environment variables orqali beriladi:
- `GOOGLE_OAUTH_CLIENT_ID` (optional - default qiymatiga ega)
- `GOOGLE_OAUTH_CLIENT_SECRET`

## Ishlash Tartibi

1. User "Google" tugmasini bosadi
2. Google OAuth dialog ochiladi
3. User Google akkauntida login qiladi
4. Frontend Google access token oladi
5. Backend `/api/users/google/` endpoint-ga token yuborilib
6. Backend Google API orqali token-ni tekshiradi
7. Agar user yangi bo'lsa - avtomatik user yaratiladi
8. Token saqlanib dashboard-ga o'tiladi

## Frontend API Calls

### Login
```javascript
POST /api/users/login/
Body: { username: email, password: password }
```

### Register
```javascript
POST /api/users/register/
Body: { 
  first_name, 
  last_name, 
  email, 
  username, 
  password,
  school_name 
}
```

### Google Login
```javascript
POST /api/users/google/
Body: { token: googleAccessToken }
```

## Tests

Google login tugmasi ishlaydi:
- ✅ Login sahifada
- ✅ Register sahifada
- ✅ Xatolarni chiqaradi ✓
- ✅ Success case-ni boshqaradi ✓

