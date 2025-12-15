"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, clearTokens } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  ArrowRight,
  BookOpen,
  Settings,
  GraduationCap,
  X,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [showSchoolNameModal, setShowSchoolNameModal] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [savingSchoolName, setSavingSchoolName] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);

      // Fetch user profile with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/users/profile/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
          signal: controller.signal,
        }
      )
        .then((res) => {
          if (!res.ok) {
            return null;
          }
          return res.json();
        })
        .then((data) => {
          if (data && data.user) {
            setUserData(data.user);
            // Faqat Google users va school_name "Not specified" bo'lsa, modal ko'rsat
            if (
              data.user.is_google_user &&
              data.user.school_name === "Not specified"
            ) {
              setShowSchoolNameModal(true);
            }
          }
        })
        .catch((err) => {
          // Silently handle errors - endpoint may not exist yet
        })
         .finally(() => {
           clearTimeout(timeoutId);
           setLoading(false);
         });
    }
  }, [router]);

  const handleLogout = () => {
    clearTokens();
    router.push("/");
  };

  const handleSaveSchoolName = async () => {
    if (!schoolName.trim()) {
      return;
    }

    setSavingSchoolName(true);
    const token = getAccessToken();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/users/google/complete/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            school_name: schoolName,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        setShowSchoolNameModal(false);
        setSchoolName(""); // Input ni tozalash
      }
    } catch (error) {
      console.error("Error saving school name:", error);
    } finally {
      setSavingSchoolName(false);
    }
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

          {/* Logout Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm"
          >
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Tizimdan chiqish
            </h3>
            <p className="text-foreground/70 mb-4">
              Agar siz hisobdan chiqmoqchi bo'lsangiz, quyidagi tugmani bosing.
            </p>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-medium transition-all duration-300 cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              Tizimdan chiqish
            </motion.button>
          </motion.div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Login Status */}
            <div className="bg-zinc-900 border border-white/20 rounded-xl p-6 hover:border-white/40 transition-colors">
              <h3 className="text-lg font-semibold mb-2">✅ Login Status</h3>
              <p className="text-green-400 text-sm">Siz tizimga kirgansiz</p>
              <p className="text-zinc-400 text-xs mt-2">
                Token localStorage-da saqlangan
              </p>
            </div>

            {/* Database Status */}
            <div className="bg-zinc-900 border border-white/20 rounded-xl p-6 hover:border-white/40 transition-colors">
              <h3 className="text-lg font-semibold mb-2">💾 Database</h3>
              <p className="text-blue-400 text-sm">SQLite3 - Django</p>
              <p className="text-zinc-400 text-xs mt-2">
                Barcha ma'lumotlar saqlangan
              </p>
            </div>

            {/* API Status */}
            <div className="bg-zinc-900 border border-white/20 rounded-xl p-6 hover:border-white/40 transition-colors">
              <h3 className="text-lg font-semibold mb-2">🔌 API</h3>
              <p className="text-purple-400 text-sm">REST API - Ishlamoqda</p>
              <p className="text-zinc-400 text-xs mt-2">localhost:8000</p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-zinc-900 border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">
              🎯 Tamom bo'lgan xususiyatlar
            </h3>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-center gap-3">
                <span className="text-green-400">✅</span>
                <span>Username va parol bilan ro'yxatdan o'tish</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✅</span>
                <span>Parol hashing (PBKDF2)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✅</span>
                <span>Token-based authentication</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✅</span>
                <span>Maktab nomi saqlash</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✅</span>
                <span>Django SQLite database</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✅</span>
                <span>REST API (Next.js + Django bog'lanishi)</span>
              </li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="bg-zinc-900 border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">📋 Keyingi bosqichlar</h3>
            <ul className="space-y-2 text-zinc-300">
              <li>• Google OAuth integratsiyasi</li>
              <li>• Password reset funktsiyasi</li>
              <li>• Email verification</li>
              <li>• User profile page</li>
              <li>• Courses va lessons</li>
            </ul>
          </div>
        </div>
      </main>

      {/* School Name Modal */}
      <AnimatePresence>
        {showSchoolNameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 max-w-sm mx-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Maktab nomini kiriting
                </h2>
                <button
                  onClick={() => setShowSchoolNameModal(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-zinc-400 text-sm mb-6">
                Google orqali kirganingiz uchun maktab nomini kiritish kerak.
              </p>

              <Input
                type="text"
                placeholder="Masalan: Toshkent 1-sonli maktab"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="mb-6 bg-zinc-950 border-zinc-800 text-white"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSaveSchoolName();
                  }
                }}
              />

              <Button
                onClick={handleSaveSchoolName}
                disabled={!schoolName.trim() || savingSchoolName}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {savingSchoolName ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
