# O'qituvchi Admin Panel API Guide (Uzbek)

## O'qituvchi Admin Paneli Uchun API Endpoints

### 1. Dashboard - Kurs Soni Ko'rish
**Endpoint**: `GET /api/dashboard/`

**Tavsif**: O'qituvchining barcha kurslarini va statistikasini ko'rish

**Headers**:
```
Authorization: Token {teacher_token}
```

**Javob Misoli**:
```json
{
  "success": true,
  "user": {
    "id": 5,
    "username": "teacher1",
    "first_name": "Karim",
    "email": "teacher@example.com"
  },
  "courses_count": 3,
  "courses": [
    {
      "id": 1,
      "title": "Python Asoslari",
      "description": "Python tilini o'rganish",
      "lessons": 10,
      "icon": "code",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "title": "English Course",
      "description": "Ingliz tilini o'rganish",
      "lessons": 8,
      "icon": "languages",
      "created_at": "2024-01-16T14:20:00Z"
    }
  ]
}
```

---

### 2. Darslar (Videolar) - Barcha Yuklangan Videolar
**Endpoint**: `GET /api/lessons/`

**Tavsif**: O'qituvchining barcha yuklangan videolarini (darslarini) ko'rish

**Headers**:
```
Authorization: Token {teacher_token}
```

**Javob Misoli**:
```json
{
  "success": true,
  "count": 2,
  "lessons": [
    {
      "id": 1,
      "title": "Python - O'zgaruvchilar",
      "description": "Bu darsda biz o'zgaruvchilar haqida o'rganamiz. String, int, float turlarini ko'rib chiqamiz",
      "video_url": "http://localhost:8000/media/videos/lesson1.mp4",
      "video_file": "http://localhost:8000/media/videos/lesson1.mp4",
      "course_id": 1,
      "course_title": "Python Asoslari",
      "course_name": "Python Asoslari",
      "uploaded_date": "2024-01-15T14:30:00Z",
      "created_at": "2024-01-15T14:30:00Z",
      "duration": 1200,
      "views_count": 45,
      "rating": 4.5,
      "teacher_name": "Karim Abdullayev",
      "order": 1
    },
    {
      "id": 2,
      "title": "Python - Sikllar",
      "description": "for va while sikllaridan foydalanish",
      "video_url": "http://localhost:8000/media/videos/lesson2.mp4",
      "video_file": "http://localhost:8000/media/videos/lesson2.mp4",
      "course_id": 1,
      "course_title": "Python Asoslari",
      "course_name": "Python Asoslari",
      "uploaded_date": "2024-01-15T16:45:00Z",
      "created_at": "2024-01-15T16:45:00Z",
      "duration": 1500,
      "views_count": 38,
      "rating": 4.7,
      "teacher_name": "Karim Abdullayev",
      "order": 2
    }
  ],
  "results": [ /* Same as lessons */ ]
}
```

---

## Qo'shimcha Query Parametrlar

### `/api/lessons/` uchun Filtrlash

#### 1. Muayyan Kursning Darslarini Ko'rish
```
GET /api/lessons/?course_id=1
```

#### 2. Muayyan Fan bo'yicha Darslarini Ko'rish
```
GET /api/lessons/?subject=Python
```

#### 3. Hammasi Uchun Darslarini Ko'rish (Public Mode)
```
GET /api/lessons/?public=true
```
Bu holatda `IsAuthenticated` shartni yoqun bo'ladi va boshqa o'qituvchilarning darslarini ham ko'rish mumkin bo'ladi.

---

## Javob Maydonlari Tushuntirilishi

### Dashboard Javob Maydonlari

| Maydon | Tavsif |
|--------|--------|
| `success` | So'rov muvaffaqiyatli bo'lsa `true` |
| `user` | O'qituvchi ma'lumotlari (username, email, ismi) |
| `courses_count` | O'qituvchining yaratgan kurslarining umumiy soni |
| `courses` | Kurslarning to'liq maslahatlar |

### Darslar Javob Maydonlari

| Maydon | Tavsif |
|--------|--------|
| `id` | Dars ID raqami |
| `title` | Dars nomi |
| `description` | Dars haqida batafsil ma'lumot |
| `video_url` | Video faylning to'liq URL manzili |
| `course_id` | Dars qaysi kursga tegishli (ID) |
| `course_title` | Dars qaysi kursga tegishli (Nom) |
| `course_name` | Dars qaysi kursga tegishli (Nom) |
| `uploaded_date` | Video yuklangan sana va vaqti (ISO format) |
| `created_at` | Video yuklangan sana va vaqti (ISO format) |
| `duration` | Video davomiyligi (soniyada) |
| `views_count` | Videoni qancha kishi ko'rgan |
| `rating` | Video reyting (0-5) |
| `teacher_name` | O'qituvchining ismi |
| `order` | Darsning kurs ichidagi tartibi |

---

## Foydalanish Misoli (Frontend)

### React Misolida:

```javascript
// O'qituvchi tokenini olish
const token = getAccessToken();

// Dashboard ma'lumotlarini olish (Kurslar soni)
fetch('http://localhost:8000/api/dashboard/', {
  headers: {
    'Authorization': `Token ${token}`
  }
})
.then(res => res.json())
.then(data => {
  console.log('Kurslar soni:', data.courses_count);
  console.log('Kurslar:', data.courses);
});

// Darslarni (Videolarni) olish
fetch('http://localhost:8000/api/lessons/', {
  headers: {
    'Authorization': `Token ${token}`
  }
})
.then(res => res.json())
.then(data => {
  console.log('Videolar soni:', data.count);
  data.lessons.forEach(lesson => {
    console.log(`${lesson.title} - ${lesson.course_title}`);
    console.log(`Tavsif: ${lesson.description}`);
    console.log(`Video: ${lesson.video_url}`);
    console.log(`Yuklangan: ${lesson.uploaded_date}`);
  });
});
```

---

## Xavfsizlik

Ikkala endpoint ham `IsAuthenticated` permissiyasiga ega, ya'ni:
- Faqat o'z darslarini ko'rish mumkin (public=true bo'lmasa)
- Login tokenisiz raqamni olish mumkin emas
- Boshqa o'qituvchining darslarini ko'rish mumkin emas (maxfiy rejimda)
