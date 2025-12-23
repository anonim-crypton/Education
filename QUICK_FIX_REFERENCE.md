# O'qituvchi Panel - Tez Havolalar (Quick Reference)

## Muammo va Yechimi

### Muammo #1: "Darslar" va "O'quvchilar" tugmalari yo'q
**Yechim**: Sidebar'ga qo'shildi ✅

**Qayta bosma buyruqi**: Sidebar regenerate qilish uchun page refresh qiling

---

### Muammo #2: Dashboard'da Kurs soni ko'rinmayapti
**Yechim**: `/api/dashboard/` updated ✅

**API Call**:
```javascript
fetch('/api/dashboard/', {
  headers: { 'Authorization': `Token ${token}` }
})
.then(r => r.json())
.then(d => console.log(d.courses_count))
```

---

### Muammo #3: Video yukladiqda Darslar tugmasi yo'q bo'lib qolayabdi
**Yechim**: Sidebar layout fixed ✅

**Status**: Hozir tugmalar har vaqt ko'rinadi

---

## 📍 URL Manziллari

| Sahifa | URL | Nima Ko'rsatadi |
|--------|-----|-----------------|
| Kurslar | `/teacher-dashboard` | Barcha kurslar |
| Darslar | `/teacher-dashboard/lessons` | Barcha videolar ✨ |
| O'quvchilar | `/teacher-dashboard/students` | Barcha o'quvchilar ✨ |
| Video Yuklash | `/teacher-dashboard/upload-video` | Upload forma |
| Kurs Qo'shish | `/teacher-dashboard/add-course` | Kurs forma |

---

## 🔌 API Manziллари

| Endpoynt | Method | Tavsif |
|----------|--------|--------|
| `/api/dashboard/` | GET | Kurslari sonini ko'rish |
| `/api/lessons/` | GET | Darslarni ko'rish |
| `/api/users/teacher/students/` | GET | O'quvchilarni ko'rish ✨ |

---

## 🧪 Testing Commands

### Token olish:
```bash
curl -X POST http://localhost:8000/api/teacher/api/login/ \
  -d "username=teacher1&password=pass123"
```

### Dashboard ko'rish:
```bash
curl http://localhost:8000/api/dashboard/ \
  -H "Authorization: Token {token}"
```

### Darslarni ko'rish:
```bash
curl http://localhost:8000/api/lessons/ \
  -H "Authorization: Token {token}"
```

### O'quvchilarni ko'rish:
```bash
curl http://localhost:8000/api/users/teacher/students/ \
  -H "Authorization: Token {token}"
```

---

## 💾 Fayllar

### Yangi Fayllar:
- `app/teacher-dashboard/lessons/page.tsx`
- `app/teacher-dashboard/students/page.tsx`

### O'zgartirilgan Fayllar:
- `app/teacher-dashboard/layout.tsx`
- `edu_game/users/views.py`
- `edu_game/users/urls.py`

---

## ⚙️ Konfiguratsiya

### Backend Server:
```bash
cd edu_game
python manage.py runserver 0.0.0.0:8000
```

### Frontend Server:
```bash
npm run dev
# Yoki
next dev
```

---

## 🐛 Debugging Tips

### Lesson page load qilmayotgan bo'lsa:
1. Browser console'ni ochish (F12)
2. Network tab'ni ochish
3. `/api/lessons/` call ko'rish
4. 401 xatosi bo'lsa → token refresh qiling
5. 404 xatosi bo'lsa → backend restart qiling

### Students page load qilmayotgan bo'lsa:
1. Endpoint mavjud ekanini verify qiling
2. Backend logs'ni check qiling
3. Database connection check qiling

### Sidebar ko'rinmayotgan bo'lsa:
1. CSS z-index values check qiling
2. Browser developer tools'da inspect qiling
3. CSS modules properly loaded ekanini verify qiling

---

## 🎯 Checklist - Deploy Oldindan

- [ ] Backend migrations run qilindi (`python manage.py migrate`)
- [ ] New endpoint tests passed
- [ ] Frontend pages load correctly
- [ ] Navigation buttons work
- [ ] API responses correct JSON
- [ ] Error handling tested
- [ ] Mobile responsive tested
- [ ] Search functionality works
- [ ] Play button works
- [ ] Delete button works (UI only)

---

## 📞 Emergency Contacts / Notes

### Agar hamma ko'rinmayotgan bo'lsa:
1. Page refresh qiling (Ctrl+F5)
2. Cache clear qiling
3. Browser restart qiling
4. Server restart qiling

### Agar API error berayotgan bo'lsa:
1. Backend logs ko'rish: `tail -f server.log`
2. Database connection check
3. Migrations check: `python manage.py migrate --fake`
4. Permissions check

### Performance Issues:
1. Database queries optimize qiling
2. Images compress qiling
3. Lazy loading add qiling
4. Caching implement qiling

---

## ✅ Changes Summary

| Feature | Status | Date |
|---------|--------|------|
| Dashboard Courses | ✅ | Dec 2024 |
| Lessons API | ✅ | Dec 2024 |
| Students API | ✅ | Dec 2024 |
| Lessons Page | ✅ | Dec 2024 |
| Students Page | ✅ | Dec 2024 |
| Navigation Fix | ✅ | Dec 2024 |

---

## 📖 Full Documentation

Batafsil o'qish uchun:
- `TEACHER_ADMIN_NAVIGATION_FIXED.md` - Navigatsiya
- `TEACHER_PANEL_SUMMARY.md` - Uzbek tilda tushuntirish
- `IMPLEMENTATION_COMPLETE_TEACHER_FEATURES.md` - To'liq detail
- `QUICK_ADMIN_API_GUIDE.md` - API guide
- `TEACHER_DASHBOARD_API_IMPROVEMENTS.md` - Technical details

---

**Last Updated**: December 23, 2024  
**Status**: ✅ Production Ready
