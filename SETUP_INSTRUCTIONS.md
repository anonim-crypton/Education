# Setup Instructions - Django & Next.js Authentication

## Backend Setup (Django)

### 1. Install Dependencies

```bash
cd edu_game
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in `edu_game/` directory:

```
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 3. Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Superuser

```bash
python manage.py createsuperuser
```

### 5. Run Development Server

```bash
python manage.py runserver
```

The server will run at `http://localhost:8000`

## Frontend Setup (Next.js)

### 1. Environment Variables

Create `.env.local` in the project root:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The frontend will run at `http://localhost:3000`

## Google OAuth Setup

### 1. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000`
   - `http://localhost:3000/login`
   - `http://localhost:3000/register`

### 2. Add Credentials to Frontend

Add your Google Client ID to `.env.local`:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here
```

## API Endpoints

### Authentication

- **POST** `/api/auth/register/` - User registration
  - Body: `{username, email, password, password_confirm, school_name}`
  - Returns: `{success, message, user, access, refresh}`

- **POST** `/api/auth/login/` - User login
  - Body: `{username, password}`
  - Returns: `{success, message, user, access, refresh}`

- **POST** `/api/auth/google/` - Google OAuth
  - Body: `{token, school_name}`
  - Returns: `{success, message, user, access, refresh}`

- **GET** `/api/auth/profile/` - Get current user (requires token)
  - Header: `Authorization: Token <access_token>`
  - Returns: `{success, user}`

- **POST** `/api/auth/logout/` - Logout (requires token)
  - Header: `Authorization: Token <access_token>`
  - Returns: `{success, message}`

## Database Schema

### CustomUser Model

```python
- id: AutoField (Primary Key)
- username: CharField (unique)
- email: EmailField (unique)
- first_name: CharField
- last_name: CharField
- password: CharField (hashed)
- school_name: CharField (required)
- is_active: BooleanField (default=True)
- created_at: DateTimeField (auto_now_add=True)
- updated_at: DateTimeField (auto_now=True)
```

## Features Implemented

✅ User Registration with validation
✅ User Login with token-based authentication
✅ Password validation (min 8 chars, uppercase, lowercase, number, special char)
✅ Google OAuth Login
✅ Google OAuth Registration
✅ School name tracking
✅ CORS enabled for frontend-backend communication
✅ Admin panel for user management
✅ Token-based authentication
✅ Profile endpoint

## Testing

### Register a User

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "password_confirm": "TestPass123!",
    "school_name": "Test School"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123!"
  }'
```

### Get Profile (with token)

```bash
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

## Troubleshooting

### CORS Errors

Make sure:
- `CORS_ALLOWED_ORIGINS` includes your frontend URL in Django settings
- Frontend is running on allowed port (3000 or 3001)

### Database Errors

Run migrations:
```bash
python manage.py makemigrations users
python manage.py migrate
```

### Google OAuth Issues

- Verify Google Client ID is correct
- Check redirect URIs in Google Cloud Console
- Ensure `.env.local` has correct `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

## Next Steps

1. Implement password reset functionality
2. Add email verification
3. Implement refresh token rotation
4. Add user profile editing
5. Add role-based access control
6. Implement two-factor authentication
