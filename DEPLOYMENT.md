# Joylashtirish Qo'llanmasi

## Ishlab Chiqarishda Joylashtirish

### Avvalgi Talablar
- Docker va Docker Compose o'rnatilgan
- Google OAuth identifikatsiyalari sozlangan
- Atrof-muhit o'zgaruvchilari o'rnatilgan

### 1. Docker bilan Qurilish va Ishga Tushirish

```bash
docker-compose up -d
```

Quyidagilar ishga tushadi:
- PostgreSQL ma'lumotlar bazasi (port 5432)
- Django backend (port 8000)
- Next.js frontend (port 3000)

### 2. Qo'lda Joylashtirish (Docker siz)

#### Backend Joylashtirish (Django)

```bash
cd edu_game

# Bog'liqliklarni o'rnatish
pip install -r requirements.txt

# Atrof-muhit o'zgaruvchilari faylini yaratish
cp .env.example .env

# Migratsiyalarni ishga tushirish
python manage.py migrate

# Statik fayllarni yig'ish
python manage.py collectstatic --noinput

# Superuser yaratish
python manage.py createsuperuser

# Ishlab chiqarish serveri bilan ishga tushirish (masalan, gunicorn)
gunicorn edu_game.wsgi:application --bind 0.0.0.0:8000
```

#### Frontend Joylashtirish (Next.js)

```bash
# Bog'liqliklarni o'rnatish
npm install

# Atrof-muhit o'zgaruvchilari yaratish
cp .env.local.example .env.local

# Ishlab chiqarish uchun qurilish
npm run build

# Ishlab chiqarish serverini ishga tushirish
npm start
```

### 3. Ishlab Chiqarish Atrof-Muhiti O'zgaruvchilari

#### Django (.env)
```
DEBUG=False
SECRET_KEY=siz-juda-xavfsiz-maxfiy-kalit-shunga-shunga
ALLOWED_HOSTS=siz-domen.com,www.siz-domen.com
DATABASE_URL=postgresql://foydalanuvchi:parol@hostname:5432/ma'lumotlar-bazasi-nomi
GOOGLE_OAUTH_CLIENT_ID=siz-google-mijoz-id
GOOGLE_OAUTH_CLIENT_SECRET=siz-google-mijoz-maxfiy-sozi
```

#### Next.js (.env.local)
```
NEXT_PUBLIC_API_URL=https://api.siz-domen.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=siz-google-mijoz-id
```

### 4. SSL/HTTPS Konfiguratsiyasi

#### Nginx va Let's Encrypt dan Foydalanish

```nginx
server {
    listen 443 ssl http2;
    server_name siz-domen.com;

    ssl_certificate /etc/letsencrypt/live/siz-domen.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/siz-domen.com/privkey.pem;

    # Django backend
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Next.js frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}

# HTTP-ni HTTPS-ga yo'naltirish
server {
    listen 80;
    server_name siz-domen.com;
    return 301 https://$server_name$request_uri;
}
```

### 5. Ma'lumotlar Bazasini Zaxiralash

```bash
# PostgreSQL-ni zaxiralash
pg_dump -U edugame -h localhost edugame > backup.sql

# Zaxiradagi nusxadagi ma'lumotlarni qayta tiklash
psql -U edugame -h localhost edugame < backup.sql
```

### 6. Kuzatish va Jurnallashtirish

Quyidagilar uchun jurnallashtirish o'rnatish:
- Django: settings.py da `logging` konfiguratsiyasidan foydalaning
- Frontend: Dastur kuzatish xizmati ishlatish
- Tizim: systemd journal yoki jurnallarni birlash uchun ishlatish

### 7. Masshtabiylash Bo'yicha Mulohazalar

Yuqori harakatchanlik stsenariylari uchun:
- Bir nechta ishchilari bilan Gunicorn-dan foydalaning
- Asinxron vazifalar uchun Celery-ni amalga oshiring
- Cache va sesiyalar uchun Redis-dan foydalaning
- Statik aktivlar uchun CDN-dan foydalaning
- Ma'lumotlar bazasi o'qish nusxalari

## Muammolarni Hal Qilish

### 502 Yomon Shlyuz

- Backend serveri ishlayotganligini tekshiring
- Nginx da proksi konfiguratsiyasini tekshiring
- Jurnal ko'ring: `docker logs backend`

### CORS Xatoliklari

- `CORS_ALLOWED_ORIGINS` frontend domenini o'z ichiga olganligini tekshiring
- API URL-i frontend da to'g'ri ekanligini tekshiring

### Ma'lumotlar Bazasi Ulanish Xatoliklari

- DATABASE_URL formatini tekshiring
- Ma'lumotlar bazasi identifikatsiyalarini tekshiring
- Ma'lumotlar bazasi ishlayotganligini va ulanishini tekshiring

## Xavfsizlik Tekshirlov Ro'yxati

- [ ] Ishlab chiqarishda DEBUG = False
- [ ] SECRET_KEY mustahkam va noyob
- [ ] ALLOWED_HOSTS to'g'ri sozlangan
- [ ] HTTPS/SSL faollashtirilgan
- [ ] CORS_ALLOWED_ORIGINS frontend domeniga cheklanilgan
- [ ] Ma'lumotlar bazasi zaxiralari faollashtirilgan
- [ ] Muntazam xavfsizlik yangilanishlari
- [ ] Cheklovli tezlik faollashtirilgan
- [ ] Kiruvchi tekshiruvi o'rinida
- [ ] Xato xabarlari maxfiy ma'lumotni oshkor qilmaydi

## Salomatlik Tekshiruvi

```bash
# Backend
curl -I http://localhost:8000/api/auth/profile/

# Frontend
curl -I http://localhost:3000/
```

## CI/CD Integratsiyasi

GitHub Actions, GitLab CI yoki shunga o'xshash dan foydalaning:
1. Push-da testlarni ishga tushiring
2. Docker rasimlarini qurilish
3. Registrga push qilish
4. Ishlab chiqarishga joylashtirish

Misol GitHub Actions iş oqimi qo'shilishi mumkin.
