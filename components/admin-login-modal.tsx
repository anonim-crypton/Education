"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, X } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export function AdminLoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: AdminLoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFormValid = username.trim() && password.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      // Backend admin login API chaqirish
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/users/admin/api/login/`,
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

        // Token-ni localStorage-ga saqlash
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("is_admin", "true");
        localStorage.setItem("admin_username", username);

        // Django admin panelga yo'naltirish
        setTimeout(() => {
          window.location.href = "http://localhost:8000/dashboard/";
          onLoginSuccess?.();
        }, 500);
      } else {
        const errorData = await response.json();
        setErrors({
          general: errorData.message || "Noto'g'ri username yoki parol.",
        });
      }
    } catch (error) {
      setErrors({
        general:
          "Login qilishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
      });
      console.error("Admin login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border-zinc-800 bg-zinc-900/90 backdrop-blur">
        <DialogHeader>
          <DialogTitle className="text-xl">Bosh Admin Panel</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* General Error */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
            >
              <p className="text-sm text-red-400">{errors.general}</p>
            </motion.div>
          )}

          {/* Username Input */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-2"
          >
            <Label htmlFor="admin-username" className="text-zinc-300">
              Username
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="admin-username"
                type="text"
                placeholder="Admin username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) {
                    setErrors({ ...errors, username: "" });
                  }
                }}
                className={`pl-10 bg-zinc-950 text-zinc-50 placeholder:text-zinc-600 ${
                  errors.username ? "border-red-500" : "border-zinc-800"
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.username && (
              <p className="text-xs text-red-400">{errors.username}</p>
            )}
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-2"
          >
            <Label htmlFor="admin-password" className="text-zinc-300">
              Parol
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: "" });
                  }
                }}
                className={`pl-10 pr-10 bg-zinc-950 text-zinc-50 placeholder:text-zinc-600 ${
                  errors.password ? "border-red-500" : "border-zinc-800"
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-400 hover:text-zinc-200"
                onClick={() => setShowPassword((v) => !v)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password}</p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading || !isFormValid}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-10 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 text-zinc-900" />
                <span>Kirilmoqda...</span>
              </>
            ) : (
              "Kirish"
            )}
          </motion.button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
