"use client";

import { useState, useRef, useEffect, memo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getAccessToken, clearTokens } from "@/lib/api";
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
  ChevronDownIcon,
  MenuIcon,
  XIcon,
} from "@/components/animated-icons";
import {
  BookAIcon,
  BookUpIcon,
  CalculatorIcon,
  HistoryIcon,
  ScaleIcon,
  LogOut,
  User,
} from "lucide-react";

const getCourseIcon = (subject: string) => {
  const subjectLower = subject.toLowerCase();
  if (
    subjectLower.includes("dastur") ||
    subjectLower.includes("code") ||
    subjectLower.includes("program")
  ) {
    return CodeIcon;
  } else if (
    subjectLower.includes("til") ||
    subjectLower.includes("language")
  ) {
    return LanguagesIcon;
  } else if (
    subjectLower.includes("math") ||
    subjectLower.includes("riyoziy")
  ) {
    return CalculatorIcon;
  } else if (
    subjectLower.includes("tarix") ||
    subjectLower.includes("history")
  ) {
    return HistoryIcon;
  } else if (subjectLower.includes("huquq") || subjectLower.includes("law")) {
    return ScaleIcon;
  }
  return BookOpenIcon;
};

const courses = [];

const navLinks = [
  { title: "Bosh sahifa", href: "/dashboard", icon: HomeIcon },
  { title: "Kurslar", href: "/courses", icon: BookOpenIcon, hasDropdown: true },
  { title: "O'qituvchilar", href: "/teachers", icon: GraduationCapIcon },
  { title: "Biz haqimizda", href: "/about", icon: UsersIcon },
  { title: "Aloqa", href: "/contact", icon: PhoneIcon },
];

