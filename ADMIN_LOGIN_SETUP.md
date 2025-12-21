# Admin Panel Login Sozlash

## Yangi Admin User Yaratish

### 1️⃣ Script orqali (OSON)

Terminal'da manashuni run qiling:

```bash
cd c:\Users\ozodb\OneDrive\Documents\GitHub\Education
python create_admin_new.py
```

### 2️⃣ Django Shell orqali (ADVANCED)

Terminal'da:

```bash
cd c:\Users\ozodb\OneDrive\Documents\GitHub\Education
python manage.py shell
```

Shell'da manashuni yozib enter qiling:

```python
from django.contrib.auth import get_user_model
User = get_user_model()

# Eski adminlarni oʻchirish
User.objects.filter(is_superuser=True).delete()

# Yangi admin yaratish
User.objects.create_superuser(
    username='Ozodbek-0091',
    email='admin@edugame.uz',
    password='ozodbek-0099'
)

print("✅ Admin yaratildi!")
exit()
```

---

## Admin Panel'ga Kirish

URL: `http://localhost:3000/admin-dashboard`

**Credentials:**
- **Username:** `Ozodbek-0091`
- **Password:** `ozodbek-0099`

---

## Admin Panel Features

✅ Teacher Requests - O'qituvchi so'rovlarini boshqarish
✅ Teachers - Tasdiqlangan o'qituvchilar ro'yxati
✅ Overview - Statistika va dashboard

