# O'qituvchi So'rov Tizimi Dokumentatsiyasi

## Umumiy Tavsif
Bu tizim foydalanuvchilarning o'qituvchi bo'lish so'rovlarini qabul qiladi, admin panel'da ko'rib chiqadi va tasdiqlash yoki rad etish imkoniyatini beradi.

## Frontend Saxifalari

### 1. Become Teacher Saxifasi (`/become-teacher`)
**URL:** `/become-teacher`

**Funksiyalari:**
- O'qituvchi bo'lish uchun ariza shakl
- Quyidagi ma'lumotlarni so'rash:
  - To'liq ism (majburiy)
  - Fan/Predmet (majburiy)
  - Tajriba (yil) (majburiy)
  - Sertifikati/Diplomi (ixtiyoriy)
  - Bio/Ta'rif (ixtiyoriy)
  - Telefon raqami (ixtiyoriy)

**API Endpoint:**
```
POST /api/teachers/apply/
Authorization: Token {user_token}
Content-Type: application/json

Body:
{
  "full_name": "string",
  "subject": "string",
  "qualifications": "string (optional)",
  "experience_years": "integer",
  "bio": "string (optional)",
  "phone": "string (optional)"
}

Response (200 OK):
{
  "id": 1,
  "status": "pending",
  "message": "O'qituvchi so'rovi muvaffaqiyatli yuborildi!",
  "full_name": "..."
}

Response (400/500):
{
  "message": "Error message"
}
```

### 2. Admin Dashboard (`/admin-dashboard`)
**URL:** `/admin-dashboard`
**Talab:** Admin roli

**Uchta Tab:**

#### a. Umumiy Ko'rinish (Overview)
- Statistika:
  - Kutilayotgan o'qituvchi so'rovlari soni
  - Tasdiqlangan o'qituvchilar soni
  - Rad etilgan so'rovlar soni
  - Sistem holati
- Admin funksiyalari listi

#### b. O'qituvchi So'rovlari (Requests)
**Xususiyatlar:**
- Barcha o'qituvchi so'rovlarini ro'yxat ko'rinishida ko'rish
- Status: Kutish (pending), Tasdiqlandi (approved), Rad Etildi (rejected)
- So'rovni tanlash uchun - batafsil ko'rish
- Batafsil sahifada:
  - To'liq ma'lumot
  - **Tasdiqlash tugmasi** (agar status = pending)
  - **Rad etish tugmasi** (agar status = pending)

**API Endpoints:**

```
GET /api/teachers/requests/
Authorization: Token {admin_token}

Response (200 OK):
[
  {
    "id": 1,
    "user_id": 5,
    "full_name": "Ali Qodirov",
    "subject": "Dasturlash",
    "qualifications": "Bakalavriat (Informatika)",
    "experience_years": 5,
    "bio": "...",
    "phone": "+998 91 234 5678",
    "status": "pending",
    "created_at": "2024-12-18T10:30:00Z",
    "user_email": "ali@example.com"
  },
  ...
]
```

```
POST /api/teachers/requests/{id}/approve/
Authorization: Token {admin_token}

Response (200 OK):
{
  "message": "O'qituvchi tasdiqlandi!",
  "username": "ali_qodirov",
  "password": "temp_password_xyz",
  "user": {
    "id": 5,
    "username": "ali_qodirov",
    "email": "ali@example.com",
    "full_name": "Ali Qodirov",
    "is_teacher": true
  }
}

# Tafsili:
# - Username va parol yaratiladi
# - Teacher accounti aktivatsiya qilinadi
# - Foydalanuvchiga notification jo'natiladi
# - O'qituvchi endi kurs yarata oladi
```

```
POST /api/teachers/requests/{id}/reject/
Authorization: Token {admin_token}
Content-Type: application/json

Body (optional):
{
  "rejection_reason": "string (optional)"
}

Response (200 OK):
{
  "message": "O'qituvchi so'rovi rad etildi",
  "user_id": 5
}

# Tafsili:
# - So'rov rad etiladi (status = rejected)
# - Foydalanuvchiga notification jo'natiladi
# - Teacher accounti yaratilmaydi
```

