# O'qituvchi Admin Paneli Yaxsilashlari

Bu hujjat barcha o'qituvchi admin paneli va veb sayt kurslar qismiga qilingan yaxsilashlarlni tavsiflaydi.

## 1. O'qituvchi Dashboard Yaxsilashlari

### Faillar:
- `edu_game/teachers/templates/teachers/dashboard.html`
- `edu_game/teachers/views.py`

### O'zgarishlar:

#### Header Qisimida Fani va Ikonkasi:
- **Oldingi**: Faqat o'qituvchining ismi va usernami
- **Yangi**: Headerni o'ng tomoniga fani va unga mos ikonka qo'shildi
- Rang va dizayn: Mavi rang bilan tavsifiy quti `bg-gray-50 dark:bg-gray-800`

#### Stats Grid Yangilash:

**Darslar Statsitikasi:**
- **Oldingi**: 0 (qat'iy)
- **Yangi**: `{{ lessons_count|default:"0" }}` - Dinamik sonlar
- Tarifi: "Jami darslar" → "Video darsliklar"

**O'quvchilar Statistikasi:**
- **Oldingi**: 0 (qat'iy)
- **Yangi**: `{{ students_count|default:"0" }}` - Barcha saytga ro'yxatdan o'tgan oddiy foydalanuvchilar
- Tarifi: "Jami o'quvchilar" → "Foydalanuvchilar"

**Baholash → Tajriba:**
- **Oldingi**: Yulduzlar bilan baholash (rating/5)
- **Yangi**: O'qituvchining yillik tajribasi `{{ teacher.experience_years }}`
- Rang: Sariq → Binafsha

### Backend Logikasi (views.py):

```python
# Lessons count hisoblash
teacher_courses = Course.objects.filter(teacher_user=request.user)
lessons_count = Lesson.objects.filter(course__in=teacher_courses).count()

# Students count hisoblash (barcha oddiy foydalanuvchilar)
students_count = CustomUser.objects.filter(is_staff=False, is_superuser=False).count()
```

#### Sidebar Yangilashlari:

**Yangi Tugma: "Darslik Yuklash"**
- Ikona: Upload icon (↑)
- Hajmi: Boshqa tugmalar bilan bir xil
- Rang: Tungi mavzuda to'liq ishlaydi

---

## 2. Navbar (Kurslar) Dropdown Yangilashlari

### Fayl:
- `components/navbar.tsx`

### O'zgarishlar:

#### O'qituvchilar Ro'yxati:
- **Oldingi**: Sof oq array
- **Yangi**: API dan dinamik ravishda o'qituvchilar yuklanadi

#### Dropdown Ma'lumotlari:
Har bir o'qituvchi:
- **Nom**: `teacher.user.get_full_name`
- **Fan**: `teacher.subject` (manifest bilan ko'rsatiladi)
- **Tavsif**: Bio (yoki "Bio mavjud emas")
- **Ikonka**: Fan bo'yicha avtomatik tanlanadi:
  - Dasturlash → Code icon
  - Tillar → Languages icon
  - Matematika → Calculator icon
  - Tarix → History icon
  - Huquq → Scale icon
  - Boshqalar → Book icon

#### Fetch Logikasi:
```typescript
const getCourseIcon = (subject: string) => {
  // Subject bo'yicha ikonka tanlash
  if (subject.includes("dastur") || subject.includes("code")) {
    return CodeIcon;
  }
  // ... boshqa variantlar
}

// Fetch teachers from API
fetch(`${API_URL}/api/teachers/`)
  .then(res => res.json())
  .then(data => {
    // Teachers ro'yxatini shakllantirish
    setTeachersCourses(data.map(teacher => ({...})))
  })
```

#### UI Yangilashlari:
- **Desktop dropdown**: 
  - Har bir o'qituvchi uchun ikonka, nom, fan (manifest), bio
  - "Barcha kurslarni ko'rish" tugmasi qoldi
  
- **Mobile dropdown**: 
  - O'qituvchining nomi + fan (qavsda)
  - Ikonka bilan
  - Shunga o'xshash dizayn

- **Yuklash holati**: 
  - Bo'sh holatda: "O'qituvchilar yuklangan'yaponaqdi..."

---

## 3. Sozlamalar va Interaksiya

### Auto-yangilanish:
- O'qituvchi yaratilganda → navbar o'zini yangilash (page reload)
- Students count → Hamma vaqt yangilash (har kuni qo'shilgan yangi foydalanuvchilar)
- Lessons count → Kurs asosida hisoblash

### Error Handling:
- Agar API x-atolikka duch kelsa → bo'sh array ko'rsatiladi
- Try-catch bilan barkaror

### Dark Mode:
- Barcha o'zgarishlar dark/light mavzuda to'liq ishlaydi
- Tailwind dark: prefix ishlatiladi

---

## 4. API Endpoints

### Kerakli:
- `GET /api/teachers/` - Barcha o'qituvchilarni olish
  - Response struktura:
  ```json
  {
    "id": 1,
    "user": {
      "id": 1,
      "username": "ali_teacher",
      "get_full_name": "Ali Karimov"
    },
    "subject": "Dasturlash",
    "bio": "Tajribali o'qituvchi"
  }
  ```

### Mavjud:
- `POST /api/users/profile/` - Foydalanuvchi profilini olish
- Teacher model ro'yxat xizmatini yangilash kerak

---

## 5. Talab Ro'yxati

✅ **Tayyor:**
1. O'qituvchi paneli headerida fan va ikonka
2. Darslar sonini dinamik ko'rsatish
3. O'quvchilar (foydalanuvchilar) sonini ko'rsatish
4. Baholash → Tajribaga almashtirish
5. "Darslik Yuklash" tugmasi sidebar'ga qo'shish
6. Navbar Kurslar dropdownda o'qituvchi fan va ikonka
7. O'qituvchi yaratilganda avtomatik dropdown'da ko'rinish

⚠️ **Kerak bo'lgan:**
- Video yuklash funksiyasi (Darslik Yuklash sahifasi)
- Video upload uchun UI
- Bio input field

---

## 6. Testing Checklist

- [ ] O'qituvchi panelini ko'rish - fan va ikonka ko'rsatiladi
- [ ] Dashboard statistikasi to'g'ri (lesson, students, experience)
- [ ] Navbar Kurslar dropdownida o'qituvchilar bilan ikonkalar
- [ ] Yangi o'qituvchi yaratilsa → dropdown'da ko'rinadi
- [ ] Dark/Light mode o'zgartirilsa → barcha element to'g'ri ko'rinadi
- [ ] Mobile versiyada dropdown ishlaydi
- [ ] API'dan data yuklanmaysa → "Yuklangan'yaponaqdi..." ko'rsatiladi

---

## 7. Kelajakdagi Takmillashlar

1. **Darslik Upload Sahifasi**: Full functionality
2. **Teacher Profile**: Bio ni ko'rsatish
3. **Filter**: Kurslarni fan bo'yicha filter qilish
4. **Analytics**: O'quvchi faoliy ko'rsatkichlari
