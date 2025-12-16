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
          className="bg-card rounded-xl border border-white/50 p-4 mb-4"
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
      </div>
    </div>
  );
}
