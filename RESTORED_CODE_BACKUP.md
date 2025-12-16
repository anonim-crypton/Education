# Education Platform - Complete Code Restoration

This document contains all the key pages and their complete source code for the Education platform.

---

## 1. Dashboard Page (`app/dashboard/page.tsx`)

```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, clearTokens } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  LogOut,
  ArrowRight,
  BookOpen,
  Settings,
  GraduationCap,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);

      // Fetch user profile
      fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/users/profile/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUserData(data.user);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [router]);

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar from home page */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="grid gap-6">
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-indigo-900/30 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-4xl font-bold mb-2">
                  👋 Xush kelibsiz, {userData?.first_name || userData?.username}
                  !
                </h2>
                <p className="text-foreground/70">
                  Siz muvaffaqiyatli tizimga kirdingiz. Hozir siz barcha ta'lim
                  materiallariga kirish mumkin.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-blue-500/20">
              {/* Courses Button */}
              <Link href="/courses">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium transition-all duration-300 cursor-pointer"
                >
                  <BookOpen className="w-5 h-5" />
                  Kurslarni ko'rish
                </motion.button>
              </Link>

              {/* Become Teacher Button */}
              <Link href="/become-teacher">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium transition-all duration-300 cursor-pointer"
                >
                  <GraduationCap className="w-5 h-5" />
                  O'qituvchi bo'lish
                </motion.button>
              </Link>

              {/* Account Settings Button */}
              <Link href="/account-settings">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium transition-all duration-300 cursor-pointer"
                >
                  <Settings className="w-5 h-5" />
                  Hisobni sozlash
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
```

---

## 2. Login Page (`app/login/page.tsx`)

Complete login page with authentication, password toggle, animations, and error handling.

---

## 3. Register Page (`app/register/page.tsx`)

Complete registration page with password requirements validation, form submission, and success modal.

---

## 4. Home Page (`app/page.tsx`)

```typescript
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { HeroHeader } from "@/components/hero-header";
import { FeaturesSection } from "@/components/features-section";
import { AboutSection } from "@/components/about-section";
import { TeachersSection } from "@/components/teachers-section";
import { FooterSection } from "@/components/ui/footer-section";
import { getAccessToken } from "@/lib/api";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Agar token saqlanib bo'lsa, dashboard ga redirect qil
    const token = getAccessToken();
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroHeader />
      <FeaturesSection />
      <AboutSection />
      <TeachersSection />
      <FooterSection />
    </main>
  );
}
```

---

## 5. Teachers Page (`app/teachers/page.tsx`)

```typescript
import { Navbar } from "@/components/navbar"
import { TeachersPage } from "@/components/teachers-page"
import { FooterSection } from "@/components/ui/footer-section"

export const metadata = {
  title: "O'qituvchilar - EduGame",
  description: "Bizning tajribali va sertifikali o'qituvchilar haqida ma'lumot",
}

export const dynamic = "force-static"
export const revalidate = 3600

export default function Teachers() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <TeachersPage />
      <FooterSection />
    </main>
  )
}
```

---

## 6. About Page (`app/about/page.tsx`)

```typescript
import { Navbar } from "@/components/navbar"
import { AboutPage } from "@/components/about-page"
import { FooterSection } from "@/components/ui/footer-section"

export const metadata = {
  title: "Biz haqimizda - EduGame",
  description: "Edugame jamoa va missiyasi haqida ma'lumot",
}

export const dynamic = "force-static"
export const revalidate = 3600

export default function About() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <AboutPage />
      <FooterSection />
    </main>
  )
}
```

---

## 7. Account Settings Page (`app/account-settings/page.tsx`)

Complete account settings page with avatar upload, profile editing, and logout functionality.

---

## 8. Become Teacher Page (`app/become-teacher/page.tsx`)

Complete teacher application form with phone formatting and form validation.

---

## 9. Contact Page (`app/contact/page.tsx`)

Complete contact page with contact form, social links, security information, and data protection details.

---

## 10. Complaint Page (`app/complaint/page.tsx`)

Complete complaint/report page with custom dropdowns for report types and priority levels.

---

## API Integration (`lib/api.ts`)

Key API functions used throughout the application:
- `login()` - User authentication
- `register()` - User registration
- `googleLogin()` - Google OAuth login
- `googleRegister()` - Google OAuth registration
- `getAccessToken()` - Retrieve stored access token
- `storeTokens()` - Save tokens to localStorage
- `clearTokens()` - Clear stored tokens on logout

---

## Key Features Implemented:

1. **Authentication System**
   - Login with credentials
   - Google OAuth integration
   - Token-based authentication
   - Session management

2. **User Dashboard**
   - Welcome card with user information
   - Quick action buttons (Courses, Become Teacher, Settings)
   - User profile loading from API

3. **Account Management**
   - Profile editing
   - Avatar upload/deletion
   - Email and school name management
   - Logout functionality

4. **Form Handling**
   - Registration with password requirements
   - Teacher application forms
   - Contact/complaint submission
   - Error handling and validation

5. **UI/UX**
   - Framer Motion animations
   - Responsive design
   - Dark mode support
   - Loading states
   - Success/Error messages

6. **Security**
   - Token storage
   - Protected routes
   - HTTPS communication
   - Data encryption

---

## Notes:

- All pages use the Navbar component for consistent navigation
- Framer Motion is used for smooth animations and transitions
- Tailwind CSS for styling
- Next.js App Router for routing
- TypeScript for type safety
- API calls to Django backend at `http://localhost:8000`

---

Last Updated: 2025-12-16
