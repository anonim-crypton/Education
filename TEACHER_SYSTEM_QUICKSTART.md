# O'QITUVCHI SO'ROV TIZIMI - QUICK START GUIDE

**O'qituvchi bo'lish tizimi** - Foydalanuvchilar o'qituvchi bo'lish uchun ariza berish, adminlar ko'rib chiqish va tasdiqlash tizimi.

---

## ⚡ 5 MINUTLIK SETUP

### 1️⃣ Frontend Setup (TAYYOQ)
```bash
# Fayllar allaqachon yangilangan
✅ /app/admin-dashboard/page.tsx      # Admin panel
✅ /app/dashboard/page.tsx             # User dashboard
✅ /app/become-teacher/page.tsx        # Form
✅ /app/teacher-dashboard/page.tsx     # Teacher panel

# Dokumentatsiya
✅ TEACHER_REQUEST_SYSTEM.md           # Tizim docs
✅ TEACHER_REQUEST_FRONTEND_COMPLETE.md # Feature list
✅ IMPLEMENTATION_LOG.md               # Implementation
✅ FRONTEND_CHANGES_SUMMARY.md         # Changes
```

### 2️⃣ Backend Setup (KERAK)
Backend tomonida quyidagi API'larni yaratish kerak:

```
POST   /api/teachers/apply/
GET    /api/teachers/requests/
POST   /api/teachers/requests/{id}/approve/
POST   /api/teachers/requests/{id}/reject/
GET    /api/teachers/
```

#### Django Model Example:
```python
class TeacherRequest(models.Model):
    user = ForeignKey(User, on_delete=models.CASCADE)
    full_name = CharField(max_length=255)
    subject = CharField(max_length=255)
    qualifications = TextField(blank=True)
    experience_years = IntegerField()
    bio = TextField(blank=True)
    phone = CharField(max_length=20, blank=True)
    status = CharField(
        max_length=20,
        choices=[('pending', 'Kutish'), ('approved', 'Tasdiqlandi'), ('rejected', 'Rad Etildi')],
        default='pending'
    )
    created_at = DateTimeField(auto_now_add=True)
    approved_at = DateTimeField(null=True, blank=True)
    approved_by = ForeignKey(User, null=True, blank=True, related_name='approved_teachers', on_delete=models.SET_NULL)
```

---

## 🎯 ISHLASH TARTIBI

### USER QARANG (Foydalanuvchi)

**1. Dashboard'da "O'qituvchi bo'lish" tugmasini bosing**
```
URL: /dashboard
Tugma: "O'qituvchi bo'lish" (Amber rang)
```

**2. Form to'ldiring**
```
- To'liq Ism *
- Fan/Predmet *
- Tajriba (yil) *
- Sertifikati/Diplomi
- Bio/Ta'rif
- Telefon raqami (+998 XX-XXX-XX-XX)
```

**3. "Yuborish" tugmasini bosing**
```
API: POST /api/teachers/apply/
Request Body: { full_name, subject, ... }
```

**4. Muvaffaqiyat xabari**
```
"O'qituvchi so'rovingiz muvaffaqiyatli yuborildi!
Admin ko'rib chiqib, tasdiqlansa sizga notification jo'natiladi."
```

**5. Admin tasdiqlashini kutish**
```
Status: Pending (Kutish)
Email/SMS: Tasdiqlansa - Notification jo'natiladi
```

---

### ADMIN QARANG (Admin)

**1. Admin Panelga kirish**
```
URL: /admin-dashboard
Token: admin_token (localStorage'da)
```

**2. "O'qituvchi So'rovlari" Tab'ni bosing**
```
Barcha so'rovlar ko'rinadi:
- Kutish (Yellow badge)
- Tasdiqlandi (Green badge)
- Rad Etildi (Red badge)
```

**3. So'rovni tanlang (click)**
```
List view'dan so'rovni tanlang
Detail view ochiladi
```

**4. Batafsil ma'lumot ko'ring**
```
- To'liq ism
- Fan
- Tajriba
- Sertifikat
- Bio
- Telefon
```

**5. Tasdiqlash yoki Rad Etish**
```
IF TASDIQLASH:
  - Username yaratiladi (masalan: ali_qodirov)
  - Vaqtinchalik parol yaratiladi
  - Teacher account'i aktivatsiya qilinadi
  - User'ga notification jo'natiladi
  - Muvaffaqiyat: "O'qituvchi tasdiqlandi!"

IF RAD ETISH:
  - Status "rejected" ga o'zgaradi
  - Teacher account'i yaratilmaydi
  - User'ga rejection notification jo'natiladi
  - Muvaffaqiyat: "O'qituvchi so'rovi rad etildi"
```

