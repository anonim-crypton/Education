# 🚀 TEZKOR START - 2 TERMINAL, 10 MINUT

---

## TERMINAL 1️⃣ - BACKEND

```bash
cd backend

# Virtual environment yaratish va activate qilish
python -m venv venv
venv\Scripts\activate

# Dependencies o'rnatish
pip install -r requirements.txt

# Database migration
python manage.py makemigrations
python manage.py migrate

# Admin user yaratish
python manage.py createsuperuser
# Username: admin
# Email: admin@example.com  
# Password: admin123

# SERVER ISHGA TUSHIRISH
python manage.py runserver

# RESULT:
# Starting development server at http://127.0.0.1:8000/
# Server bu yerda qolib ketadi (Ctrl+C orqali to'xtatish)
```

---

## TERMINAL 2️⃣ - FRONTEND

```bash
# Asosiy folderga o'tish (Education folder'da)
cd .  # Allaqachon bu yerdasiz

# Dev server ishga tushirish
npm run dev

# RESULT:
# ▲ Next.js 16.0.10
# - Ready in 3.2s
# ➜  http://localhost:3000
```

---

## ✅ TEST QILISH

1. **Frontend:** http://localhost:3000 ga o'tish
2. **Login** qilish
3. **Dashboard** → "O'qituvchi bo'lish" tugmasini bosish
4. **Form** to'ldirish:
   - To'liq Ism: Ali Qodirov
   - Fan: Dasturlash
   - Tajriba: 5
   - Telefon: +998 91 234 5678
5. **"Yuborish"** tugmasini bosish

### Result:
- ✅ Success message ko'rinishi kerak
- ✅ Admin portal'da so'rov ko'rish kerak (`http://localhost:8000/admin`)
- ✅ Username/password admin'ga ko'rinishi kerak

---

## 🔗 URLs

| Manzil | Nima | Login |
|--------|------|-------|
| http://localhost:3000 | **Frontend** | user credentials |
| http://localhost:8000 | **Backend** | - |
| http://localhost:8000/admin | **Admin Panel** | admin/admin123 |
| http://localhost:8000/api/teachers/requests/ | **API** | Token auth |

---

## ✨ FEATURES

✅ O'qituvchi so'rovini yuborish  
✅ Admin panelda ko'rish  
✅ Tasdiqlash (Username + parol yaratish)  
✅ Rad etish  
✅ O'qituvchilar ro'yxati  

---

## 🆘 PROBLEM SOLVING

### "ModuleNotFoundError: No module named 'rest_framework'"
```bash
pip install -r requirements.txt
```

### "No such table: teachers_teacherrequest"
```bash
python manage.py migrate
```

### "CORS Error" (frontend'dan)
✅ Already fixed in settings.py

### "Connection refused" (frontend'dan)
- Backend server'i ishga tushirilganmi?
- Port 8000 da turganmi?
- Check: `http://localhost:8000/api/teachers/requests/`

---

## 📝 NOTES

- **Frontend:** React/Next.js @ port 3000
- **Backend:** Django @ port 8000
- **Database:** SQLite (db.sqlite3)
- **Admin:** http://localhost:8000/admin
- **API:** Token-based authentication

---

## COMPLETED ✅

- ✅ Frontend (Admin Dashboard, Forms, Buttons)
- ✅ Backend (Django, API Views, Models)
- ✅ Database (SQLite migrations ready)
- ✅ CORS (Configured)
- ✅ Authentication (Token-based)
- ✅ All endpoints (Ready)

**EVERYTHING IS READY TO RUN!** 🎉
