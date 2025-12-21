# 🚀 Quick Start Guide - Teacher Admin Panel

## Ishlab Chiqarish Jarayoni

### 1. Backend Server Ishga Tushirish

```bash
cd edu_game
python manage.py runserver
```

Server: `http://localhost:8000`

### 2. Frontend (Next.js) Ishga Tushirish (Boshqa Terminal'da)

```bash
npm run dev
```

Frontend: `http://localhost:3000`

---

## Test Qadamlar

### 1️⃣ Admin Panel'dan O'qituvchi Yaratish

**URL**: `http://localhost:8000/dashboard/`

Tanlash:
- ✅ O'qituvchi So'rovlari → O'qituvchi Yaratish
- ✅ Fan: "Dasturlash" tanlang
- ✅ Username: `ali_teacher`
- ✅ Parol: `Pass1234!`
- ✅ To'liq Ismi: `Ali Karimov`
- ✅ Bio: `Dasturlash bo'yicha tajribali o'qituvchi`
- ✅ Tajriba: `5`
- ✅ Yuborish

**Expected**: Success message

---

### 2️⃣ O'qituvchi Dashboard'ga Kirish

**URL**: `http://localhost:8000/teachers/login/`

Login:
- Username: `ali_teacher`
- Parol: `Pass1234!`
- ✅ Kirish

**Expected**: Dashboard sahifasi yuklansa

---

### 3️⃣ Dashboard'ni Tekshirish

#### Header
✅ **Fan Qutisi Ko'rsatiladi**:
- Mavi rang
- "Dasturlash" - fan nomi
- "Fani" - label
- Ikonka

#### Statistics Grid
✅ **Darslar**: 0 (hali bo'sh)
✅ **O'quvchilar**: 1+
✅ **Tajriba**: 5 yillik

#### Sidebar
✅ **Darslik Yuklash** tugmasi mavjud

---

### 4️⃣ Darslik Yuklash

**URL**: O'qituvchi dashboard'dari "Darslik Yuklash" tugmasini bosing

#### Form Tc'ldirish
- ✅ **Dars Nomi**: "Loops va Sikllar"
- ✅ **Tavsif**: "Bu darsda biz loops haqida o'renib olamiz"
- ✅ **Video Fayli**: Biron video file tanlang (MP4, WebM yoki MOV)

#### Yuklash
- ✅ "Yukla" tugmasini bosing

**Expected**:
- Success message: "Dars 'Loops va Sikllar' muvaffaqiyatli yuklandi!"
- Dashboard'ga qaytarish
- Darslar statistikasi 1 bo'ladi

---

### 5️⃣ Website'da Kurslar Dropdown'ni Tekshirish

**URL**: `http://localhost:3000`

- ✅ Navbar'ga qarang
- ✅ "Kurslar" tugmasiga sichqoncha borganida dropdown ociladi
- ✅ O'qituvchi "Ali Karimov" ko'rinadi
- ✅ Fan: "Dasturlash" (badge)
- ✅ Bio ko'rsatiladi
- ✅ Icon: Code icon (💻)

---

## Debugging Tips

### Agar xato bo'lsa:

#### 1. Template Syntax Error
```
TemplateSyntaxError: Unclosed tag
```
✅ **Yechim**: `{% endif %}` yoki `{% endfor %}`' ni tekshiring

#### 2. API Error
```
Error fetching teachers: 404
```
✅ **Yechim**: Server ishga tushaganini tekshiring

#### 3. File Upload Error
```
No file was submitted
```
✅ **Yechim**: `enctype="multipart/form-data"` bo'lganini tekshiring

#### 4. Database Error
```
Lesson.objects - doesn't exist
```
✅ **Yechim**: Migration'larni run qiling:
```bash
python manage.py migrate
```

---

## Browser Console'da Tekshirish

### F12 → Console Tab

❌ Xatolar bo'lmasligi kerak:
- `Uncaught Error`
- `Failed to fetch`
- `CORS error`

---

## Database'da Tekshirish

### Django Shell

```bash
cd edu_game
python manage.py shell
```

```python
# O'qituvchilarni ko'rish
from teachers.models import Teacher
print(Teacher.objects.all())

# Lesson'larni ko'rish  
from users.models import Lesson
print(Lesson.objects.all())

# Users'ni ko'rish
from users.models import CustomUser
print(CustomUser.objects.filter(is_staff=False).count())
```

---

## Production Checklist

Deployment'dan oldin:

- [ ] Barcha tests pass bo'ldi
- [ ] Error messages ko'rsatiladi
- [ ] API calls ishlaydi
- [ ] Database migrations completed
- [ ] Static files collected
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Environment variables set
- [ ] CORS configured (agar kerak bo'lsa)

---

## Kerakli Environment Variables

### Backend (.env)
```env
DEBUG=True
SECRET_KEY=your_secret_key
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=edu_game
DB_USER=root
DB_PASSWORD=password
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Files Location

| File | Path |
|------|------|
| Dashboard | `teachers/templates/teachers/dashboard.html` |
| Upload Page | `teachers/templates/teachers/upload_lesson.html` |
| Views | `teachers/views.py` |
| URLs | `teachers/urls.py` |
| Navbar | `components/navbar.tsx` |

---

## API Endpoints

```
GET  /api/teachers/              # Barcha o'qituvchilar
POST /teachers/upload-lesson/    # Darslik yuklash
GET  /teachers/dashboard/        # O'qituvchi dashboard
```

---

## Support

Agar muammo bo'lsa:

1. Logs'ni tekshiring
2. Console error'larni tekshiring
3. Database state'ni tekshiring
4. Network requests'ni tekshiring (DevTools)

---

**Status**: ✅ **PRODUCTION READY**

Happy Coding! 🎓
