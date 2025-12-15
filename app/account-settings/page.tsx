"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getAccessToken, clearTokens } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, ArrowLeft, Upload, X } from "lucide-react";

export default function AccountSettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/profile/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(res => {
      if (!res.ok) return null;
      return res.json();
    })
    .then(data => {
      if (data && data.user) {
        setUserData(data.user);
        setFormData({
          username: data.user.username || "",
          school_name: data.user.school_name || "",
          email: data.user.email || "",
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
        // Set avatar preview
        if (data.user.avatar_url) {
          setAvatarPreview(data.user.avatar_url);
        }
      }
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => setIsLoading(false));
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Preview
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

    if (!confirm("Avatar rasmini o'chirib tashlay?")) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/profile/avatar/delete/`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Token ${token}`
          }
        }
      );

      if (response.ok) {
        setAvatarPreview(null);
        setAvatarFile(null);
        setUserData({
          ...userData,
          avatar: null,
          avatar_url: null,
        });
        setSuccessMessage("Avatar muvaffaqiyatli o'chirildi");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError("Avatar o'chirishda xato yuz berdi");
      }
    } catch (err) {
      setError("Xato yuz berdi");
      console.error(err);
    }
  };

  const handleSaveProfile = async () => {
    const token = getAccessToken();
    if (!token) return;

    setIsUpdating(true);
    try {
      const formDataToSend = new FormData();
      
      // Faqat o'zgargan fieldlarni qo'shish
      if (formData.username !== userData.username) {
        formDataToSend.append('username', formData.username);
      }
      
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/profile/`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Token ${token}`
          },
          body: formDataToSend
        }
      );

      const data = await response.json();

      if (response.ok) {
        setError("");
        setSuccessMessage("Profil muvaffaqiyatli yangilandi");
        setUserData(data.user);
        // Avatar URL ni yangilash
        if (data.user.avatar_url) {
          setAvatarPreview(data.user.avatar_url);
        }
        setFormData({
          username: data.user.username,
          school_name: data.user.school_name,
          email: data.user.email,
        });
        setAvatarFile(null);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        // Handle validation errors
        if (data.errors) {
          const errorMessages = Object.entries(data.errors)
            .map(([field, msgs]) => {
              if (Array.isArray(msgs)) {
                return msgs.join(", ");
              }
              return msgs;
            })
            .join("; ");
          setError(errorMessages);
        } else {
          setError("Profil yangilashda xato yuz berdi");
        }
      }
    } catch (err) {
      setError("Xato yuz berdi");
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
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Yuklanyapti...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Back Button */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.button
          onClick={() => router.back()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Orqaga
        </motion.button>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Hisobni sozlash</h1>
          <p className="text-muted-foreground">Shaxsiy ma'lumotlaringizni boshqaring</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400">
            {successMessage}
          </div>
        )}

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-xl border border-border p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-foreground mb-6">Shaxsiy Ma'lumotlar</h2>

          <div className="space-y-4">
            {/* Avatar Section */}
            <div className="flex items-center gap-4 pb-6 border-b border-border">
              <div className="relative">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold">
                    {userData?.first_name ? userData.first_name.charAt(0).toUpperCase() : userData?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary hover:bg-primary/90 text-white transition-colors"
                  title="Rasm yuklash"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {userData?.first_name || userData?.username}
                </p>
                <p className="text-sm text-muted-foreground">
                  @{userData?.username}
                </p>
                {avatarPreview && (
                  <button
                    onClick={handleDeleteAvatar}
                    className="text-xs text-red-400 hover:text-red-300 mt-1 transition-colors"
                  >
                    Rasmni o'chirish
                  </button>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Username"
              />
            </div>

            {/* School Name - Read Only */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Maktab nomi
              </label>
              <input
                type="text"
                name="school_name"
                value={formData.school_name}
                disabled
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none opacity-50 cursor-not-allowed"
                placeholder="Maktab nomi"
              />
              <p className="text-xs text-muted-foreground mt-1">Maktab nomini o'zgartirib bo'lmaydi</p>
            </div>

            {/* Email - Read Only */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none opacity-50 cursor-not-allowed"
                placeholder="Email@example.com"
              />
              <p className="text-xs text-muted-foreground mt-1">Email ni o'zgartirib bo'lmaydi</p>
            </div>



            {/* Save Button */}
            <motion.button
              onClick={handleSaveProfile}
              disabled={isUpdating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
            </motion.button>
          </div>
        </motion.div>

        {/* Logout Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h2 className="text-xl font-semibold text-foreground mb-4">Xavfsizlik</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Akkauntdan chiqish uchun quyidagi tugmani bosing. Barcha aktiv sessiyalar tugatiladi.
          </p>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 font-medium transition-all duration-300 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Hisobdan chiqish
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