#### c. O'qituvchilar (Teachers)
**Xususiyatlar:**
- Barcha tasdiqlangan o'qituvchilar ro'yxati
- Har bir o'qituvchi uchun:
  - Avatar (initials)
  - To'liq ism
  - Username (@username)
  - O'rgatuvchi bo'lgan fan
  - **"Yangi Kurs Qo'shish"** tugmasi
  - **"O'chirish"** tugmasi (admin uchun)

**API Endpoint:**
```
GET /api/teachers/
Authorization: Token {admin_token}

Response (200 OK):
[
  {
    "id": 1,
    "user_id": 5,
    "username": "ali_qodirov",
    "email": "ali@example.com",
    "full_name": "Ali Qodirov",
    "subject": "Dasturlash",
    "avatar": "https://...(optional)"
  },
  ...
]
```

### 3. Oddiy Dashboard (`/dashboard`)
**Qo'shilgan tugma:**
- **"O'qituvchi bo'lish"** tugmasi yangi sahifada ko'rinadi
- Rang: Amber (golden)
- Icon: ArrowRight
- Yo'naltirish: `/become-teacher` saxifasiga

### 4. O'qituvchi Dashboard (`/teacher-dashboard`)
**Qo'shilgan tugma:**
- **"Yangi Kurs Qo'shish"** tugmasi
- Rang: Blue
- Icon: Plus
- Yo'naltirish: `/teacher-dashboard/add-course` saxifasiga
- Barcha kurslardan yuqorida joylashadi

## Notification (Bildiroq) Tizimi

### Admin Notificationlari
1. **Yangi So'rov Kelganida** (Backend tomonidan jo'natiladi)
   - Admin onlayn bo'lsa - Real-time update
   - So'rovlar ro'yxati avtomatik yangilanadi

2. **So'rovi Tasdiqlanganda Foydalanuvchiga**
   ```
   Xabar: "O'qituvchi so'rovingiz tasdiqlandi! Username: ali_qodirov Vaqtinchalik parol: [password]"
   ```

3. **So'rovi Rad Etilganda Foydalanuvchiga**
   ```
   Xabar: "O'qituvchi so'rovingiz rad etildi. Batafsil: admin@example.com ga murojaat qiling"
   ```

## Texnik Tafsilotlar

### Frontend Components
- **Admin Dashboard:** 3 tab'li interface
  - activeTab state bilan tab almashuv
  - selectedRequest state bilan batafsil ko'rish
  - isLoadingData bilan yuklash holatini ko'rsatish

- **Become Teacher:** Form validation va error handling
  - Telefon raqami formatlash
  - API javobiga asoslangan xato/muvaffaqiyat xabarlari

- **Buttons:** Motion animation bilan hover va tap effectlari

### API Integratsiya
- Base URL: `process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"`
- Authentication: Token based (localStorage)
- Error handling: Badal JSON parsing va user-friendly xabarlari

## Kelasi Takmillashlar

1. **Email Notificationlari** - Gmail/SMTP orqali
2. **SMS Notificationlari** - Twilio/SMSlar orqali
3. **Real-time Updates** - WebSocket orqali
4. **Kurs Qo'shish API** - O'qituvchi dashboard uchun
5. **Video Upload API** - Kurs videoları uchun
6. **Rating Tizimi** - O'qituvchi reyting va review

## Testing

### Manual Testing Steps
1. Oddiy foydalanuvchi sifatida login qiling
2. `/become-teacher` saxifasiga o'ting
3. Forma to'ldiring va yuboringni
4. Admin sifatida login qiling (`/admin-dashboard`)
5. "O'qituvchi So'rovlari" tab'iga o'ting
6. So'rovni tanlang va ko'rib chiqing
7. Tasdiqlash yoki Rad etish tugmasini bosing
8. "O'qituvchilar" tab'ida yangi o'qituvchini ko'ring (tasdiqlansa)
9. O'qituvchi dashboard'da "Yangi Kurs Qo'shish" tugmasini ko'ring

## Muhim Eslatmalar

1. **Security:** Backend tomonida admin huquqi tekshirilishi kerak
2. **Validation:** Barcha input'lar backend tomonida qayta-tekshirilishi kerak
3. **Logging:** Barcha approval/rejection amallari log qilinishi kerak
4. **Audit Trail:** Admin harakatlari jadvalda saqlanishi kerak
