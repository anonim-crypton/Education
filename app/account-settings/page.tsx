"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getAccessToken, clearTokens } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, ArrowLeft } from "lucide-react";

export default function AccountSettingsPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
  });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user profile
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/profile/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        setUserData(data.user);
        setFormData({
          first_name: data.user.first_name || "",
          last_name: data.user.last_name || "",
          email: data.user.email || "",
        });
      }
    })
    .catch(err => {
      setError("Profil ma'lumotlarini yuklashda xato");
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
  };

  const handleSaveProfile = async () => {
    const token = getAccessToken();
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/profile/`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      if (response.ok) {
        setError("");
        alert("Profil muvaffaqiyatli yangilandi");
      } else {
        setError("Profil yangilashda xato yuz berdi");
      }
    } catch (err) {
      setError("Xato yuz berdi");
      console.error(err);
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

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-xl border border-border p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-foreground mb-6">Shaxsiy Ma'lumotlar</h2>

          <div className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4 pb-6 border-b border-border">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold">
                {userData?.first_name ? userData.first_name.charAt(0).toUpperCase() : userData?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {userData?.first_name || userData?.username}
                </p>
                <p className="text-sm text-muted-foreground">
                  @{userData?.username}
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Birinchi ism
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Birinchi ismingiz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Familiya
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Familiyangiz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Email@example.com"
              />
            </div>

            {/* Save Button */}
            <motion.button
              onClick={handleSaveProfile}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium transition-all duration-300 cursor-pointer"
            >
              O'zgarishlarni saqlash
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
