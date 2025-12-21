# O'qituvchi Tizimining Arxitekturasi

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     ADMIN PANEL (Bosh Admin)                     │
└─────────────────────────────────────────────────────────────────┘
              │
              ├─► /dashboard/ - Dashboardga qaytish
              ├─► /create-teacher/ - O'qituvchi yaratish
              │       ├─ Avatar yuklash (ixtiyoriy)
              │       ├─ To'liq ism (ixtiyoriy)
              │       ├─ Username (majburiy)
              │       ├─ Parol (majburiy)
              │       └─ Fan (ixtiyoriy) - Custom dropdown
              │
              └─► /approved_teachers/ - Tasdiqlangan o'qituvchilar
                      └─ Yangi o'qituvchilar avtomatik ko'rinadi

┌─────────────────────────────────────────────────────────────────┐
│                  DATABASE (Django Models)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User Model (Django Built-in)                                    │
│  ├─ id                                                            │
│  ├─ username (Unique)                                            │
│  ├─ password (Hashed)                                            │
│  ├─ first_name                                                   │
│  ├─ last_name                                                    │
│  ├─ email                                                        │
│  ├─ avatar (File Field - Optional)                              │
│  └─ date_joined                                                  │
│                                                                   │
│  Teacher Model                                                   │
│  ├─ id                                                            │
│  ├─ user (FK to User)                                            │
│  ├─ subject (CharField)                                          │
│  ├─ bio (TextField - Optional)                                   │
│  └─ experience_years                                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                 FRONTEND - TEACHER PANEL                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  /teachers/login/                                                │
│  ├─ Username input                                               │
│  └─ Password input                                               │
│        │                                                          │
│        └─► Successful Login                                      │
│                │                                                  │
│                └─► /teachers/dashboard/ (Teacher Dashboard)      │
│                                                                   │
│  /teachers/list/                                                 │
│  ├─ Barcha o'qituvchilarni ko'rish                               │
│  ├─ Grid layout (4 columns)                                      │
│  └─ Har bir o'qituvchining:                                      │
│      ├─ Avatar rasm                                              │
│      ├─ To'liq ismi                                              │
│      ├─ Username                                                 │
│      ├─ Fan                                                      │
│      ├─ Email                                                    │
│      ├─ Bio                                                      │
│      ├─ Ro'yhat sanasi                                           │
│      └─ Status                                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              TEACHER CREATION WORKFLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Admin /create-teacher/ saxifasiga kirakdi                    │
│       │                                                          │
│       ├─► Avatar rasmni yuklaykdi (optional)                     │
│       ├─► To'liq ismini kiritadi (optional)                      │
│       ├─► Username kiritadi (required)                           │
│       ├─► Parolni kiritadi (required)                            │
│       ├─► Fan tanlaydi (optional)                                │
│       │                                                          │
│       └─► "Saqlash" tugmasini bosadi                             │
│            │                                                     │
│            └─► Backend Processing                               │
│                 ├─ Username tekshiriladi                        │
│                 ├─ User yaratiladi                              │
│                 ├─ Avatar saqlanadi (agar mavjud)               │
│                 ├─ Teacher profili yaratiladi                   │
│                 └─ Success message                              │
│                    │                                            │
│                    └─► Admin Dashboard-ga qaytish               │
│                         │                                       │
│                         └─► Yangi o'qituvchi                    │
│                             "Tasdiqlangan O'qituvchilar"       │
│                             qismida ko'rinadi                   │
│                                                                   │
│  2. O'qituvchi /teachers/login/ saxifasiga kirakdi               │
│       │                                                          │
│       ├─► Username kiritadi (admin berilgan)                    │
│       ├─► Parolni kiritadi (admin berilgan)                     │
│       │                                                          │
│       └─► "Login" tugmasini bosadi                               │
│            │                                                     │
│            └─► Authentication                                   │
│                 ├─ User topiladi                                │
│                 ├─ Parol tekshiriladi                           │
│                 ├─ Teacher profili tekshiriladi                 │
│                 └─ Session yaratiladi                           │
│                    │                                            │
│                    └─► /teachers/dashboard/                     │
│                         (O'qituvchi paneli)                      │
│                                                                   │
│  3. Barcha o'qituvchilarni ko'rish /teachers/list/               │
│       │                                                          │
│       └─► Database dan barcha Teacher'larni olish                │
│            │                                                     │
│            └─► Grid layout bilan ko'rish                         │
│                ├─ 4 columns responsive                           │
│                ├─ Dark mode support                              │
│                └─ Professional design                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

SUBJECTLAR VA IKONKALARI:
├─ Matematika    → 📘 Blue Book
├─ Fizika        → 🔬 Purple Atoms
├─ Kimya         → 🧪 Green Chemistry
├─ Biologiya     → 🧬 Red Biology
├─ Ingliz tili   → 🌍 Indigo Globe
├─ Rus tili      → 🇷🇺 Cyan Grid
├─ Uz tili       → 📝 Yellow Document
├─ Tarix         → ⏰ Amber Clock
├─ Geografiya    → 🗺️ Teal Map
├─ Informatika   → 💻 Orange Monitor
└─ Umum          → 🌐 Gray Globe

DARK MODE SUPPORT:
✓ Avatar upload interface
✓ Subject dropdown
✓ All buttons and inputs
✓ Teachers list grid
✓ Teacher cards
✓ All text colors
✓ All SVG icons

RESPONSIVE DESIGN:
✓ Mobile (1 column)
✓ Tablet (2 columns)
✓ Desktop (3-4 columns)
✓ Large screens (4 columns)

FEATURES:
✓ Avatar drag-drop upload
✓ Image preview with remove button
✓ Custom styled dropdown
✓ SVG icons for subjects
✓ Form validation
✓ Error handling
✓ Success messages
✓ Admin integration
✓ Teacher login
✓ Teachers list view
✓ Dark mode
✓ Responsive design
```

## URLs va Routes

```
ADMIN DASHBOARD:
- /admin/dashboard/                 (Main dashboard)
- /admin/dashboard/create-teacher/  (Teacher creation)
- /admin/dashboard/approved-teachers/ (Approved teachers list)

TEACHER PANEL:
- /teachers/login/                  (Login page)
- /teachers/dashboard/              (Teacher dashboard)
- /teachers/logout/                 (Logout)
- /teachers/list/                   (All teachers public view)

API ENDPOINTS:
- /api/teachers/requests/           (Teacher requests)
- /api/teachers/                    (Teachers list)
```

## Form Validation

### Frontend:
- Avatar file size (max 5MB)
- Image format validation (PNG, JPG, etc.)
- Required fields checking
- Username format

### Backend:
- Username uniqueness
- Password requirement
- User creation transaction
- Avatar file handling
- Teacher profile creation

## Security Features:
✓ CSRF protection (Django CSRF tokens)
✓ Password hashing (Django password hasher)
✓ User authentication (Django auth)
✓ Login required decorators
✓ Admin user checks
✓ Staff/Superuser checks
✓ Transaction safety
✓ File upload validation
✓ Input sanitization

## Performance Optimizations:
✓ select_related() for database queries
✓ Lazy loading for images
✓ CSS minification (Tailwind)
✓ SVG icons (lightweight)
✓ Efficient database queries
✓ Proper indexing (Django default)

## Browser Compatibility:
✓ Modern browsers (Chrome, Firefox, Safari, Edge)
✓ Mobile browsers
✓ Dark mode support
✓ CSS Grid support
✓ Flexbox support
✓ Drag-drop API support
✓ FileReader API support
