"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, clearTokens } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      setLoading(false);
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
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">👋 Xush kelibsiz!</h2>
            <p className="text-zinc-300 mb-6">
              Siz muvaffaqiyatli tizimga kirdingiz. Hozir siz barcha ta'lim materiallariga kirish mumkinligi.
            </p>
            <div className="flex gap-4">
              <Link href="/courses">
                <Button className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200">
                  Kurslarni ko'rish
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Login Status */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">✅ Login Status</h3>
              <p className="text-green-400 text-sm">Siz tizimga kirgansiz</p>
              <p className="text-zinc-400 text-xs mt-2">Token localStorage-da saqlangan</p>
            </div>

            {/* Database Status */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">💾 Database</h3>
              <p className="text-blue-400 text-sm">SQLite3 - Django</p>
              <p className="text-zinc-400 text-xs mt-2">Barcha ma'lumotlar saqlangan</p>
            </div>

            {/* API Status */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">🔌 API</h3>
              <p className="text-purple-400 text-sm">REST API - Ishlamoqda</p>
              <p className="text-zinc-400 text-xs mt-2">localhost:8000</p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">🎯 Tamom bo'lgan xususiyatlar</h3>
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
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
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
    </div>
  );
}
