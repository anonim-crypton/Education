# O'qituvchi Admin Panel - To'liq Feature Testing Guide

## 1. Admin Panel - O'qituvchi Yaratish

### URL
```
http://localhost:8000/dashboard/create-teacher/
```

### Qadamlar
1. **Fan Tanlash**: Dropdown'dan "Dasturlash", "Matematika", "Ingliz tili" yoki boshqa fan tanlang
2. **Username**: Unik username kiriting (masalan: `ali_teacher`)
3. **Parol**: Kuchli parol kiriting
4. **To'liq Ismi**: O'qituvchining to'liq ismini kiriting
5. **Bio**: O'qituvchi haqida qisqacha ma'lumot yozing
6. **Tajriba**: Yillar sonini kiriting
7. **Yuborish**: Form'ni yuboringiz

### Kutilgan Natija
- ✅ O'qituvchi muvaffaqiyatli yaratildi
- ✅ Message: "O'qituvchi muvaffaqiyatli yaratildi"
- ✅ O'qituvchi Tasdiqlangan O'qituvchilar ro'yxatiga qo'shiladi

---

## 2. O'qituvchi Dashboard

### URL (O'qituvchi Login Qilib Kirish Kerak)
```
http://localhost:8000/teachers/dashboard/
```

### Header Tekshirish
✅ **O'qituvchining Nomi va Username**: Ko'rsatilishi kerak
✅ **Fan Qutisi**: 
- O'ng tomonda yan quti
- Fan nomi (masalan: "Dasturlash")
- Mavzu: "Fani"
- Ikonka: Mavjud bo'lishi kerak

### Stats Grid (Statistika)

