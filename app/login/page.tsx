"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { login, storeTokens, type ApiError } from "@/lib/api";
import { useGoogleLogin } from "@react-oauth/google";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  User,
  Send,
  Chrome,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Particle {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(false);

  // Form validation
  const isFormValid = username.trim() && password.trim();

  useEffect(() => {
    // Generate particles only on client side (kamaytirilgan: 20 dan 8 ga)
    const generatedParticles: Particle[] = [...Array(8)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 4 + Math.random() * 2,
      delay: Math.random() * 1,
    }));
    setParticles(generatedParticles);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});
      setIsLoading(true);

      try {
        const response = await login({ username, password });
        
        // Teacher akkaunt bo'lsa xato ko'rsat
        if (response.is_teacher === true) {
          setErrors({ general: "O'qituvchi akkauntlari uchun Django panelidan foydalaning: http://localhost:8000/api/users/teacher/login/" });
          setIsLoading(false);
          return;
        }

        storeTokens(response.access, response.refresh);

        // Navbar-ni yangilash uchun
        window.dispatchEvent(new Event("loginSuccess"));

        // Loading animatsiya dashboard-ga redirect bo'lgungacha davom etadi
        router.push("/dashboard");
      } catch (error: unknown) {
        setIsLoading(false);

        const errorObj = error as Record<string, any>;
        let errorMessage =
          "Loginni kiritishda xatolik. Iltimos, qayta urinib ko'ring.";
        const fieldErrors: Record<string, string> = {};

        // Backend error response-ni tekshirish
        if (errorObj) {
          // 1. errors.non_field_errors bo'lsa (noto'g'ri credentials)
          if (
            errorObj.errors?.non_field_errors &&
            Array.isArray(errorObj.errors.non_field_errors)
          ) {
            errorMessage = errorObj.errors.non_field_errors[0];
          }
          // 2. errors.[field] bo'lsa (field-specific errors)
          else if (errorObj.errors && typeof errorObj.errors === "object") {
            Object.entries(errorObj.errors).forEach(
              ([field, messages]: [string, any]) => {
                if (Array.isArray(messages)) {
                  fieldErrors[field] = messages[0] || "Xatolik";
                } else if (typeof messages === "string") {
                  fieldErrors[field] = messages;
                }
              }
            );
            // Agar field errors bo'lsa, ularni ko'rsat
            if (Object.keys(fieldErrors).length > 0) {
              setErrors(fieldErrors);
              return;
            }
          }
          // 3. detail xabari bo'lsa
          else if (errorObj.detail) {
            errorMessage = errorObj.detail;
          }
          // 4. non_field_errors (direct) bo'lsa
          else if (
            errorObj.non_field_errors &&
            Array.isArray(errorObj.non_field_errors)
          ) {
            errorMessage = errorObj.non_field_errors[0] || errorMessage;
          }
        }

        // Umumiy xatolik xabarini ko'rsat
        setErrors({ general: errorMessage });
      }
    },
    [username, password, router]
  );

  const handleGoogleLoginFunc = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setErrors({});
      setIsLoading(true);
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
          }/api/users/google/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: codeResponse.access_token,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setErrors({
            general:
              data.errors?.general?.[0] || "Google login muvaffaqiyatsiz",
          });
          setIsLoading(false);
          return;
        }

        // Token-ni localStorage-ga saqlash
        if (data.access) {
          storeTokens(data.access, null);

          // Navbar-ni yangilash uchun
          window.dispatchEvent(new Event("loginSuccess"));

          console.log("Google login response:", {
            is_teacher: data.is_teacher,
            teacher_status: data.teacher_status,
          });

          // Teacher bo'lsa teacher panel'ga yo'naltirish (only if approved)
          if (data.is_teacher === true && data.teacher_status === "approved") {
            console.log("Redirecting to teacher dashboard");
            router.push("/teacher-dashboard");
          } else {
            console.log("Redirecting to student dashboard");
            // Dashboard-ga o'tish
            router.push("/dashboard");
          }
        }
      } catch (err) {
        setErrors({
          general: "Google login xatosi. Iltimos, qayta urinib ko'ring.",
        });
        setIsLoading(false);
        console.error("Google login error:", err);
      }
    },
    onError: () => {
      setErrors({ general: "Google login bekor qilindi" });
    },
    flow: "implicit",
  });

  const handleGoogleLogin = () => {
    handleGoogleLoginFunc();
  };

  return (
    <section className="relative min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-slate-950 via-primary/5 to-slate-950"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Animated Gradient Orbs (Optimized) */}
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

      {/* Header */}
      <header className="fixed left-0 right-0 top-0 flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm z-40">
        <span className="text-xs tracking-[0.14em] uppercase text-zinc-400">
          Edugame
        </span>
        <a href="http://localhost:8000/api/users/teacher/login/">
          <Button
            variant="outline"
            className="h-9 rounded-lg border-amber-600/50 bg-zinc-900 text-zinc-50 hover:bg-amber-600/10 hover:border-amber-600 cursor-pointer transition-all"
          >
            <span className="mr-2"> O'qituvchi Paneli</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </a>
      </header>

      {/* Centered Login Card */}
      <motion.div
        className="w-full max-w-sm relative z-10 mt-16"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-zinc-800 bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60">
          {/* Toggle Tabs */}
          <CardHeader className="space-y-4">
            {/* <div className="flex gap-3 mb-4">
              <div className="text-xs text-zinc-400 text-center flex-1">
                👨‍🎓 Foydalanuvchi
              </div>
              <a href="http://localhost:8000/api/users/teacher/login/" className="text-xs text-zinc-400 hover:text-primary transition-colors flex-1 text-center">
                👨‍🏫 O'qituvchi
              </a>
            </div> */}

            <AnimatePresence mode="wait">
              <motion.div
                key="login"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CardTitle className="text-2xl">Xush kelibsiz</CardTitle>
                <CardDescription className="text-zinc-400">
                  Akkauntingizga kiring va o'qishni boshlang
                </CardDescription>
              </motion.div>
            </AnimatePresence>
          </CardHeader>

          <CardContent className="grid gap-4">
            <AnimatePresence mode="wait">
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                key="login-form"
              >
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
                  <Label htmlFor="username" className="text-zinc-300">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Username"
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
                      required
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
                  <Label htmlFor="password" className="text-zinc-300">
                    Parol
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      id="password"
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
                      required
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-400 hover:text-zinc-200"
                      onClick={() => setShowPassword((v) => !v)}
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

                {/* Remember & Forgot Password */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                          setRememberMe(checked as boolean)
                        }
                        className="border-zinc-700 data-[state=checked]:bg-zinc-50 data-[state=checked]:text-zinc-900"
                      />
                      <Label
                        htmlFor="remember"
                        className="text-zinc-400 cursor-pointer"
                      >
                        Eslab qol
                      </Label>
                    </div>
                    <a
                      href="#"
                      className="text-sm text-zinc-300 hover:text-zinc-100"
                    >
                      Parolni unitdingizmi?
                    </a>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-10 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader className="w-5 h-5 text-zinc-900" />
                  ) : (
                    "Kirish"
                  )}
                </motion.button>

                {/* Divider */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  <Separator className="bg-zinc-800" />
                  <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-zinc-900/70 px-2 text-[11px] uppercase tracking-widest text-zinc-500">
                    yoki
                  </span>
                </motion.div>

                {/* Social Login */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <Button
                    variant="outline"
                    type="button"
                    className="h-10 rounded-lg border-zinc-800 bg-zinc-950 text-zinc-50 hover:bg-zinc-900/80"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Telegram
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => handleGoogleLogin()}
                    className="h-10 rounded-lg border-zinc-800 bg-zinc-950 text-zinc-50 hover:bg-zinc-900/80"
                  >
                    <Chrome className="h-4 w-4 mr-2" />
                    Google
                  </Button>
                </motion.div>
              </form>
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex items-center justify-center text-sm text-zinc-400">
            Akkauntingiz yo'qmi?
            <Link
              href="/register"
              className="ml-1 text-zinc-200 hover:underline"
            >
              Ro'yxatdan o'tish
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </section>
  );
}
