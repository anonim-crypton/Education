"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  GraduationCapIcon,
  BookOpenIcon,
  UsersIcon,
  PlayIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "@/components/animated-icons"

const stats = [
  { value: "0+", label: "O'quvchilar", icon: UsersIcon },
  { value: "0+", label: "Kurslar", icon: BookOpenIcon },
  { value: "0%", label: "Muvaffaqiyat", icon: SparklesIcon },
]

export function HeroHeader() {
  const [isPlayHovered, setIsPlayHovered] = useState(false)
  const [isStartHovered, setIsStartHovered] = useState(false)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 lg:pt-0">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_70%)]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(to right, var(--border) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <SparklesIcon className="w-4 h-4 text-primary" />
              </motion.div>
              <span className="text-sm font-medium text-primary">Education-talim uchun ishlab chiqilgan veb sayt</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance"
            >
              Kelajakingizni{" "}
              <span className="relative">
                <span className="text-primary">yangi bilimlar</span>
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <motion.path
                    d="M2 10 Q75 2, 150 6 T298 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-primary"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>{" "}
              bilan quring
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 text-pretty"
            >
              Professional o'qituvchilar, zamonaviy kurslar va interaktiv ta'lim usullari bilan o'z sohangizdagi
              mutaxassisga aylaning.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="rounded-xl h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 group"
                onMouseEnter={() => setIsStartHovered(true)}
                onMouseLeave={() => setIsStartHovered(false)}
              >
                <span>Bepul boshlash</span>
                <ArrowRightIcon className="w-5 h-5 ml-2" isHovered={isStartHovered} />
              </Button>
            
            
                {/* <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <PlayIcon className="w-3.5 h-3.5 text-primary ml-0.5" isHovered={isPlayHovered} />
                </div>
                <span>Video ko'rish</span> */}
        
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 grid grid-cols-3 gap-4 sm:gap-8"
            >
              {stats.map((stat, index) => (
                <StatItem key={stat.label} stat={stat} index={index} />
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Card */}
              <motion.div
                className="relative bg-card rounded-3xl p-8 shadow-2xl border border-border"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <div className="aspect-square relative overflow-hidden rounded-2xl bg-secondary">
                  <img src="/students-learning-in-modern-classroom-with-laptops.jpg" alt="Ta'lim" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-card/90 backdrop-blur-sm rounded-xl p-4 border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                          <GraduationCapIcon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Yangi kurs qo'shildi!</p>
                          <p className="text-sm text-muted-foreground">Ingliz tili</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                className="absolute -top-6 -right-6 bg-card rounded-2xl p-4 shadow-xl border border-border"
                animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <UsersIcon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Bugun qo'shildi</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-6 bg-card rounded-2xl p-4 shadow-xl border border-border"
                animate={{ y: [0, 8, 0], rotate: [0, -2, 0] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-secondary border-2 border-card overflow-hidden">
                        <img
                          src={`/professional-avatar.png?height=32&width=32&query=professional person avatar ${i}`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">+1 o'qituvchi</p>
                    <p className="text-xs text-muted-foreground">Professional jamoa</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function StatItem({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 + index * 0.1 }}
      className="text-center lg:text-left"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
        <stat.icon className="w-5 h-5 text-primary" isHovered={isHovered} />
        <span className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</span>
      </div>
      <p className="text-sm text-muted-foreground">{stat.label}</p>
    </motion.div>
  )
}
