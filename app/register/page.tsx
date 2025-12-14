"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { register, storeTokens, type ApiError } from "@/lib/api";
// import { useGoogleLogin } from "@react-oauth/google";
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

interface Particle {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password validation
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const isFormValid =
    username.trim() && schoolName.trim() && email.trim() && isPasswordValid;

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
      if (!isFormValid) return;
      
      setErrors({});
      setIsLoading(true);

      try {
        await register({
          username,
          email,
          password,
          password_confirm: password,
          school_name: schoolName,
        });
        setShowSuccessModal(true);
      } catch (error: unknown) {
        const apiError = error as ApiError;
        if (apiError.errors) {
          const formattedErrors: Record<string, string> = {};
          Object.entries(apiError.errors).forEach(([field, messages]) => {
            formattedErrors[field] = Array.isArray(messages) 
              ? messages[0] 
              : messages as string;
          });
          setErrors(formattedErrors);
        } else {
          setErrors({ general: "Registration failed. Please try again." });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, username, schoolName, isFormValid]
  );

  const handleModalClose = () => {
    setShowSuccessModal(false);
    // Redirect to login page
    window.location.href = "/login";
  };

  // const googleRegisterHandler = useGoogleLogin({
  //   onSuccess: async (codeResponse) => {
  //     try {
  //       setIsLoading(true);
  //       setErrors({});
  //       const response = await googleRegister(codeResponse.access_token, schoolName);
  //       storeTokens(response.access, response.refresh);
  //       setShowSuccessModal(true);
  //       setTimeout(() => {
  //         router.push("/dashboard");
  //       }, 2000);
  //     } catch (error: unknown) {
  //       const apiError = error as ApiError;
  //       if (apiError.errors) {
  //         const formattedErrors: Record<string, string> = {};
  //         Object.entries(apiError.errors).forEach(([field, messages]) => {
  //           formattedErrors[field] = Array.isArray(messages)
  //             ? messages[0]
  //             : messages as string;
  //         });
  //         setErrors(formattedErrors);
  //       } else {
  //         setErrors({ general: "Google registration failed. Please try again." });
  //       }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  //   onError: () => {
  //     setErrors({ general: "Google registration failed" });
  //   },
  // });

  const handleGoogleRegister = () => {
    setErrors({ general: "Google registration coming soon" });
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
        <Link href="/contact">
          <Button
            variant="outline"
            className="h-9 rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80 cursor-pointer"
          >
            <span className="mr-2">Aloqa</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </header>

      {/* Centered Register Card */}
      <motion.div
        className="w-full max-w-sm relative z-10 mt-16"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-zinc-800 bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60">
          <CardHeader className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CardTitle className="text-2xl">Akkaunt yaratish</CardTitle>
                <CardDescription className="text-zinc-400">
                  Yangi akkaunt yaratib, platformada ro'yxatdan o'ting
                </CardDescription>
              </motion.div>
            </AnimatePresence>
          </CardHeader>

          <CardContent className="grid gap-4">
            <AnimatePresence mode="wait">
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                key="signup-form"
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

                {/* Username */}
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

                {/* School Name */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid gap-2"
                >
                  <Label htmlFor="school" className="text-zinc-300">
                    Maktabingiz nomi
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      id="school"
                      type="text"
                      placeholder=" 1-maktab, Zomin  maktabi"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className={`pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 ${
                        schoolName.trim() === "" && schoolName !== ""
                          ? "border-red-500"
                          : ""
                      }`}
                      required
                    />
                  </div>
                  {schoolName && schoolName.trim() === "" && (
                    <p className="text-xs text-red-400 mt-1">
                      Maktab nomi to'g'ri kiritilib bo'lmadi
                    </p>
                  )}
                </motion.div>

                {/* Email Input */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid gap-2"
                >
                  <Label htmlFor="email" className="text-zinc-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) {
                          setErrors({ ...errors, email: "" });
                        }
                      }}
                      className={`pl-10 bg-zinc-950 text-zinc-50 placeholder:text-zinc-600 ${
                        errors.email ? "border-red-500" : "border-zinc-800"
                      }`}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-400">{errors.email}</p>
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
                      placeholder="Kamida 8 ta belgi, raqam, katta harf va maxsus belgi"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          setErrors({ ...errors, password: "" });
                        }
                      }}
                      className={`pl-10 pr-10 bg-zinc-950 text-zinc-50 placeholder:text-zinc-600 ${
                        errors.password 
                          ? "border-red-500"
                          : password && !isPasswordValid
                          ? "border-red-500"
                          : password && isPasswordValid
                          ? "border-green-500"
                          : "border-zinc-800"
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

                  {/* Password Requirements Checker */}
                  {password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800"
                    >
                      <p className="text-xs text-zinc-400 mb-2 font-semibold">
                        Parol talablari:
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              passwordRequirements.minLength
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span
                            className={`text-xs ${
                              passwordRequirements.minLength
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            Kamida 8 ta belgi
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              passwordRequirements.hasUpperCase
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span
                            className={`text-xs ${
                              passwordRequirements.hasUpperCase
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            Katta harf (A-Z)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              passwordRequirements.hasLowerCase
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span
                            className={`text-xs ${
                              passwordRequirements.hasLowerCase
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            Kichik harf (a-z)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              passwordRequirements.hasNumber
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span
                            className={`text-xs ${
                              passwordRequirements.hasNumber
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            Raqam (0-9)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              passwordRequirements.hasSpecialChar
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span
                            className={`text-xs ${
                              passwordRequirements.hasSpecialChar
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            Maxsus belgi (!@#$%^&* va h.k.)
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
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
                    "Ro'yxatdan o'tish"
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

                {/* Social Register */}
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
                    onClick={() => handleGoogleRegister()}
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
            Allaqachon akkauntingiz bor?
            <Link href="/login" className="ml-1 text-zinc-200 hover:underline">
              Kiring
            </Link>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
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
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <svg
                    className="w-8 h-8 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  Tabriklaymiz!
                </h3>
                <p className="text-zinc-300 mb-6">
                  Akauntingiz muvaffaqiyatli yaratildi.
                </p>
                <p className="text-sm text-zinc-400 mb-6">
                  Endi login saxifaga o'tishingiz mumkin
                </p>

                <motion.button
                  onClick={handleModalClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-zinc-50 text-zinc-900 hover:bg-zinc-200 font-semibold py-2 px-4 rounded-lg transition-all"
                >
                  Login saxifasiga o'tish
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
