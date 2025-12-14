# EduLearn - Onlayn Ta'lim Platformasi

Zamonaviy onlayn ta'lim platformasi, foydalanuvchi autentifikatsiyasi va Google OAuth integratsiyasi bilan.

## Texnologiyalar

### Frontend
- **Next.js 16** – App Router bilan React framework
- **TypeScript** – Type-safe rivojlantirish
- **Tailwind CSS** – Utility-first CSS framework
- **Framer Motion** – Animatsiya kutubxonasi
- **React OAuth Google** – Google autentifikatsiyasi

### Backend
- **Python** – Versiya 3.11.4
- **Django** – Versiya 5.2.9
- **Django REST Framework** – RESTful API yaratish uchun
- **SQLite** – Ma’lumotlar bazasi (ishlab chiqish uchun)
- **Token Authentication** – API endpointlarni xavfsiz qilish

## Amalga oshirilgan funksiyalar

### Autentifikatsiya
- ✅ Foydalanuvchi ro‘yxatdan o‘tishi (validatsiya bilan)
- ✅ Foydalanuvchi tizimga kirishi (token bilan)
- ✅ Google OAuth 2.0 integratsiyasi
- ✅ Parol kuchi tekshiruvi (kamida 8 ta belgidan, katta va kichik harf, raqam, maxsus belgi)
- ✅ Ro‘yxatdan o‘tishda maktab nomi saqlash
- ✅ Token asosidagi API autentifikatsiyasi

### Foydalanuvchi boshqaruvi
- ✅ Maxsus foydalanuvchi modeli (maktab ma’lumotlari bilan)
- ✅ Foydalanuvchi profili API endpoint
- ✅ Chiqish (logout) funksiyasi
- ✅ Admin paneli orqali foydalanuvchilarni boshqarish

### Xavfsizlik
- ✅ CORS himoyasi
- ✅ Token asosidagi autentifikatsiya
- ✅ Parol hashing
- ✅ Kiruvchi ma’lumotlarni validatsiya qilish

## Tez ishga tushirish

### Talablar
- Python 3.11+
- Node.js 18+
- Google OAuth Client ID (Google login uchun)

### Backend sozlash

```bash
cd edu_game
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver


### Frontend sozlash 

npm install
npm run dev


### Loyihaning tuzilishi 
Education/
├── app/                           # Next.js ilova katalogi
│   ├── login/                     # Login sahifa
│   ├── register/                  # Ro‘yxatdan o‘tish sahifasi
│   ├── layout.tsx                 # Google OAuth bilan root layout
│   └── ...
├── components/                    # Qayta ishlatiladigan React komponentlari
├── lib/                           # Foydali utilitilar
│   └── api.ts                     # API client funksiyalari
├── edu_game/                      # Django loyihasi
│   ├── users/                     # Users app
│   │   ├── models.py              # CustomUser modeli
│   │   ├── views.py               # API views
│   │   ├── serializers.py         # DRF serializerlar
│   │   ├── urls.py                # App URL-lari
│   │   ├── admin.py               # Admin konfiguratsiyasi
│   │   └── signals.py             # Token yaratish signalari
│   ├── edu_game/                  # Project settings
│   │   ├── settings.py            # Django sozlamalari
│   │   └── urls.py                # Project URL-lari
│   └── manage.py
├── SETUP_INSTRUCTIONS.md          # Batafsil sozlash ko‘rsatmalari
└── README.md







### Eng muximi
Kod ishlashi uchun ikkala server ham run qilinishi kerak Backend ham Frontend ham chunarlimi !!!!
