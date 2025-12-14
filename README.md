# EduLearn - Ta'lim Platformasi

A modern online education platform with secure user authentication and Google OAuth integration.

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React OAuth Google** - Google authentication

### Backend
- **Django 5.2** - Python web framework
- **Django REST Framework** - RESTful API
- **SQLite** - Database (development)
- **Token Authentication** - Secure API endpoints

## Features Implemented

### Authentication
- ✅ User registration with validation
- ✅ User login with secure tokens
- ✅ Google OAuth 2.0 integration
- ✅ Password strength validation (8+ chars, uppercase, lowercase, number, special char)
- ✅ School name tracking during registration
- ✅ Token-based API authentication

### User Management
- ✅ Custom user model with school information
- ✅ User profile endpoint
- ✅ Logout functionality
- ✅ Admin panel for user management

### Security
- ✅ CORS protection
- ✅ Token-based authentication
- ✅ Password hashing
- ✅ Input validation

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Google OAuth Client ID (for Google login)

### Backend Setup

```bash
cd edu_game
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

### Frontend Setup

```bash
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### Backend (edu_game/.env)
```
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

## API Documentation

See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for detailed API endpoints and testing instructions.

## Project Structure

```
Education/
├── app/                           # Next.js app directory
│   ├── login/                     # Login page
│   ├── register/                  # Register page
│   ├── layout.tsx                 # Root layout with Google OAuth
│   └── ...
├── components/                    # React components
├── lib/                           # Utilities
│   └── api.ts                     # API client functions
├── edu_game/                      # Django project
│   ├── users/                     # Users app
│   │   ├── models.py              # CustomUser model
│   │   ├── views.py               # API views
│   │   ├── serializers.py         # DRF serializers
│   │   ├── urls.py                # App URLs
│   │   ├── admin.py               # Admin configuration
│   │   └── signals.py             # Token creation signal
│   ├── edu_game/                  # Project settings
│   │   ├── settings.py            # Django settings
│   │   └── urls.py                # Project URLs
│   └── manage.py
├── SETUP_INSTRUCTIONS.md          # Detailed setup guide
└── README.md
```

## Key Changes Made

1. **Django Backend**
   - Created `CustomUser` model extending Django's AbstractUser with `school_name`
   - Implemented REST API endpoints for registration, login, and Google OAuth
   - Added CORS headers for frontend communication
   - Configured token-based authentication

2. **Frontend Integration**
   - Updated Login/Register pages to use API endpoints
   - Implemented Google OAuth using `@react-oauth/google`
   - Added proper error handling and validation
   - Store authentication tokens in localStorage

3. **API Client**
   - Created `lib/api.ts` with functions for all auth operations
   - Support for traditional and Google OAuth flows
   - Token management utilities

## Database Schema

### CustomUser
- Extends Django's AbstractUser
- `school_name` - CharField, required
- `created_at` - DateTime (auto)
- `updated_at` - DateTime (auto)

## Next Steps

1. Configure Google OAuth credentials
2. Deploy to production
3. Add password reset functionality
4. Implement email verification
5. Add two-factor authentication

## Troubleshooting

### CORS Errors
Ensure Django settings include your frontend URL in `CORS_ALLOWED_ORIGINS`

### Database Errors
```bash
cd edu_game
python manage.py makemigrations users
python manage.py migrate
```

### Google OAuth Not Working
- Verify Google Client ID in `.env.local`
- Check redirect URIs in Google Cloud Console
- Clear browser cache and try again

## Support

For detailed setup instructions, see [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)

## License

MIT
