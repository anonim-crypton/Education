# Kurslar Katalogi Django Integratsiyasi

## Qisqacha Tavsif

Bu dokumentatsiya Next.js dashboardiga Django ma'lumotlar bazasidan kurslarni dinamik qo'shish usulini tasvirlab beradi.

## Arxitektura

```
Django Backend                     Next.js Frontend
┌─────────────────────────┐       ┌──────────────────────┐
│  Course Model           │       │ /app/dashboard       │
│  - title               │◄──────┤ - Courses Display    │
│  - teacher             │ API   │ - 6 Per Row Grid     │
│  - lessons             │       │ - Responsive Layout  │
│  - icon                │       │                      │
│  - color               │       └──────────────────────┘
│  - teacher_image       │
└─────────────────────────┘
    ↓
Django Admin Panel
- Kurslar qo'shish/tahrirlash
- Iconlar tanlash
- Ranglar qo'shish
```

## Joriy Holat

✅ **Django** tarafida:
- Course Model allaqachon mavjud
- Admin panel to'liq to'ldirilgan
- API endpoints ishchi holatda (/api/users/courses/)
- 5 ta asosiy kurs DatabaseCourses init scriptiga tayyorlangan

✅ **Next.js** tarafida:
- Dashboard API dan kurslarni fetch qiladi
- Icon mapping to'g'rilangan
- 6-ustun grid layout sozlanishi tayyor (sm:2, md:3, lg:4, xl:6)
- Teacher akkaunt tekshiruvi qo'shilgan

## Boshlash

### 1. Django Kurslarini Yaratish

```bash
cd edu_game
python manage.py shell < create_courses.py
```

Yoki Django shellda:
```python
python manage.py shell
```

```python
from users.models import Course

courses_data = [
    {
        'title': 'Dasturlash',
        'teacher': 'Ali Qodirov',
        'lessons': 24,
        'icon': 'code',
        'color': 'from-blue-600 to-blue-500',
        'description': 'Python, JavaScript va web development',
        'order': 1,
    },
    # Qo'shimcha kurslarni shuning kabi qo'shish mumkin
]

for course_data in courses_data:
    Course.objects.create(**course_data, is_active=True)
```

### 2. Django Adminning orqali Kurs Qo'shish

1. Django Admin-ga kiring: http://localhost:8000/admin/
2. "Courses" bo'limiga o'ting
3. "Add Course" tugmasini bosing
4. Quyidagi maydonlarni to'ldiring:

| Maydon | Qiymat | Misol |
|-------|--------|--------|
| Title | Kurs nomi | "Dasturlash" |
| Teacher | O'qituvchi ismi | "Ali Qodirov" |
| Lessons | Dars soni | 24 |
| Icon | Ikonica turi | code, languages, calculator, book, scale, book-open |
| Color | Gradient ranglar | from-blue-600 to-blue-500 |
| Description | Qisqa tavsif | "Python asoslari" |
| Order | Tartibi | 1, 2, 3... (har qatorida 6 ta) |
| Is Active | Faol | ✓ Checked |

### 3. Icon Variantlari

```
code          - Dasturlash (Code icon)
languages     - Tillar (Languages icon)
calculator    - Matematika (Calculator icon)
book          - Tarix (Book icon)
scale         - Huquq (Scale/Balance icon)
book-open     - Kitob (BookOpen icon)
```

### 4. Rang Variantlari (Tailwind Gradient)

```css
from-blue-600 to-blue-500
from-green-600 to-green-500
from-purple-600 to-purple-500
from-orange-600 to-orange-500
from-red-600 to-red-500
from-pink-600 to-pink-500
from-indigo-600 to-indigo-500
from-yellow-600 to-yellow-500
from-cyan-600 to-cyan-500
```

### 5. Grid Tuzilmasi

Dashboard-da kurslar quyidagi grid'da ko'rsatiladi:

- **Mobile (sm):** 2 ta kurs per qator
- **Tablet (md):** 3 ta kurs per qator
- **Laptop (lg):** 4 ta kurs per qator
- **Desktop (xl):** **6 ta kurs per qator** ← ANA BOSHLANG'ICH LAYOUT

Agar 6 ta dan ko'p kurs bo'lsa, avtomatik tarzda pastga qo'shiladi.

Misol:
```
Row 1: 6 kurs  ┌─ ─ ─ ─ ─ ─┐
Row 2: 5 kurs  │ 1 2 3 4 5 6│
               └─ ─ ─ ─ ─ ─┘
               ┌─ ─ ─ ─ ───┐
               │ 7 8 9 10 11│
               └─ ─ ─ ─ ─ ─┘
```

## API Endpoints

### Kurslarni olish (Public)
```
GET /api/users/courses/
```

Javob:
```json
{
  "success": true,
  "count": 5,
  "courses": [
    {
      "id": 1,
      "title": "Dasturlash",
      "teacher": "Ali Qodirov",
      "lessons": 24,
      "icon": "code",
      "color": "from-blue-600 to-blue-500",
      "description": "Python va JavaScript",
      "teacher_image_url": "/media/teacher_images/ali.jpg",
      "order": 1,
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Yangi kurs yaratish (Admin only)
```
POST /api/users/courses/
```

## Frontend Integratsiya

Dashboard-da kurslar ko'rsatiladi:

1. **Fetch Qilish:**
   ```javascript
   // /app/dashboard/page.tsx
   fetch('/api/users/courses/')
     .then(res => res.json())
     .then(data => setCourses(data.courses))
   ```

2. **Defaultlar:**
   Agar API dan kurslar kelsa ulardan, aks holda 5 ta default kurs ko'rsatiladi

3. **Icon Mapping:**
   ```javascript
   const iconMap = {
     code: Code,
     languages: Languages,
     calculator: Calculator,
     book: BookA,
     scale: Scale,
     'book-open': BookOpen,
   }
   ```

## Teacher Login

O'qituvchilar Django admin-dan login qiladi, NextJS-dan emas.

1. Teacher username va parol-ni kiriting
2. System teacher status-ini tekshiradi
3. Agar `is_teacher === true` bo'lsa, xato:
   ```
   "O'qituvchi akkauntlari uchun Django panelidan foydalaning: 
    http://localhost:8000/admin/"
   ```

## Deployment Checklist

- [ ] create_courses.py script orqali 5 ta kurs qo'shilgan
- [ ] Django Admin-dan minimal 1 ta kurs qo'shilgan (test uchun)
- [ ] API endpoint ishchi: GET /api/users/courses/
- [ ] Dashboard kurslar ko'rsatadi
- [ ] 6 ta dan ko'p kurs bo'lsa, grid to'g'ri ko'rsatiladi
- [ ] Teacher akkauntlar Django-ga yo'naltiriladi
- [ ] Icon va ranglar to'g'ri ko'rsatiladi
