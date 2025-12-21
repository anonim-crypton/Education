"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Eye, EyeOff, Lock, User, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/users/admin/api/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Token saqlash
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("is_admin", "true");
        localStorage.setItem("admin_username", username);

        // Django admin dashboard-ga o'tish (hech qanday message yo'q, loading davom etadi)
        window.location.href = "http://localhost:8000/dashboard/";
      } else {
        setError("Username yoki parol noto'g'ri");
        setPassword("");
      }
    } catch (err) {
      setError("Serverga ulanib bo'lmadi. Qaytadan urinib ko'ring.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl"
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-amber-600 to-amber-500 p-8 text-center">
            <motion.button
              onClick={() => router.back()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-4 left-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.button>

            <motion.div
              className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-lg mx-auto mb-3"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src="/education.png"
                alt="Admin"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <h1 className="text-3xl font-bold text-white">Bosh Admin</h1>
            <p className="text-amber-100 text-sm mt-1">
              Edugame Admin Panel'iga kirish
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3 text-green-400"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                <p className="text-sm">{success}</p>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-400" />
                    Username
                  </div>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Admin username"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  required
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400" />
                    Parol
                  </div>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parolingiz"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all pr-12"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading || !username || !password}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 px-4 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-amber-500/50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Kirilyapti...
                  </span>
                ) : (
                  "Admin Panel'ga Kirish"
                )}
              </motion.button>
            </form>

            {/* Footer Info */}
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <p className="text-xs text-slate-400 text-center">
                💡 Bosh admin panel faqat admin huquqlari bilan kirish mumkin.
              </p>
              <p className="text-xs text-slate-500 text-center mt-2">
                © 2024 Edugame. Barcha huquqlar himoyalangan.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