const NavbarComponent = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [teachersCourses, setTeachersCourses] = useState<any[]>([]);
  const [dropdownCourses, setDropdownCourses] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if user is logged in and fetch user data
  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token);

    if (token) {
      // Fetch user profile data
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
        .catch((err) => console.log("Error fetching profile:", err));
    }

    const shouldOpen = localStorage.getItem("shouldOpenNav") === "true";
    if (shouldOpen && window.innerWidth < 1024) {
      setIsMobileMenuOpen(true);
      localStorage.removeItem("shouldOpenNav");
    }

    // Hardcoded courses list with 10 subjects
    const hardcodedCourses = [
      {
        id: 1,
        title: "Web-Dasturlash",
        subject: "Dasturlash",
        description: "Web saytlari yaratish",
        icon: CodeIcon,
        href: "/courses/1",
      },
      {
        id: 2,
        title: "Matematika",
        subject: "Matematika",
        description: "Riyoziyat asoslari",
        icon: CalculatorIcon,
        href: "/courses/2",
      },
      {
        id: 3,
        title: "Fizika",
        subject: "Fizika",
        description: "Tabiat qonunlari",
        icon: BookOpenIcon,
        href: "/courses/3",
      },
      {
        id: 4,
        title: "Kimyo",
        subject: "Kimyo",
        description: "Moddalar va reaksiyalar",
        icon: BookAIcon,
        href: "/courses/4",
      },
      {
        id: 5,
        title: "Biologiya",
        subject: "Biologiya",
        description: "Tirik organizmlari",
        icon: BookAIcon,
        href: "/courses/5",
      },
      {
        id: 6,
        title: "Ingliz-tili",
        subject: "Til",
        description: "Ingliz tili o'rganish",
        icon: LanguagesIcon,
        href: "/courses/6",
      },
      {
        id: 7,
        title: "Rus-tili",
        subject: "Til",
        description: "Rus tili o'rganish",
        icon: LanguagesIcon,
        href: "/courses/7",
      },
      {
        id: 8,
        title: "O'zbekiston tarixi",
        subject: "Tarix",
        description: "O'zbekiston tarixiy hodisalari",
        icon: HistoryIcon,
        href: "/courses/8",
      },
      {
        id: 9,
        title: "Geografiya",
        subject: "Geografiya",
        description: "Yer va hududlar",
        icon: BookOpenIcon,
        href: "/courses/9",
      },
      {
        id: 10,
        title: "Iqtisodiyot",
        subject: "Iqtisodiyot",
        description: "Iqtisodiyat asoslari",
        icon: TrendingUpIcon,
        href: "/courses/10",
      },
    ];
    
    setDropdownCourses(hardcodedCourses);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  // Handle account menu click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
    };

    if (isAccountMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAccountMenuOpen]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl shadow-lg border-b border-border"
          : "bg-transparent"
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
              className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shadow-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src="/education.png"
                alt="Edugame"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <span className="text-xl font-bold text-foreground">
              Edu<span className="text-primary">game</span>
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
                    "text-foreground/70 hover:text-foreground"
                  )}
                  onHoverStart={() => setHoveredLink(link.title)}
                  onHoverEnd={() => setHoveredLink(null)}
                  whileHover={{ y: -2 }}
                >
                  <link.icon
                    className="w-4 h-4"
                    isHovered={hoveredLink === link.title}
                  />
                  <span>{link.title}</span>
                  {link.hasDropdown && (
                    <ChevronDownIcon
                      className="w-4 h-4"
                      isHovered={isDropdownOpen}
                    />
                  )}
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
                        className="absolute top-full left-0 mt-2 w-96 p-3 bg-background/95 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/30 max-h-96 overflow-y-auto dropdown-scrollbar"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="space-y-1">
                          {dropdownCourses.length > 0 ? (
                            dropdownCourses.map((course, index) => (
                              <CourseDropdownItem
                                key={course.id}
                                course={course}
                                index={index}
                              />
                            ))
                          ) : (
                            <div className="px-3 py-6 text-center text-sm text-muted-foreground bg-primary/10 border border-primary/50 rounded-xl">
                              Kurslar yuklangan'yaponaqdi...
                            </div>
                          )}
                        </div>
                        <div className="mt-3 pt-3 border-t border-primary/50">
                          <a
                            href="/courses"
                            className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/20 bg-primary/10 rounded-xl transition-colors border border-primary/50"
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
            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  {/* O'qituvchi bo'lish button */}
                  <Link href="/become-teacher">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg font-medium text-sm px-4 py-2 transition-all duration-300 cursor-pointer flex items-center gap-2"
                    >
                      <GraduationCapIcon className="w-4 h-4" />
                      O'qituvchi bo'lish
                    </motion.button>
                  </Link>

                  {/* User Account Menu */}
                  <div className="relative" ref={accountMenuRef}>
                    <motion.button
                      onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-1.5 border rounded-xl transition-all duration-200",
                        isAccountMenuOpen
                          ? "bg-slate-700/30 border-slate-600/60"
                          : "bg-transparent border-slate-700/40 hover:bg-slate-700/20 hover:border-slate-600/50"
                      )}
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm font-semibold shadow-md overflow-hidden flex-shrink-0">
                        {userData?.avatar_url ? (
                          <img
                            src={userData.avatar_url}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                        {userData?.first_name ||
                          userData?.username ||
                          "Foydalanuvchi"}
                      </span>
                    </motion.button>

                    {/* Account Dropdown Menu */}
                    <AnimatePresence>
                      {isAccountMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.92 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.92 }}
                          transition={{ duration: 0.25 }}
                          className="absolute top-full right-0 mt-3 min-w-72 max-w-96 bg-background rounded-2xl shadow-2xl border border-border overflow-hidden backdrop-blur-sm"
                        >
                          {/* Header Section */}
                          <div className="p-4 bg-card border-b border-border">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold shadow-md overflow-hidden flex-shrink-0">
                                {userData?.avatar_url ? (
                                  <img
                                    src={userData.avatar_url}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User className="w-5 h-5" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-foreground truncate">
                                  {userData?.first_name || userData?.username}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  @{userData?.username}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                              Hisobingiz
                            </p>
                            <p className="text-xs text-muted-foreground break-words">
                              {userData?.email}
                            </p>
                          </div>

                          {/* Menu Items */}
                          <div className="p-2 space-y-1">
                            <Link href="/account-settings">
                              <motion.button
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-all duration-200 text-left group"
                              >
                                <svg
                                  className="w-4 h-4 text-foreground/60 group-hover:text-foreground/80 transition-colors flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                <span>Hisobni sozlash</span>
                              </motion.button>
                            </Link>

                            <Link href="/complaint">
                              <motion.button
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-all duration-200 text-left group"
                              >
                                <svg
                                  className="w-4 h-4 text-foreground/60 group-hover:text-foreground/80 transition-colors flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span>Shikoyat qilish</span>
                              </motion.button>
                            </Link>

                            <Link href="/contact">
                              <motion.button
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-all duration-200 text-left group"
                              >
                                <svg
                                  className="w-4 h-4 text-foreground/60 group-hover:text-foreground/80 transition-colors flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                                  />
                                </svg>
                                <span>Yordam Markazi</span>
                              </motion.button>
                            </Link>

                            <div className="my-2 border-t border-border/50"></div>

                            <Link href="/admin-login">
                              <motion.button
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all duration-200 text-left group"
                              >
                                <svg
                                  className="w-4 h-4 text-amber-500 group-hover:text-amber-400 transition-colors flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                  />
                                </svg>
                                <span>Bosh Admin Panel</span>
                              </motion.button>
                            </Link>

                            <a href="http://localhost:8000/api/users/teacher/login/">
                              <motion.button
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all duration-200 text-left group"
                              >
                                <svg
                                  className="w-4 h-4 text-blue-500 group-hover:text-blue-400 transition-colors flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                  />
                                </svg>
                                <span>O'qituvchi Panel</span>
                              </motion.button>
                            </a>

                            <div className="my-2 border-t border-border/50"></div>

                            <motion.button
                              onClick={() => {
                                clearTokens();
                                setIsAccountMenuOpen(false);
                                router.push("/");
                              }}
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 text-left group"
                            >
                              <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-400 transition-colors flex-shrink-0" />
                              <span>Hisobdan chiqish</span>
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  {/* Admin Panel button - shown when not logged in */}
                  <Link href="/admin-login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg font-medium text-sm px-4 py-2 transition-all duration-300 cursor-pointer"
                    >
                      Bosh Admin Panel
                    </motion.button>
                  </Link>
                  <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-xl bg-white text-black hover:bg-white/80 border-2 border-blue-500 dark:bg-slate-900 dark:text-white dark:border-blue-400 shadow-md font-medium text-sm px-4 py-2 transition-all duration-300 cursor-pointer"
                    >
                      Kirish
                    </motion.button>
                  </Link>
                  <Link href="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg font-medium text-sm px-4 py-2 transition-all duration-300 cursor-pointer"
                    >
                      Ro'yxatdan o'tish
                    </motion.button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Actions - Only show when logged in */}
            {isLoggedIn && (
              <div className="sm:hidden flex items-center gap-2">
                {/* Mobile Become Teacher Button */}
                <Link href="/become-teacher">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg font-medium text-sm px-3 py-2 transition-all duration-300 cursor-pointer flex items-center gap-1.5"
                  >
                    <GraduationCapIcon className="w-4 h-4" />
                    O'qituvchi
                  </motion.button>
                </Link>

                {/* Mobile Account Menu Button */}
                <div className="relative" ref={accountMenuRef}>
                  <motion.button
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-all overflow-hidden"
                  >
                    {userData?.avatar_url ? (
                      <img
                        src={userData.avatar_url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </motion.button>

                  {/* Mobile Account Dropdown Menu */}
                  <AnimatePresence>
                    {isAccountMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.92 }}
                        transition={{ duration: 0.25 }}
                        className="absolute top-full right-0 mt-2 min-w-64 max-w-80 bg-background rounded-2xl shadow-2xl border border-border overflow-hidden backdrop-blur-sm z-50"
                      >
                        {/* Header Section */}
                        <div className="p-3 bg-card border-b border-border">
                          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                            Hisobingiz
                          </p>
                          <p className="text-sm font-bold text-foreground">
                            {userData?.first_name ||
                              userData?.username ||
                              "Foydalanuvchi"}
                          </p>
                          <p className="text-xs text-muted-foreground break-words mt-1">
                            {userData?.email}
                          </p>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2 space-y-1">
                          <Link href="/account-settings">
                            <motion.button
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-all duration-200 text-left group"
                            >
                              <svg
                                className="w-4 h-4 text-foreground/60 group-hover:text-foreground/80 transition-colors flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span>Hisobni sozlash</span>
                            </motion.button>
                          </Link>

                          <Link href="/complaint">
                            <motion.button
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-all duration-200 text-left group"
                            >
                              <svg
                                className="w-4 h-4 text-foreground/60 group-hover:text-foreground/80 transition-colors flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>Shikoyat qilish</span>
                            </motion.button>
                          </Link>

                          <Link href="/contact">
                            <motion.button
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-all duration-200 text-left group"
                            >
                              <svg
                                className="w-4 h-4 text-foreground/60 group-hover:text-foreground/80 transition-colors flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                              </svg>
                              <span>Yordam Markazi</span>
                            </motion.button>
                          </Link>

                          <div className="my-1 border-t border-border/50"></div>

                          <Link href="/admin-login">
                            <motion.button
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all duration-200 text-left group"
                            >
                              <svg
                                className="w-4 h-4 text-amber-500 group-hover:text-amber-400 transition-colors flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                              <span>Bosh Admin Panel</span>
                            </motion.button>
                          </Link>

                          <div className="my-1 border-t border-border/50"></div>

                          <motion.button
                            onClick={() => {
                              clearTokens();
                              setIsAccountMenuOpen(false);
                              router.push("/");
                            }}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 text-left group"
                          >
                            <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-400 transition-colors flex-shrink-0" />
                            <span>Hisobdan chiqish</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Mobile Auth - Buttons for non-logged users */}
            {!isLoggedIn && (
              <div className="sm:hidden flex items-center gap-2">
                <Link href="/admin-login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg font-medium text-xs px-2 py-2 transition-all duration-300 cursor-pointer"
                  >
                    Admin
                  </motion.button>
                </Link>
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-lg bg-white text-black hover:bg-white/80 border border-blue-500 dark:bg-slate-900 dark:text-white dark:border-blue-400 shadow-md font-medium text-xs px-2 py-2 transition-all duration-300 cursor-pointer"
                  >
                    Kirish
                  </motion.button>
                </Link>
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md font-medium text-xs px-2 py-2 transition-all duration-300 cursor-pointer"
                  >
                    Ro'yxat
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <XIcon className="w-5 h-5" />
              ) : (
                <MenuIcon className="w-5 h-5" />
              )}
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
              {/* Mobile Admin Panel Button */}
              {!isLoggedIn && (
                <Link href="/admin-login">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0 }}
                    className="w-full rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg font-medium text-sm px-4 py-2.5 transition-all duration-300 mb-2 cursor-pointer text-center"
                  >
                    Bosh Admin Panel
                  </motion.button>
                </Link>
              )}

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
                      {dropdownCourses.length > 0 ? (
                        dropdownCourses.map((course) => (
                          <a
                            key={course.id}
                            href={course.href}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <course.icon className="w-4 h-4" />
                            <span>{course.title}</span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              ({course.subject})
                            </span>
                          </a>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-xs text-muted-foreground">
                          Kurslar yuklangan'yaponaqdi...
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export const Navbar = memo(NavbarComponent);

const CourseDropdownItem = memo(function CourseDropdownItem({
  course,
  index,
}: {
  course: (typeof courses)[0];
  index: number;
}) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleCourseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      router.push(course.href);
    } else {
      router.push("/register");
    }
  };

  return (
    <motion.div
      onClick={handleCourseClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
        <course.icon className="w-5 h-5 text-blue-400" />
      </div>
      <h4 className="text-sm font-medium text-foreground">
        {course.title}
      </h4>
    </motion.div>
  );
});
