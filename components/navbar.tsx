"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  HomeIcon,
  BookOpenIcon,
  GraduationCapIcon,
  CodeIcon,
  PaletteIcon,
  BriefcaseIcon,
  TrendingUpIcon,
  LanguagesIcon,
  UsersIcon,
  PhoneIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  MenuIcon,
  XIcon,
} from "@/components/animated-icons"

const courses = [
  {
    title: "Dasturlash",
    description: "Python, JavaScript, React va boshqalar",
    icon: CodeIcon,
    href: "/courses/programming",
  },
  {
    title: "Dizayn",
    description: "UI/UX, Grafik dizayn, Figma",
    icon: PaletteIcon,
    href: "/courses/design",
  },
  {
    title: "Biznes",
    description: "Marketing, Menejment, Moliya",
    icon: BriefcaseIcon,
    href: "/courses/business",
  },
  {
    title: "Marketing",
    description: "SMM, SEO, Reklama strategiyalari",
    icon: TrendingUpIcon,
    href: "/courses/marketing",
  },
  {
    title: "Tillar",
    description: "Ingliz, Rus, Koreys tillari",
    icon: LanguagesIcon,
    href: "/courses/languages",
  },
]

const navLinks = [
  { title: "Bosh sahifa", href: "/", icon: HomeIcon },
  { title: "Kurslar", href: "/courses", icon: BookOpenIcon, hasDropdown: true },
  { title: "O'qituvchilar", href: "/teachers", icon: GraduationCapIcon },
  { title: "Biz haqimizda", href: "/about", icon: UsersIcon },
  { title: "Aloqa", href: "/contact", icon: PhoneIcon },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 150)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-xl shadow-lg border-b border-border" : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-2.5"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center shadow-md bg-slate-100 dark:bg-transparent"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src="/Education.jpg.png"
                alt="Education"
                width={48}
                height={48}
                className="w-full h-full object-cover dark:brightness-100 brightness-150 contrast-125"
              />
            </motion.div>
            <span className="text-xl font-bold text-foreground">
              Edu<span className="text-primary">cation</span>
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.title}
                className="relative"
                ref={link.hasDropdown ? dropdownRef : undefined}
                onMouseEnter={link.hasDropdown ? handleMouseEnter : undefined}
                onMouseLeave={link.hasDropdown ? handleMouseLeave : undefined}
              >
                <motion.a
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors relative",
                    "text-foreground/70 hover:text-foreground",
                  )}
                  onHoverStart={() => setHoveredLink(link.title)}
                  onHoverEnd={() => setHoveredLink(null)}
                  whileHover={{ y: -2 }}
                >
                  <link.icon className="w-4 h-4" isHovered={hoveredLink === link.title} />
                  <span>{link.title}</span>
                  {link.hasDropdown && <ChevronDownIcon className="w-4 h-4" isHovered={isDropdownOpen} />}
                  {hoveredLink === link.title && (
                    <motion.div
                      layoutId="navHover"
                      className="absolute inset-0 bg-secondary rounded-xl -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.a>

                {/* Dropdown Menu */}
                {link.hasDropdown && (
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-80 p-2 bg-card rounded-2xl shadow-xl border border-border"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="grid gap-1">
                          {courses.map((course, index) => (
                            <CourseDropdownItem key={course.title} course={course} index={index} />
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-border">
                          <a
                            href="/courses"
                            className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-xl transition-colors"
                          >
                            <BookOpenIcon className="w-4 h-4" />
                            Barcha kurslarni ko'rish
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            {/* Commented out theme toggle
            {mounted && (
              <motion.button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {theme === "dark" ? (
                    <SunIcon key="sun" className="w-5 h-5 text-foreground" />
                  ) : (
                    <MoonIcon key="moon" className="w-5 h-5 text-foreground" />
                  )}
                </AnimatePresence>
              </motion.button>
            )}
            */}

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <motion.a
                href="/login"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl bg-white text-black hover:bg-white/80 border-2 border-blue-500 dark:bg-slate-900 dark:text-white dark:border-blue-400 shadow-md font-medium text-sm px-4 py-2 transition-all duration-300 cursor-pointer"
              >
                Kirish
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg font-medium text-sm px-4 py-2 transition-all duration-300 cursor-pointer"
              >
                Ro'yxatdan o'tish
              </motion.button>
            </div>

            {/* Mobile Register Button */}
            <div className="sm:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md font-medium text-sm px-4 py-2.5 transition-all duration-300 cursor-pointer"
              >
                Ro'yxatdan o'tish
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Login Button */}
              <motion.a
                href="/login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0 }}
                className="w-full rounded-xl bg-white text-black hover:bg-white/80 border-2 border-blue-500 dark:bg-slate-900 dark:text-white dark:border-blue-400 shadow-md font-medium text-sm px-4 py-2.5 transition-all duration-300 mb-2 cursor-pointer block text-center"
              >
                Kirish
              </motion.a>
              
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors"
                  >
                    <link.icon className="w-5 h-5" />
                    {link.title}
                  </a>
                  {link.hasDropdown && (
                    <div className="ml-8 mt-1 space-y-1">
                      {courses.map((course) => (
                        <a
                          key={course.title}
                          href={course.href}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <course.icon className="w-4 h-4" />
                          {course.title}
                        </a>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function CourseDropdownItem({
  course,
  index,
}: {
  course: (typeof courses)[0]
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.a
      href={course.href}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary transition-colors group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <course.icon className="w-5 h-5 text-primary" isHovered={isHovered} />
      </div>
      <div>
        <h4 className="text-sm font-medium text-foreground">{course.title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5">{course.description}</p>
      </div>
    </motion.a>
  )
}
