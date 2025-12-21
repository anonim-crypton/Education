# Yangi Admin Tizimi - O'rnatish va Foydalanish

## Umumiy Qidirish

**URL:** `http://127.0.0.1:8000/` (yoki `http://127.0.0.1:8000/api/users/status/`)

Bu sahifada:
- API holati ko'rinadi
- **Yangi Admin Yaratish** tugmasi bor (o'ng pastki burchakda `+` belgisi)

## Boshlang'ich O'rnatish (Birinchi Admin)

### 1-qadam: Eski Admin Hisoblari o'chirib Tashlash

Agar avvalgi admin hisoblari mavjud bo'lsa, ularni o'chirib tashlash kerak:

```bash
cd edu_game
python manage.py clear_admins
```

Yoki Django shell orqali:

```bash
python manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.filter(is_superuser=True).delete()
exit()
```

### 2-qadam: API Status Sahifasida Admin Yaratish

1. **Browser'da kirish:** `http://127.0.0.1:8000/`
2. **Sahifani ochish:** api_status.html ko'rinadi
3. **O'ng pastki burchakda** `+` tugmasini bosing
4. **Modal ochiladiM** - "Yangi Admin Yaratish" formasi
5. **Forma toldiringM:**
   - **Username:** adminning nomi (masalan: `superadmin`)
   - **Parol:** kuchli parol (kamida 6 ta belgi)
6. **"Yaratish" tugmasini bosing**

### 3-qadam: Admin Dashboard'ga kirish

Admin muvaffaqiyatli yaratilgandan keyin, avtomatik ravishda admin login sahifasiga yo'naltiriladi.

**URL:** `http://127.0.0.1:8000/api/users/admin/login/`

1. Birinchi bosqichda yaratgan **username** va **parol**ni kiriting
2. **Login tugmasini bosing**
3. Admin dashboard sahifasiga kirasiz

## Yangi Admin Yaratish (Admin Tomonidan)

Agar allaqachon admin mavjud bo'lsa, faqat **mavjud admin** yangi admin yarata oladi:

1. Admin sifatida login qiling
2. API Status sahifasiga (http://127.0.0.1:8000/) kirib, `+` tugmasini bosing
3. Yangi admin ma'lumotlarini kiriting
4. **Yaratish** tugmasini bosing

Agar token yo'llanmasa, **error** chiqadi: "Admin faqat mavjud admin tomonidan yaratilishi mumkin"

## API Endpoint

### Admin Yaratish

**URL:** `/api/users/admin/api/create/`

**Method:** POST

**Request:**
```json
{
    "username": "superadmin",
    "password": "strongpassword123"
}
```

**Response (Success - 201):**
```json
{
    "success": true,
    "message": "Yangi admin muvaffaqiyatli yaratildi",
    "admin": {
        "id": 1,
        "username": "superadmin",
        "email": "superadmin@admin.local",
        "created_at": "2025-12-19T10:30:00Z"
    },
    "token": "abc123def456..."
}
```

**Response (Error - 400):**
```json
{
    "success": false,
    "error": "Username \"superadmin\" allaqachon mavjud"
}
```

## Security

- **Birinchi admin:** hech qanday autentifikatsiyasiz yaratiladi (`AllowAny` permission)
- **Keyingi adminlar:** faqat **existing admin** tomonidan yaratiladi
- **Parol talabi:** Kamita 6 ta belgi
- **Username talabi:** Kamita 3 ta belgi, noyob bo'lishi kerak

## Admin Hisoblari o'Chirish

Django Admin'da yoki programma orqali:

```bash
python manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()

# Ma'lum admin o'chirish
admin = User.objects.get(username='superadmin')
admin.delete()
```

## Troubleshooting

### "Admin faqat mavjud admin tomonidan yaratilishi mumkin"
- Avvalgi admin mavjud ekan
- Faqat login qilgan admin yangi admin yarata oladi
- Token yuborishni tekshiring

### "Username allaqachon mavjud"
- Username boshqa user tomonidan allaqachon ishlatilgan
- Boshqa username tanlang

### "Parol kamida 6 ta belgidan iborat bo'lishi kerak"
- Parolni uzunroq qiling

## To'liq Almashtirish (Tavsiya Etilmaydi)

Agar hech qanday admin bo'lmasin deb xohlagansiz:

```bash
python manage.py clear_admins
# Yoki
python manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.filter(is_superuser=True, is_staff=True).delete()
```

Keyin API Status sahifasida yangi admin yaratishni boshlang.