**6. "O'qituvchilar" Tab'da ko'ring**
```
Tasdiqlangan o'qituvchilar:
- Avatar (initials)
- Username
- Fan
- [Kurs Qo'shish] tugmasi
- [O'chirish] tugmasi
```

---

## 📱 USER INTERFACES

### Regular User Dashboard
```
┌────────────────────────────────┐
│ BUTTONS (Sag):                 │
│ 📚 Kurslar katalogi            │
│ 👨‍🎓 O'qituvchilar ro'yxati      │
│ ➜ O'qituvchi bo'lish (NEW!)    │
└────────────────────────────────┘
```

### Admin Dashboard - Overview Tab
```
┌────────────────────────────────────────┐
│ Kutilayotgan    Tasdiqlangan  RadEt   │
│ So'rovlar       O'qituvchilar  So'rovlar
│     3                5           2
└────────────────────────────────────────┘
│ Admin Funksiyalari (6 feature)         │
└────────────────────────────────────────┘
```

### Admin Dashboard - Requests Tab
```
┌─────────────────────────────────────┐
│ [Ali Qodirov] [KUTISH]         👁️   │
│ - Dasturlash • 5 yil                │
├─────────────────────────────────────┤
│ [Fatima] [TASDIQLANDI]         👁️   │
│ - Ingliz tili • 3 yil               │
├─────────────────────────────────────┤
│ [Oleg] [RAD ETILDI]            👁️   │
│ - Matematika • 10 yil               │
└─────────────────────────────────────┘

Click qilsa:
┌──────────────────────────────────┐
│ Ali Qodirov                      │
├──────────────────────────────────┤
│ Fan: Dasturlash │ Tajriba: 5    │
├──────────────────────────────────┤
│ [✓ Tasdiqlash] [✗ Rad Etish]    │
└──────────────────────────────────┘
```

### Admin Dashboard - Teachers Tab
```
┌─────────────────────────────────┐
│  [AQ] Ali Qodirov               │
│       @ali_qodirov              │
│       Dasturlash                │
│  [+ Kurs] [Delete]              │
├─────────────────────────────────┤
│  [FS] Fatima Shodmonova         │
│       @fatima_shodmonova        │
│       Ingliz tili               │
│  [+ Kurs] [Delete]              │
└─────────────────────────────────┘
```

---

## 🔗 API ENDPOINTS

### 1. So'rov Yuborish
```
POST /api/teachers/apply/
Authorization: Token {user_token}

Request:
{
  "full_name": "Ali Qodirov",
  "subject": "Dasturlash",
  "qualifications": "Bakalavriat (Informatika)",
  "experience_years": 5,
  "bio": "O'qituvchilik tajribam 5 yil",
  "phone": "+998 91 234 5678"
}

Response (200 OK):
{
  "id": 1,
  "status": "pending",
  "message": "So'rov muvaffaqiyatli yuborildi!",
  "full_name": "Ali Qodirov"
}

Response (400/500):
{
  "message": "Error message"
}
```

### 2. So'rovlar Ro'yxati
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
    "qualifications": "Bakalavriat",
    "experience_years": 5,
    "bio": "...",
    "phone": "+998...",
    "status": "pending",
    "created_at": "2024-12-18T10:30:00Z",
    "user_email": "ali@example.com"
  }
]
```

### 3. So'rovni Tasdiqlash
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
```

### 4. So'rovni Rad Etish
```
POST /api/teachers/requests/{id}/reject/
Authorization: Token {admin_token}

Response (200 OK):
{
  "message": "O'qituvchi so'rovi rad etildi",
  "user_id": 5
}
```

### 5. O'qituvchilar Ro'yxati
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
    "avatar": "https://..."
  }
]
```

---

## 🧪 TESTING

### Manual Testing Steps

**Test 1: So'rov Yuborish**
```
1. User sifatida login
2. /dashboard'ga o'tish
3. "O'qituvchi bo'lish" tugmasini bosish
4. /become-teacher sahifasiga o'tish ✓
5. Form to'ldirish
6. "Yuborish" tugmasini bosish
7. Success message ko'rish ✓
8. 2.5 sekunddan so'ng /dashboard'ga qaytish ✓
```

**Test 2: Admin Batafsil Ko'rish**
```
1. Admin sifatida login
2. /admin-dashboard'ga o'tish
3. "O'qituvchi So'rovlari" tab'ni bosish
4. So'rovlar ro'yxati ko'rish ✓
5. So'rovni tanlash (click)
6. Detail view ochilish ✓
7. Batafsil ma'lumot ko'rish ✓
```

**Test 3: Tasdiqlash**
```
1. Detail view'da "Tasdiqlash" tugmasini bosish
2. API call bajarilish
3. Success message ko'rish ✓
4. So'rovlar ro'yxatiga qaytish
5. Status "Tasdiqlandi" ga o'zgarishi ✓
6. "O'qituvchilar" tab'da yangi o'qituvchi ko'rish ✓
```

**Test 4: Rad Etish**
```
1. Detail view'da "Rad Etish" tugmasini bosish
2. API call bajarilish
3. Success message ko'rish ✓
4. So'rovlar ro'yxatiga qaytish
5. Status "Rad Etildi" ga o'zgarishi ✓
6. "O'qituvchilar" tab'da qo'shilmasligi ✓
```

---

## ⚠️ COMMON ISSUES & SOLUTIONS

### Issue: "API not found" Error
```
Problem: Backend endpoint'i yo'q
Solution: Backend'da endpoint'ni yaratish
```

### Issue: "Unauthorized" (401)
```
Problem: Token yo'q yoki xato
Solution: localStorage'da token borligini tekshirish
         Login qaytadan qilish
