"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, clearTokens } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LogOut,
  User,
  Settings,
  BookOpen,
  Plus,
  Video,
} from "lucide-react";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [loading, setLoading] = useState(true);

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

  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border z-40 overflow-y-auto"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground">Edugame</h1>
          <p className="text-sm text-muted-foreground mt-1">O'qituvchi Paneli</p>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-2 flex flex-col h-full">
          <div className="space-y-2 flex-1">
            <Link href="/teacher-dashboard">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-foreground transition-colors cursor-pointer">
                <BookOpen className="w-5 h-5" />
                <span>Mening Kurslarim</span>
              </div>
            </Link>
            <Link href="/teacher-dashboard/lessons">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600/10 text-blue-600 transition-colors cursor-pointer font-semibold">
                <Video className="w-5 h-5" />
                <span>Darslar</span>
              </div>
            </Link>
            <Link href="/teacher-dashboard/students">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-600/10 text-indigo-600 transition-colors cursor-pointer font-semibold">
                <User className="w-5 h-5" />
                <span>O'quvchilar</span>
              </div>
            </Link>
            <div className="border-t border-border my-4" />
            <Link href="/teacher-dashboard/add-course">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-600/10 text-green-600 transition-colors cursor-pointer font-semibold">
                <Plus className="w-5 h-5" />
                <span>Yangi Kurs</span>
              </div>
            </Link>
            <Link href="/teacher-dashboard/upload-video">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-600/10 text-purple-600 transition-colors cursor-pointer font-semibold">
                <Video className="w-5 h-5" />
                <span>Darsni Yuklash</span>
              </div>
            </Link>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border bg-card/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-600 font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Chiqish</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 ml-64">
        {/* Top Header */}
        <header className="sticky top-0 h-16 bg-card border-b border-border flex items-center justify-end px-6 z-30">
          {/* Account Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <AvatarWithFallback
                src={userData?.avatar_url}
                alt={userData?.username}
                size="sm"
                className="border border-primary"
              />
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">
                  {userData?.first_name || userData?.username}
                </p>
                <p className="text-xs text-muted-foreground">O'qituvchi</p>
              </div>
            </motion.button>

            {/* Account Dropdown */}
            {showAccountMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
              >
                <Link href="/account-settings">
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profil Sozlamalari</span>
                  </div>
                </Link>
                <div className="border-t border-border" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-600/10 text-red-600 transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Chiqish</span>
                </button>
              </motion.div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}
