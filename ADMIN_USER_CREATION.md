# Admin User Yaratish

Admin parolini faqat **Backend'da** yaratish kerak. Frontend'dan yaratish xavfli.

## Django Shell orqali Admin Yaratish

### 1. Django Shell'ni Ochish
```bash
python manage.py shell
```

### 2. Admin User Yaratish
```python
from django.contrib.auth.models import User

# Admin user yaratish
admin_user = User.objects.create_superuser(
    username='admin',
    email='admin@edugame.uz',
    password='Yangi_Parol_123'  # Kuchli parol kiriting
)

print(f"Admin user yaratildi: {admin_user.username}")
```

### 3. Shell'dan Chiqish
```python
exit()
```

## Management Command orqali Admin Yaratish (Tavsiya etilgan)

**manage.py** ga qo'shiling:

```bash
python manage.py shell
```

```python
from django.contrib.auth.models import User

# Mavjud admin'ni tekshirish
if User.objects.filter(username='admin').exists():
    print("Admin user allaqachon mavjud")
else:
    User.objects.create_superuser(
        username='admin',
        email='admin@edugame.uz',
        password='Yangi_Parol_123'
    )
    print("✅ Admin user yaratildi")
```

## Admin Dashboardga Kirish

URL: `http://localhost:3000/admin-dashboard`

- **Username**: admin
- **Password**: Siz yaratgan parol

## Xavfsizlik Qaydasi ⚠️

1. **Frontend'da admin yaratmang** - Faqat backend'da
2. **Kuchli parol ishlating** - Minimum 8 belgi, katta/kichik harf, raqam, simvol
3. **Parolni xavfsiz saqlang** - Database backup'iga yozib qo'ying
4. **Regular ravishda yangilang** - Oyiga bir bor parolni o'zgartiring

## Parol O'zgartirish

```bash
python manage.py changepassword admin
```

## Mavjud Admin'ni Tekshirish

```bash
python manage.py shell
```

```python
from django.contrib.auth.models import User
admin = User.objects.filter(username='admin').first()
if admin:
    print(f"Admin mavjud: {admin.username}")
else:
    print("Admin topilmadi")
```