```

### Issue: "So'rovlar ko'rinmaydi"
```
Problem: API'dan javob kelmaydi
Solution: 1. Network tab'ni tekshirish (DevTools)
          2. API endpoint'ni tekshirish
          3. Backend logs'ni ko'rish
          4. Database'da data borligini tekshirish
```

### Issue: "Button notiqlashmiyor"
```
Problem: onClick handler'i ishlamayor
Solution: 1. Console error'larni tekshirish
          2. API call'ni tekshirish
          3. State update'ni verify qilish
```

---

## 📚 DOKUMENTATSIYA

| Fayl | Tavsif |
|------|--------|
| `TEACHER_REQUEST_SYSTEM.md` | Tizimning to'liq dokumentatsiyasi |
| `TEACHER_REQUEST_FRONTEND_COMPLETE.md` | Frontend feature'lar |
| `IMPLEMENTATION_LOG.md` | Implementatsiya jurnali |
| `FRONTEND_CHANGES_SUMMARY.md` | O'zgarishlar xulosa |
| `TEACHER_SYSTEM_QUICKSTART.md` | Bu fayl (Quick start) |

---

## 🚀 DEPLOYMENT

### Staging
```bash
# Build
npm run build

# Test
npm test

# Deploy to staging
# Test all features
```

### Production
```bash
# After staging approval
npm run build
npm run start

# Monitor for errors
# Check logs
```

---

## 📞 SUPPORT

### If Something Doesn't Work:

**1. Frontend Error:**
- Browser console'ni tekshirish (F12)
- Network tab'da API calls'ni ko'rish
- State va props'ni debug qilish

**2. API Error:**
- Backend logs'ni ko'rish
- Database query'larni tekshirish
- Request/Response'ni verify qilish

**3. General Issues:**
- Documentation'ni o'qish
- Code comments'ni o'qish
- Tests'ni janarish

---

## ✅ CHECKLIST

### Frontend
- [x] Admin Dashboard
- [x] Dashboard buttons
- [x] Become-teacher form
- [x] Teacher dashboard buttons
- [x] API integration prepared
- [x] Error handling
- [x] Styling & animations
- [x] Documentation

### Backend (TODO)
- [ ] TeacherRequest model
- [ ] Serializer
- [ ] ViewSet/Views
- [ ] Approve/Reject logic
- [ ] User creation
- [ ] Email notifications
- [ ] Tests
- [ ] Deployment

---

## 🎓 KEY CONCEPTS

### User Flow
```
User submits application
  ↓
Admin reviews in dashboard
  ↓
Admin approves/rejects
  ↓
Teacher account created (if approved)
  ↓
User gets notification
  ↓
Teacher can create courses
```

### Admin Flow
```
Login → Dashboard → View Requests → Details → Approve/Reject
            ↓
         Automatically update Teachers list
            ↓
         Send notification to user
```

### Technical Flow
```
Frontend Form → API Call → Backend Processing
  ↓                           ↓
Input Validation      Database Insertion
  ↓                           ↓
Error Handling        Auth/Permission Check
  ↓                           ↓
User Notification     Notification Service
```

---

## 📝 NOTES

1. **Passwords:** Backend'da vaqtinchalik parol generatsiya qilish kerak
2. **Emails:** Email service'ni setup qilish kerak
3. **SMS:** SMS service' optional (Twilio, SMS.uz, etc)
4. **Logging:** Admin harakatlari log qilish kerak
5. **Security:** Barcha input'lar backend'da validate qilish kerak

---

## 🎯 NEXT TASKS

1. **Backend:** API endpoints yaratish (1-2 hafta)
2. **Testing:** Integration testing (1 hafta)
3. **Notifications:** Email/SMS setup (3-5 kun)
4. **Deployment:** Staging va production (2-3 kun)

---

**Holati:** ✅ Frontend Complete, Ready for Backend  
**Keyingi:** Backend API implementation  
**Estimated Time:** 2-3 hafta  

---

*Happy Coding! 🚀*
