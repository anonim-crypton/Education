# O'qituvchi-Fan Tizimi - Tez Boshlash Qo'llanmasi

## 1️⃣ Database'ni Yangilash

```bash
python manage.py migrate
```

## 2️⃣ Admin Panel'dan O'qituvchi Yaratish

1. **Admin Panel'ga Kirish**:
   - URL: `http://localhost:8000/api/users/admin/dashboard/`
   - Username va parol bilan login qilin

2. **O'qituvchi Yaratish Sahifasiga O'ting**:
   - URL: `http://localhost:8000/api/users/admin/dashboard/create_teacher/`

3. **Forma'ni To'ldiring**:
   - **Fan**: Matematika, Fizika, Kimyo, Biologiya, Ingliz-tili, Rus-tili, O'zbek-tili, O'zbekiston-tarixi, Geografiya yoki Web-Dasturlash
   - **Username**: masalan `math_teacher_1` (3+ belgisi)
   - **Parol**: masalan `password123` (6+ belgisi)
   - **Ismi**: Ixtiyoriy (masalan: Ali Aliyev)
   - **"Saqlash"** tugmasini bosing

4. **O'qituvchining Credentials'ini Saqlang**:
   - O'qituvchiga username va parol bering
   - U o'z panelida login qiladi

## 3️⃣ Courses Sahifasida Ko'rish

1. **Courses Sahifasiga O'ting**:
   - URL: `http://localhost:3000/courses`

2. **O'qituvchilar Ko'rsatiladi**:
   - Har bir fan uchun yaratilgan o'qituvchilar ko'rsatiladi
   - O'qituvchining avatar rasmi, ismi, maktabi ko'rsatiladi
   - Kurslar soni va videolar ko'rsatiladi

3. **O'qituvchi Profilini Ko'rish**:
   - "Profilni ko'rish" tugmasini bosing
   - (Keyingi versiyada)

## 4️⃣ O'qituvchi Paneli'da Dars Yaratish

1. **O'qituvchi Login Qiladi**:
   - URL: `http://localhost:8000/api/users/teacher/api/login/`
   - Username: yaratilgan username
   - Password: yaratilgan password

2. **Dars Yaratish Sahifasiga O'ting**:
   - Dashboard'dan "Upload Lesson" tugmasini bosing
   - URL: `http://localhost:8000/api/users/teacher/upload-lesson/`

3. **Video Faylini Tanlang**:
   - **Course**: O'z faniga tegishli course'ni tanlang
   - **Title**: Dars nomi (masalan: "Algebraning Asoslari")
   - **Description**: Qisqacha tavsif
   - **Video File**: MP4, WebM, yoki boshqa video format
   - **"Upload"** tugmasini bosing

4. **Natija**:
   - Video Courses sahifasida ko'rsatiladi
   - O'qituvchi profilida "5 ta video" ko'rsatiladi

## 5️⃣ API'ni To'g'ridan-to'g'ri Sinash

### Admin Token Olish
```bash
curl -X POST http://localhost:8000/api/users/admin/api/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_username",
    "password": "admin_password"
  }'
```

### Yangi O'qituvchi Yaratish
```bash
curl -X POST http://localhost:8000/api/users/admin/api/create-teacher/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token YOUR_ADMIN_TOKEN" \
  -d '{
    "username": "physics_teacher",
    "password": "secure_pass123",
    "subject": "fizika",
    "first_name": "John",
    "last_name": "Doe",
    "school_name": "School Name"
  }'
```

### O'qituvchilarni Olish
```bash
curl http://localhost:8000/api/users/courses/Fizika/teachers/
```

## 6️⃣ Ma'lumotlar

### Supported Fanlar
- `matematika` - Matematika
- `fizika` - Fizika
- `kimyo` - Kimyo
- `biologiya` - Biologiya
- `ingliz-tili` - Ingliz-tili
- `rus-tili` - Rus-tili
- `uzbek-tili` - O'zbek-tili
- `tarix` - O'zbekiston-tarixi
- `geografiya` - Geografiya
- `dasturlash` - Web-Dasturlash

## 7️⃣ Troubleshooting

### "Fan noto'g'ri" Xatosi
- Fani tanlashda lowercase yoki to'g'ri nomi yozing
- Admin panel'da dropdown'dan tanlanadi (avtomatik to'g'ri)

### "Faqat admin o'qituvchi yarata oladi" Xatosi
- Admin token bilan kirganligingizni tekshiring
- `Authorization: Token ...` header'ni qo'shing

### O'qituvchilar ko'rsatilmaydi
- Database'ni migrate qilinganini tekshiring: `python manage.py migrate`
- O'qituvchi is_active=True bo'lishini tekshiring
- Courses sahifasini refresh qiling

### Video ko'rsatilmaydi
- Video file size'ini tekshiring (3GB dan kichik)
- Video format'ini tekshiring (MP4, WebM, etc.)
- Media folder'iga kirish huquqi bo'lganini tekshiring

## 8️⃣ Example Test Scenario

```
1. Admin Panel'da "Matematik" faniga teacher1 qo'shish:
   - Username: teacher_math_1
   - Password: test_password_123
   - Subject: matematika

2. Frontend Courses sahifasida:
   - "Matematika" kursida teacher_math_1 ko'rinadi
   - Avatar (default)
   - Ismi-familiyasi: "Teacher User"
   - Maktabi: "School"

3. O'qituvchi Panel'da:
   - O'z profiliga kirish
   - "Algebra Asoslari" dars yaratish
   - Video file yuklash
   - Dars saqlanadi

4. Courses Sahifasida:
   - "Matematika" qismida teacher_math_1 ni ko'rish
   - "📚 1 ta kurs, 1 ta video" ko'rinadi

5. Complete ✅
```

## 9️⃣ Foyda: Frontend Package Restart

Agar o'zgarishlar ko'rinmasa:
```bash
npm run dev
```

Backend uchun:
```bash
python manage.py runserver
```
