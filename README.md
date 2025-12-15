# EduLearn - Onlayn Ta'lim Platformasi

Zamonaviy onlayn ta'lim platformasi, foydalanuvchi autentifikatsiyasi va Google OAuth integratsiyasi bilan.

## Texnologiyalar

### Frontend
- **Next.js 16** – Ilovalar yo'naltiruvchisi bilan React ramkasi
- **TypeScript** – Turi-xavfsiz rivojlantirish
- **Tailwind CSS** – Foydali-birinchi CSS ramkasi
- **Framer Motion** – Animatsiya kutubxonasi
- **React OAuth Google** – Google autentifikatsiyasi

### Backend
- **Python** – Versiya 3.11.4
- **Django** – Versiya 5.2.9
- **Django REST Framework** – RESTful API yaratish uchun
- **SQLite** – Ma'lumotlar bazasi (ishlab chiqish uchun)
- **Token Authentication** – API yo'naltiruvchi nuqtalari xavfsizligi uchun

## Amalga oshirilgan funksiyalar

### Autentifikatsiya
- ✅ Foydalanuvchi ro'yxatdan o'tishi (tekshiruvi bilan)
- ✅ Foydalanuvchi tizimga kirishi (token bilan)
- ✅ Google OAuth 2.0 integratsiyasi
- ✅ Parol mustahkamligini tekshirish (kamida 8 ta belgidan, katta va kichik harf, raqam, maxsus belgisi)
- ✅ Ro'yxatdan o'tishda maktab nomi saqlash
- ✅ Token asosidagi API autentifikatsiyasi

### Foydalanuvchi boshqaruvi
- ✅ Maxsus foydalanuvchi modeli (maktab ma'lumotlari bilan)
- ✅ Foydalanuvchi profili API yo'naltiruvchi nuqtasi
- ✅ Chiqish (logout) funksiyasi
- ✅ Administrator paneli orqali foydalanuvchilarni boshqarish

### Xavfsizlik
- ✅ CORS himoyasi
- ✅ Token asosidagi autentifikatsiya
- ✅ Parol shifrlashi
- ✅ Kiruvchi ma'lumotlarni tekshirish

## Tez ishga tushirish

### Talablar
- Python 3.11+
- Node.js 18+
- Google OAuth Mijoz ID (Google tizimiga kirish uchun)

### Backend sozlash

```bash
cd edu_game
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend sozlash 

```bash
npm install
npm run dev
```

### Loyihaning tuzilishi 

```
Education/
├── app/                           # Next.js ilovasi katalogi
│   ├── login/                     # Tizimga kirish sahifasi
│   ├── register/                  # Ro'yxatdan o'tish sahifasi
│   ├── layout.tsx                 # Google OAuth bilan asosiy layout
│   └── ...
├── components/                    # Qayta ishlatiladigan React komponentlari
├── lib/                           # Foydali utilitilar
│   └── api.ts                     # API mijozi funksiyalari
├── edu_game/                      # Django loyihasi
│   ├── users/                     # Foydalanuvchilar ilovasi
│   │   ├── models.py              # CustomUser modeli
│   │   ├── views.py               # API ko'rinishlari
│   │   ├── serializers.py         # DRF serializerlar
│   │   ├── urls.py                # Ilovaning URL-lari
│   │   ├── admin.py               # Administrator konfiguratsiyasi
│   │   └── signals.py             # Token yaratish signallari
│   ├── edu_game/                  # Loyiha sozlamalari
│   │   ├── settings.py            # Django sozlamalari
│   │   └── urls.py                # Loyiha URL-lari
│   └── manage.py
├── SETUP_INSTRUCTIONS.md          # Batafsil sozlash ko'rsatmalari
└── README.md

### Eng muximi
Kod ishlashi uchun ikkala server ham run qilinishi kerak - Backend ham Frontend ham !!!!
