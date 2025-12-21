# ⚡ QUICK BACKEND START - 5 MINUT

**Xato:** 404 - API endpoint'i yo'q  
**Solution:** Django backend'ni ishga tushirish

---

## 🚀 STEP 1: Virtual Environment

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate

# MacOS/Linux:
source venv/bin/activate
```

---

## 📦 STEP 2: Install Requirements

```bash
pip install -r requirements.txt
```

---

## 🗄️ STEP 3: Migration

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 👤 STEP 4: Admin User Create

```bash
python manage.py createsuperuser
# Username: admin
# Email: admin@example.com
# Password: admin123
```

---

## 🚀 STEP 5: Run Server

```bash
python manage.py runserver
# http://localhost:8000
```

---

## ✅ STEP 6: Test

**In Frontend:**
1. Go to http://localhost:3000
2. Login
3. Click "O'qituvchi bo'lish"
4. Fill form and submit
5. ✅ Should work now!

**In Admin:**
1. Go to http://localhost:8000/admin
2. Login with admin credentials
3. See "O'qituvchi so'rovlari"
4. See submitted requests

---

## 📁 Backend Structure

```
backend/
├── manage.py
├── requirements.txt
├── education/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── teachers/
│   ├── __init__.py
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── admin.py
│   └── apps.py
└── db.sqlite3 (created after migration)
```

---

## 🔧 Troubleshooting

### "No module named 'django'"
```bash
pip install -r requirements.txt
```

### "No such table"
```bash
python manage.py migrate
```

### "CORS Error"
✅ Already configured in settings.py

### "401 Unauthorized"
- Make sure you're logged in on frontend
- Token should be in localStorage

---

**Done! Backend ishga tushshdi!** ✅
