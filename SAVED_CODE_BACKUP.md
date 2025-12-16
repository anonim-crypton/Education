# Saqlanmagan Kodlar Backup

## Dashboard Qismi
`app/dashboard/page.tsx`

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

## Account Settings Qismi
`app/account-settings/page.tsx`

```typescript
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getAccessToken, clearTokens } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Upload, X, ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function AccountSettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldSuccess, setFieldSuccess] = useState<{ [key: string]: string }>(
    {}
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState<any>({
    username: "",
    school_name: "",
    email: "",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Fetch user profile
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }

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
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data && data.user) {
          setUserData(data.user);
          setFormData({
            username: data.user.username || "",
            school_name: data.user.school_name || "",
            email: data.user.email || "",
          });
          if (data.user.avatar_url) {
            setAvatarPreview(data.user.avatar_url);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = async () => {
    const token = getAccessToken();
    if (!token) return;

    if (!confirm("Avatar rasmini o'chirib tashlay?")) return;

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/users/profile/avatar/delete/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (response.ok) {
        setAvatarPreview(null);
        setAvatarFile(null);
        setFieldSuccess({ avatar: "Avatar o'chirildi" });
        setTimeout(() => setFieldSuccess({}), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async () => {
    const token = getAccessToken();
    if (!token) return;

    setIsUpdating(true);
    try {
      const formDataToSend = new FormData();

      if (formData.username !== userData.username) {
        formDataToSend.append("username", formData.username);
      }

      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile);
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/users/profile/`,
        {
          method: "PUT",
          headers: { Authorization: `Token ${token}` },
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUserData(data.user);
        if (data.user.avatar_url) {
          setAvatarPreview(data.user.avatar_url);
        }
        setFormData({
          username: data.user.username,
          school_name: data.user.school_name,
          email: data.user.email,
        });
        setAvatarFile(null);
        setFieldSuccess({ profile: "Profil yangilandi" });
        setTimeout(() => setFieldSuccess({}), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    clearTokens();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="inline-block w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-lg mx-auto px-4 pt-20 pb-10">
        {/* Back Button */}
        <motion.button
          onClick={() => router.push("/dashboard")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all text-sm font-medium mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Orqaga
        </motion.button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Hisobni sozlash
          </h1>
        </div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-4 mb-4"
        >
          {/* Avatar Section */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
            <div className="relative flex-shrink-0">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                  {userData?.first_name
                    ? userData.first_name.charAt(0).toUpperCase()
                    : userData?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1 rounded-full bg-primary hover:bg-primary/90 text-white transition-colors"
                title="Rasm yuklash"
              >
                <Upload className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {userData?.first_name || userData?.username}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                @{userData?.username}
              </p>
              {avatarPreview && (
                <button
                  onClick={handleDeleteAvatar}
                  className="text-xs text-red-400 hover:text-red-300 mt-0.5 transition-colors"
                >
                  O'chirish
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {fieldSuccess.avatar && (
            <p className="text-xs text-green-400 mb-3">{fieldSuccess.avatar}</p>
          )}

          {/* Username */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-foreground mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm rounded-lg bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="Username"
            />
            {fieldSuccess.username && (
              <p className="text-xs text-green-400 mt-1">
                {fieldSuccess.username}
              </p>
            )}
          </div>

          {/* School Name - Read Only */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-foreground mb-1">
              Maktab nomi
            </label>
            <input
              type="text"
              value={formData.school_name}
              disabled
              className="w-full px-3 py-2 text-sm rounded-lg bg-secondary border border-border text-foreground opacity-50 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-0.5">
              O'zgartirib bo'lmaydi
            </p>
          </div>

          {/* Email - Read Only */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-3 py-2 text-sm rounded-lg bg-secondary border border-border text-foreground opacity-50 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-0.5">
              O'zgartirib bo'lmaydi
            </p>
          </div>

          {fieldSuccess.profile && (
            <p className="text-xs text-green-400 mb-3">
              {fieldSuccess.profile}
            </p>
          )}

          {/* Save Button */}
          <motion.button
            onClick={handleSaveProfile}
            disabled={isUpdating}
            className="w-full px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Saqlanmoqda..." : "Saqlash"}
          </motion.button>
        </motion.div>

        {/* Logout Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <h2 className="text-sm font-semibold text-foreground mb-2">
            Chiqish
          </h2>
          <p className="text-xs text-muted-foreground mb-3">
            Barcha aktiv sessiyalar tugatiladi
          </p>
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            Hisobdan chiqish
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
```

---

## Contact Page (asosiy)
`app/contact/page.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Shield, AlertTriangle, Wrench, MessageSquare, ChevronDown, Flag, TrendingDown, TrendingUp, Zap, AlertCircle } from "lucide-react";

// Social Icons - Icons8 style
const TelegramIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.02-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.02-.14-.07-.2-.09-.06-.22-.04-.31-.02-.13.02-2.28 1.45-6.45 4.27-.61.41-1.16.61-1.66.6-.55-.01-1.6-.31-2.38-.57-.96-.3-1.72-.46-1.65-.97.03-.25.31-.5.86-.76 3.37-1.48 5.61-2.46 6.74-2.95 3.21-1.42 3.88-1.67 4.32-1.68.09 0 .3.02.44.12.12.09.15.21.17.32-.01.06.01.24 0 .44z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface Particle {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

const reportTypes = [
  { value: "", label: "Ariza turini tanlang", icon: Flag },
  { value: "xavfsizlik", label: "Xavfsizlik masalasi", icon: Shield },
  { value: "spam", label: "Spam yoki noto'g'ri foydalanuvchi", icon: AlertTriangle },
  { value: "noqulaylik", label: "Texnik noqulaylik", icon: Wrench },
  { value: "boshqa", label: "Boshqa", icon: MessageSquare },
];

const priorityLevels = [
  { value: "", label: "Arizaning darajasi", icon: Flag },
  { value: "past", label: "Past", icon: TrendingDown },
  { value: "o'rta", label: "O'rta", icon: Flag },
  { value: "yuqori", label: "Yuqori", icon: TrendingUp },
  { value: "favqulodda", label: "Favqulodda", icon: Zap },
];

const CustomSelect = ({ options, value, onChange, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt: any) => opt.value === value);
  const IconComponent = selectedOption?.icon;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground font-medium cursor-pointer text-left flex items-center justify-between hover:border-orange-600 transition-all duration-200"
      >
        <span className="flex items-center gap-2">
          {IconComponent && <IconComponent className="w-5 h-5" />}
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl z-10"
        >
          {options.map((option: any) => {
            const OptionIcon = option.icon;
            return (
              <motion.button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg text-foreground font-medium"
                whileHover={{ x: 4 }}
              >
                {OptionIcon && <OptionIcon className="w-5 h-5 text-orange-600" />}
                <span>{option.label}</span>
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [reportType, setReportType] = useState("");
  const [priority, setPriority] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const generatedParticles: Particle[] = [...Array(8)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 4 + Math.random() * 2,
      delay: Math.random() * 1,
    }));
    setParticles(generatedParticles);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      console.log("Contact Form:", formData);
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setIsLoading(false);
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 1000);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-primary/5 to-slate-950"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 25, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-accent/20 to-primary/10 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -25, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Biz bilan <span className="text-primary">bog'lanish</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Savollaringiz, taklif va shikoyatlaringiz uchun biz shu yerda turibmiz.
            Qanday vaqtda bo'lmasin, biz sizga javob berishga tayyorman.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-card rounded-2xl p-8 border border-border shadow-xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Xabar yuboring
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    To'liq ismingiz
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ismingizni kiriting"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Telefon raqami
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+998 99 123 45 67"
                    className="w-full px-3.5 py-2.5 rounded-xl text-base bg-secondary border-2 border-border focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mavzu
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Xabaringizning mavzusi"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Xabar
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="O'z xabaringizni yozing..."
                    rows={5}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors text-foreground placeholder:text-muted-foreground resize-none"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Xabar yuboring
                    </>
                  )}
                </motion.button>

                {/* Success Message */}
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm text-center"
                  >
                    ✓ Xabaringiz muvaffaqiyatli yuborildi!
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* About */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Edugame haqida
              </h2>
              <p className="text-muted-foreground mb-4">
                Edugame - bu ta'lim sohasida yangi avlodning platformasi bo'lib,
                modern ta'lim usullari va professional o'qituvchilar orqali
                o'quvchilarni yangi bilimlar bilan ta'minlaydi.
              </p>
              <p className="text-muted-foreground">
                Biz har bir o'quvchining muvaffaqiyatiga ishonadi va ularni
                o'z sohasida mutaxassisga aylantirish uchun to'liq qo'llab
                quvvatlashga tayyorman.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <motion.div
                whileHover={{ x: 5 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-xl flex items-start gap-4"
              >
                <Mail className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <p className="text-muted-foreground">info@edugame.uz</p>
                  <p className="text-muted-foreground">support@edugame.uz</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-xl flex items-start gap-4"
              >
                <Phone className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Telefon</h3>
                  <p className="text-muted-foreground">+998 99 123 45 67</p>
                  <p className="text-muted-foreground">+998 97 234 56 78</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-xl flex items-start gap-4"
              >
                <MapPin className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Lokatsiya
                  </h3>
                  <p className="text-muted-foreground">
                    Tashkent, O'zbekiston
                  </p>
                  <p className="text-muted-foreground">
                    Muhammad Qo'qon ko'chasi, 1-uy
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Social Networks */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-xl">
              <h3 className="font-semibold text-foreground mb-4">
                Ijtimoiy tarmoqlar
              </h3>
              <div className="flex gap-4">
                <motion.a
                  href="https://t.me/edugame"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-500 transition-colors duration-300"
                  title="Telegram"
                >
                  <TelegramIcon />
                </motion.a>

                <motion.a
                  href="https://instagram.com/edugame"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-pink-500 transition-colors duration-300"
                  title="Instagram"
                >
                  <InstagramIcon />
                </motion.a>

                <motion.a
                  href="https://facebook.com/edugame"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-600 transition-colors duration-300"
                  title="Facebook"
                >
                  <FacebookIcon />
                </motion.a>

                <motion.a
                  href="https://youtube.com/@edugame"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-red-500 transition-colors duration-300"
                  title="YouTube"
                >
                  <YoutubeIcon />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Security & Access Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Website Security */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 border border-border shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-xl font-bold text-foreground">Veb saytning xavsizligi</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Veb saytimiz yuqori darajadagi xavsizlik standartlariga muvofiq. Foydalanuvchilar ma'lumotlari maxfiy shufrlanadi va himoyalangan serverlarida saqlanadi.
            </p>
          </motion.div>

          {/* Who Can Use */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 border border-border shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <h3 className="text-xl font-bold text-foreground">Foydalanuvchilar</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Veb saytda o'qituvchi va o'quvchilar ro'yxatdan o'tishi mumkin. O'qituvchilar uchun qo'shimcha funktsiyalar mavjud. Barcha foydalanuvchilar shartlar va qoidalarni tan olishlari kerak.
            </p>
          </motion.div>
        </motion.div>

        {/* Data Protection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 bg-card rounded-2xl p-8 sm:p-12 border border-border shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-foreground">Foydalanuvchi ma'lumotlarining xafsizligi va himoyasi</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Ma'lumotlar shufrlanishi</h4>
              <p className="text-sm text-muted-foreground">Barcha shaxsiy ma'lumotlar SSL/TLS texnologiyasi orqali shifrlangan holda uzatiladi va saqlanadi.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Maxfiylik siyosati</h4>
              <p className="text-sm text-muted-foreground">Sizning ma'lumotlaringiz uchinchi tomonlar bilan o'zingizning roziligi siz bo'lganda ulashiladi.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Kirish huquqlari</h4>
              <p className="text-sm text-muted-foreground">Siz istalgan vaqtda o'zingizning ma'lumotlaringizni ko'rishingiz, tahrirlashingiz yoki o'chirishingiz mumkin.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Foydalanuvchi o'rnatmalari</h4>
              <p className="text-sm text-muted-foreground">Profildan ma'lumotlar qabul qilish parametrlarini sozlashingiz mumkin.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

---

## Django Admin Panel
`edu_game/users/admin.py`

```python
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser


def delete_users(modeladmin, request, queryset):
    """Delete selected users action"""
    count = queryset.count()
    queryset.delete()
    modeladmin.message_user(request, f"{count}ta foydalanuvchi o'chirildi.")


delete_users.short_description = _("Tanlangan foydalanuvchilarni o'chirish")


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    """Admin interface for CustomUser model"""
    fieldsets = BaseUserAdmin.fieldsets + (
        ('School Information', {
            'fields': ('school_name',)
        }),
        ('Profile', {
            'fields': ('avatar', 'is_google_user'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    list_display = ['username', 'email', 'school_name', 'first_name', 'last_name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at', 'school_name', 'is_google_user']
    search_fields = ['username', 'email', 'school_name', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    readonly_fields = ['created_at', 'updated_at']
    actions = [delete_users]
```

---

## Hullas

Hammasi kodlar yuqorida saqlandi:
1. **Dashboard** - Foydalanuvchi uchun asosiy sahifa
2. **Account Settings** - Profilni tahrirlash
3. **Contact Page** - Biz bilan bog'lanish
4. **Django Admin** - Admin paneli

Barcha fayllarni shu asosida qayta yozish va saqlashingiz mumkin.
