"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Sparkles, User, Send, Chrome, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface Particle {
  id: number
  left: number
  top: number
  duration: number
  delay: number
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Generate particles only on client side (kamaytirilgan: 20 dan 8 ga)
    const generatedParticles: Particle[] = [...Array(8)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 4 + Math.random() * 2,
      delay: Math.random() * 1,
    }))
    setParticles(generatedParticles)
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 800)
    console.log("Login:", { username, password })
  }, [username, password])

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
        <Button
          variant="outline"
          className="h-9 rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80"
        >
          <span className="mr-2">Aloqa</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
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
            <div className="flex gap-3 mb-4">
              {/* <motion.button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all ${
                  isLogin
                    ? "bg-zinc-50 text-zinc-900"
                    : "bg-zinc-800 text-zinc-50 hover:bg-zinc-700"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Kirish
              </motion.button> */}
              {/* <motion.button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all ${
                  !isLogin
                    ? "bg-zinc-50 text-zinc-900"
                    : "bg-zinc-800 text-zinc-50 hover:bg-zinc-700"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Ro'yxatdan o'tish
              </motion.button> */}
            </div>

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
              <form onSubmit={handleSubmit} className="space-y-4" key="login-form">

                {/* Username Input */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid gap-2"
                >
                  <Label htmlFor="username" className="text-zinc-300">
                    Foydalanuvchi nomi
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Sizning foydalanuvchi nomingiz"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                      required
                    />
                  </div>
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
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                      required
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
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
                </motion.div>

                {/* Remember & Forgot Password */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      className="border-zinc-700 data-[state=checked]:bg-zinc-50 data-[state=checked]:text-zinc-900"
                    />
                    <Label htmlFor="remember" className="text-zinc-400 cursor-pointer">
                      Eslab qol
                    </Label>
                  </div>
                  <a href="#" className="text-sm text-zinc-300 hover:text-zinc-100">
                    Parolni unitdingizmi?
                  </a>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-10 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                     <span className="flex items-center justify-center gap-2">
                       <motion.div
                         animate={{ rotate: 360 }}
                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                       >
                         <Sparkles className="w-4 h-4" />
                       </motion.div>
                       Yuklanmoqda...
                     </span>
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
            <Link href="/register" className="ml-1 text-zinc-200 hover:underline">
              Ro'yxatdan o'tish
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </section>
  )
}
