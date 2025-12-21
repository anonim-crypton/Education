# O'qituvchi-Fan Tizimi (Teacher-Subject System)

## Rejalashtirilgan Funksiyalar

Bu tizim 10 ta fandan har birida o'qituvchi qo'shish va video yuklay olish imkoniyatini beradi.

### 1. Database Modellar

#### CustomUser Model
- `subject` field qo'shildi (SUBJECT_CHOICES bilan)
- 10 ta fan: Matematika, Fizika, Kimyo, Biologiya, Ingliz-tili, Rus-tili, O'zbek-tili, O'zbekiston-tarixi, Geografiya, Web-Dasturlash
- Migration: `0010_customuser_subject.py` (allaqachon yaratilgan)

#### Course Model
- `teacher_user` - o'qituvchini Course ga bog'lash
- Course biznes logikasi: teacher video yuklay oladi

### 2. Backend API Endpoints

#### Yangi O'qituvchi Yaratish
- **URL**: `/api/users/admin/api/create-teacher/`
- **Method**: POST
- **Permission**: Admin faqat
- **Data**:
```json
{
    "username": "teacher123",
    "password": "secure123",
    "subject": "matematika",
    "first_name": "John",
    "last_name": "Doe",
    "school_name": "School Name"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "O'qituvchi muvaffaqiyatli yaratildi",
    "teacher": {
        "id": 1,
        "username": "teacher123",
        "subject": "matematika",
        "school": "School Name"
    },
    "token": "..."
}
```

#### O'qituvchilarni Fan Bo'yicha Olish
- **URL**: `/api/users/courses/<subject>/teachers/`
- **Method**: GET
- **Permission**: AllowAny
- **Params**: subject (masalan: "Matematika", "Ingliz-tili")
- **Response**:
```json
{
    "success": true,
    "subject": "Matematika",
    "teachers_count": 2,
    "teachers": [
        {
            "id": 1,
            "username": "teacher1",
            "full_name": "John Doe",
            "subject": "matematika",
            "avatar": "...",
            "school": "School Name",
            "courses": [
                {
                    "id": 1,
                    "title": "Algebra",
                    "videos_count": 5,
                    "total_views": 150
                }
            ]
        }
    ]
}
```

### 3. Frontend UI

#### Admin Panel - O'qituvchi Yaratish
- **Yo'li**: `/admin/dashboard/create_teacher/`
- **UI**: `create_teacher.html` yangilandi
- **Features**:
  - 10 ta fandan birini tanlash
  - Username va parol kiriting
  - Ismi-familiyasi ixtiyoriy
  - Form validation
  - localStorage'da draft saqlash

#### Courses Sahifasi - O'qituvchilar Ko'rish
- **Yo'li**: `http://localhost:3000/courses`
- **Updates**: `app/courses/page.tsx` yangilandi
- **Features**:
  - Har bir fan uchun tegishli o'qituvchilar ko'rsatiladi
  - O'qituvchining:
    - Avatar rasmi
    - Ismi-familiyasi
    - Maktabi
    - Video darsliklari soni
    - Barchasidagi videolar
  - Responsive grid (1, 2, yoki 4 ta ustun)

### 4. O'qituvchi Paneli (Teacher Panel)

#### Video Yuklash
- O'qituvchi o'zining darslarini video orqali yuklashi mumkin
- Har bir video lesson bilan bog'lanadi
- Course ma'lumotlari: title, description, videos_count, total_views

### 5. Rejalashtirilgan Qadamlar

1. ✅ CustomUser model'ga `subject` field qo'shish
2. ✅ Migration yaratish
3. ✅ Admin panel'da `subject` field'ni ko'rish
4. ✅ API endpoint: Yangi o'qituvchi yaratish
5. ✅ API endpoint: O'qituvchilarni fan bo'yicha olish
6. ✅ Admin template'ni yangilash
7. ✅ Frontend courses sahifasini yangilash
8. ⏳ Migration'ni apply qilish (python manage.py migrate)
9. ⏳ O'qituvchi video upload funksiyasini tekshirish

### 6. Foydalanish Tartibi

#### 1. Admin Panel'da O'qituvchi Yaratish
```
1. /admin/dashboard/create_teacher/ sahifasiga o'ting
2. Fan tanlang (masalan: Matematika)
3. Username kiriting (masalan: math_teacher_1)
4. Parol kiriting (6+ belgisi bo'lishi kerak)
5. Ismi-familiyasi ixtiyoriy
6. "Saqlash" tugmasini bosing
```

#### 2. Courses Sahifasida Ko'rish
```
1. http://localhost:3000/courses sahifasiga o'ting
2. Har bir fan uchun o'qituvchilar ko'rinadi
3. O'qituvchining:
   - Avatar rasmi (default yoki custom)
   - Ismi-familiyasi
   - Maktabi
   - Qancha kurs va video kurib bo'lganligini ko'rin
4. "Profilni ko'rish" tugmasini bosib o'qituvchi haqida ko'proq ma'lumot olish mumkin
```

#### 3. O'qituvchi Paneli'da Video Yuklash
```
1. O'qituvchi username va parol bilan login qiladi
2. O'z darslarini (lessons) yuklaydi
3. Video file selected video_file qatoriga yuklansa bo'ladi
4. Har bir dars course bilan bog'lanadi
```

### 7. Fan Nomi Mosliklar

| Admin Panelida | Database'da | Frontend'da | 
|---|---|---|
| Matematika | matematika | Matematika |
| Fizika | fizika | Fizika |
| Kimyo | kimyo | Kimyo |
| Biologiya | biologiya | Biologiya |
| Ingliz-tili | ingliz-tili | Ingliz-tili |
| Rus-tili | rus-tili | Rus-tili |
| O'zbek-tili | uzbek-tili | O'zbek-tili |
| O'zbekiston-tarixi | tarix | O'zbekiston-tarixi |
| Geografiya | geografiya | Geografiya |
| Web-Dasturlash | dasturlash | Web-Dasturlash |

### 8. Qo'shimcha Eslatmalar

- Har bir fan faqat **bitta o'qituvchi** uchun tayinlanishi mumkin
- O'qituvchi o'z faniga tegishli video'larni yuklashi mumkin
- Courses sahifasida o'qituvchilar real vaqtda ko'rsatiladi
- O'qituvchi profilida uning barcha kurslari va videolari ko'rsatiladi

### 9. Keyingi Qadamlar (Optional)

1. O'qituvchi profil ko'rish sahifasini yasash
2. O'qituvchi reytingi (rating) sistema
3. Talabalar o'qituvchiga izoh yozishi
4. O'qituvchi blan bevosita muloqot (messaging)
5. O'qituvchi statistikasi (views, students, etc.)
