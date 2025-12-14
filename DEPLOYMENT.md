# Deployment Guide

## Production Deployment

### Prerequisites
- Docker and Docker Compose installed
- Google OAuth credentials configured
- Environment variables set up

### 1. Build and Run with Docker

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database (port 5432)
- Django backend (port 8000)
- Next.js frontend (port 3000)

### 2. Manual Deployment (Without Docker)

#### Backend Deployment (Django)

```bash
cd edu_game

# Install dependencies
pip install -r requirements.txt

# Create environment variables file
cp .env.example .env

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Create superuser
python manage.py createsuperuser

# Run with production server (e.g., gunicorn)
gunicorn edu_game.wsgi:application --bind 0.0.0.0:8000
```

#### Frontend Deployment (Next.js)

```bash
# Install dependencies
npm install

# Create environment variables
cp .env.local.example .env.local

# Build for production
npm run build

# Start production server
npm start
```

### 3. Environment Variables for Production

#### Django (.env)
```
DEBUG=False
SECRET_KEY=your-very-secure-secret-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@hostname:5432/dbname
GOOGLE_OAUTH_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-google-client-secret
```

#### Next.js (.env.local)
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### 4. SSL/HTTPS Configuration

#### Using Nginx with Let's Encrypt

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

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

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 5. Database Backup

```bash
# Backup PostgreSQL
pg_dump -U edugame -h localhost edugame > backup.sql

# Restore from backup
psql -U edugame -h localhost edugame < backup.sql
```

### 6. Monitoring and Logging

Set up logging for:
- Django: Use `logging` configuration in settings.py
- Frontend: Use application monitoring service
- System: Use systemd journal or log aggregation

### 7. Scaling Considerations

For high-traffic scenarios:
- Use Gunicorn with multiple workers
- Implement Celery for async tasks
- Use Redis for caching and sessions
- Use CDN for static assets
- Database read replicas

## Troubleshooting

### 502 Bad Gateway
- Check if backend server is running
- Verify proxy configuration in Nginx
- Check logs: `docker logs backend`

### CORS Errors
- Verify `CORS_ALLOWED_ORIGINS` includes frontend domain
- Check if API URL is correct in frontend

### Database Connection Errors
- Verify DATABASE_URL format
- Check database credentials
- Ensure database is running and accessible

## Security Checklist

- [ ] DEBUG = False in production
- [ ] SECRET_KEY is strong and unique
- [ ] ALLOWED_HOSTS configured correctly
- [ ] HTTPS/SSL enabled
- [ ] CORS_ALLOWED_ORIGINS restricted to frontend domain
- [ ] Database backups enabled
- [ ] Regular security updates
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] Error messages don't leak sensitive info

## Health Checks

```bash
# Backend
curl -I http://localhost:8000/api/auth/profile/

# Frontend
curl -I http://localhost:3000/
```

## CI/CD Integration

Use GitHub Actions, GitLab CI, or similar:
1. Run tests on push
2. Build Docker images
3. Push to registry
4. Deploy to production

Example GitHub Actions workflow can be added.