#### 1. Darslar
- **Expected**: Yuklab bo'lingan darslar soni
- **Start**: 0 (hali dars yo'q)
- **Label**: "Video darsliklar"

#### 2. O'quvchilar  
- **Expected**: Saytda ro'yxatdan o'tgan barcha oddiy foydalanuvchilar
- **Start**: 1+ (minimal 1)
- **Label**: "Foydalanuvchilar"

#### 3. Tajriba
- **Expected**: O'qituvchi yaratishda kiritilgan yillar
- **Label**: "Yillik tajriba"
- **Color**: Binafsha

### Sidebar Tugmalari
✅ **Dashboard** (Mavjud)
✅ **Darslar** (Mavjud)
✅ **O'quvchilar** (Mavjud)
✅ **Darslik Yuklash** (YA'NI!)

---

## 3. Darslik Yuklash Sahifasi

### URL
```
http://localhost:8000/teachers/upload-lesson/
```

### O'qituvchi Info Qutisi
✅ O'qituvchining nomi
✅ Fan nomi
✅ Ikonka

### Form Fields

#### Dars Nomi (Required)
- Input turini: Text
- Placeholder: "Masalan: Dasturlashning Asoslari"

#### Dars Tavsifi (Optional)
- Input turini: Textarea
- Placeholder: "Dars haqida ma'lumot yozing..."
- Rows: 5

#### Video Fayli (Required)
- **Drag & Drop Zone**: 
  - SVG ikonka
  - Text: "Video faylni shu yerga torting yoki faylni tanlang"
  - Qo'llab-quvvatlanadigan formatlar: MP4, WebM, MOV
  - Max hajm: 1GB

### Tugmalar
1. **Yukla** (Blue, Primary)
2. **Bekor qilish** (Gray, Secondary - Dashboard'ga qaytaradi)

### Yuklash Jarayoni
1. Video faylni tanlang
2. Dars nomini kiriting (masalan: "Loops - Sikllar")
3. Tavsif kiriting (optional)
4. "Yukla" tugmasini bosing
5. **Expected**: 
   - Dashboard'ga qaytarish
   - Success message: "Dars '[Name]' muvaffaqiyatli yuklandi!"
   - Lessons count +1 bo'ladi

---

## 4. Website Navbar - Kurslar Dropdown

### Location
Ana bosh sahifadagi navbar'ning "Kurslar" tugmasi

### Ketaklash
1. Navbar'ga qarang
2. "Kurslar" tugmasi topilsin
3. Ustiga sichqoncha borganida dropdown ochilsin

### Dropdown Ma'lumotlari

Har bir o'qituvchi uchun ko'rsatilishi kerak:

#### **O'qituvchining Nomi**
- Bold, medium font
- Masalan: "Ali Karimov"

#### **Fan (Colored Badge)**
- Mavi badge bilan
- Masalan: "Dasturlash"
- Font: Small, Bold
- Color: Primary (Blue)

#### **Tavsif (Bio)**
- Kichik font
- Muted color (gray)
- Masalan: "Tajribali o'qituvchi va mentori"

#### **Ikonka**
- Sol tomonda
- Fan turida qarab ikonka:
  - 💻 Dasturlash → Code icon
  - 📚 Til → Languages icon
  - 📐 Matematika → Calculator icon
  - 📜 Tarix → History icon
  - ⚖️ Huquq → Scale icon

### Interaksiya
✅ Hover qilinganda: Arqa fonining o'zgarishi
✅ Click qilinganda: Courses sahifasiga o'tish
✅ Mobile: Compact versiyada ham ko'rinadi

---

## 5. Yangi O'qituvchi Qo'shilganida

### Oqabay
1. Admin panel'dan yangi o'qituvchi yarating
2. O'qituvchi o'z dashboardiga kirinadi
3. Darslik yuklaydi
4. Veb sahifani refresh qilinadi

### Expected Natija
✅ Navbar Kurslar dropdown'ida yangi o'qituvchi ko'rinadi
✅ Fan va ikonkasi to'g'ri
✅ Bio ma'lumoti ko'rsatiladi

---

## 6. Dark/Light Mode

Barcha sahifalarni dark mode'da tekshiring:

- [ ] Teacher dashboard - Dark mode
- [ ] Upload lesson page - Dark mode
- [ ] Navbar dropdown - Dark mode
- [ ] Colors to'g'ri ko'rinadi
- [ ] Text readable

---

## 7. Responsive Design

### Mobile (320px - 768px)
- [ ] Teacher dashboard - responsive
- [ ] Upload form - responsive
- [ ] Navbar - hamburger menu
- [ ] Dropdown - mobile version

### Tablet (768px - 1024px)
- [ ] Barcha elementlar proper
- [ ] Layout to'g'ri

### Desktop (1024px+)
- [ ] Full layout
- [ ] Dropdown smooth

---

## 8. Error Handling

### O'qituvchi Dashboard
- [ ] Non-teacher foydalanuvchi kirib kelsa → Error + redirect
- [ ] Teacher bo'lmasa → "Siz o'qituvchi emassiz" message

### Darslik Yuklash
- [ ] Dars nomi bo'sh qolsa → Error message
- [ ] Video fayli bo'lmasa → Error message
- [ ] Yangi Course avtomatik yaratilsa
- [ ] Lesson count +1 bo'ladi

### Navbar
- [ ] API xato bo'lsa → "O'qituvchilar yuklangan'yaponaqdi..." ko'rsatiladi
- [ ] Empty state - graceful handling

---

## 9. API Integration

### Endpoints to Check

#### Teachers API
```
GET /api/teachers/
```
Response struktura:
```json
[
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
]
```

#### Dashboard Stats
- Lessons count: Course bilan bog'langan Lesson'larni sana'i
- Students count: is_staff=False, is_superuser=False bo'lgan CustomUser'lar
- Experience: Teacher.experience_years

---

## 10. Checklist

### Teacher Dashboard
- [ ] Header: Fan va ikonka ko'rsatiladi
- [ ] Lessons count: Dynamik
- [ ] Students count: Dynamik
- [ ] Experience years: Ko'rsatiladi
- [ ] "Darslik Yuklash" tugmasi mavjud

### Upload Lesson
- [ ] Page loads korektly
- [ ] O'qituvchi info ko'rsatiladi
- [ ] Form validation ishlaydi
- [ ] File upload ishlaydi
- [ ] Course avtomatik yaratiladi
- [ ] Lesson yaratiladi
- [ ] Redirect ishlaydi

### Navbar Dropdown
- [ ] Teachers yuklanadi
- [ ] Subject ko'rsatiladi
- [ ] Icon to'g'ri
- [ ] Bio ko'rsatiladi
- [ ] Mobile responsive
- [ ] Dark mode

### Overall
- [ ] No console errors
- [ ] No network errors
- [ ] Barcha messages to'g'ri
- [ ] DB records to'g'ri

---

## Ishlab Chiqarish Tips

1. **Browser Console**: F12 → Console tab'ini tekshiring
2. **Network Tab**: API calls'ni monitor qiling
3. **Database**: Django shell'da queries tekshiring
4. **Logs**: Server logs'da errors'ni tekshiring

---

## Shunga O'xshash Masalalar va Yechimlar

### Agar Dropdown Bo'sh Bo'lsa
```bash
# API'ni test qiling
curl http://localhost:8000/api/teachers/
```

### Agar Lesson Count 0 Bo'lsa
- Database'da Lesson record'lari bor ekanini tekshiring
- Course bog'lanishini tekshiring

### Agar Upload Fayl Bo'lmasa
- Media folder'lari yaratilganini tekshiring
- File permissions'ni tekshiring

---

## Done! ✅

Agar barcha test cases pass bo'lsa, feature production-ready!
