"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getAccessToken, clearTokens } from "@/lib/api";
import {
  HomeIcon,
  BookOpenIcon,
  GraduationCapIcon,
  UsersIcon,
  PhoneIcon,
  MenuIcon,
  XIcon,
} from "@/components/animated-icons";
import { Bell, LogOut, User } from "lucide-react";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";

const navLinks = [
  { title: "Bosh sahifa", href: "/dashboard", icon: HomeIcon },
  { title: "Kurslar", href: "/courses", icon: BookOpenIcon },
  { title: "O'qituvchilar", href: "/teachers", icon: GraduationCapIcon },
  { title: "Biz haqimizda", href: "/about", icon: UsersIcon },
  { title: "Aloqa", href: "/contact", icon: PhoneIcon },
];

interface TeacherRequest {
  id: number;
  full_name: string;
  email: string;
  subject: string;
  bio: string;
  status: string;
}

const AdminNavbarComponent = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [teacherRequests, setTeacherRequests] = useState<TeacherRequest[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

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

  // Handle account menu click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    if (isAccountMenuOpen || isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAccountMenuOpen, isNotificationsOpen]);

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

      // Fetch pending teacher requests
      fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/teachers/?status=pending`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setTeacherRequests(data);
            setUnreadCount(data.length);
          } else if (data.results && Array.isArray(data.results)) {
            setTeacherRequests(data.results);
            setUnreadCount(data.results.length);
          }
        })
        .catch((err) => console.error("Error fetching teacher requests:", err));

      // Auto-refresh every 5 seconds
      const interval = setInterval(() => {
        fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
          }/api/teachers/?status=pending`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setTeacherRequests(data);
              setUnreadCount(data.length);
            } else if (data.results && Array.isArray(data.results)) {
              setTeacherRequests(data.results);
              setUnreadCount(data.results.length);
            }
          })
          .catch((err) => console.error("Error fetching teacher requests:", err));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, []);

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
            href="/dashboard"
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
              <motion.a
                key={link.title}
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
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <>
                {/* Notifications Bell */}
                <div className="relative" ref={notificationsRef}>
                  <motion.button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2.5 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <Bell className="w-5 h-5 text-foreground" />
                    {unreadCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Notifications Dropdown */}
                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.92 }}
                        transition={{ duration: 0.25 }}
                        className="absolute top-full right-0 mt-3 w-96 max-h-96 bg-background rounded-2xl shadow-2xl border border-border overflow-hidden backdrop-blur-sm z-50"
                      >
                        {/* Header */}
                        <div className="p-4 bg-card border-b border-border">
                          <h3 className="font-bold text-foreground">
                            O'qituvchi so'rovnomalar
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            Tasdiqlash kutayotgan: {unreadCount}
                          </p>
                        </div>

                        {/* Requests List */}
                        <div className="overflow-y-auto max-h-80">
                          {teacherRequests.length > 0 ? (
                            teacherRequests.map((request) => (
                              <motion.div
                                key={request.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 border-b border-border/50 hover:bg-secondary transition-colors cursor-pointer"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    {request.full_name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-foreground">
                                      {request.full_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {request.email}
                                    </p>
                                    <p className="text-xs text-blue-400 mt-1">
                                      📚 {request.subject}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="p-8 text-center flex flex-col items-center justify-center gap-2"
                            >
                              <div className="text-4xl">📭</div>
                              <p className="text-sm font-medium text-foreground">
                                Hozircha so'rovnoma yo'q
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Yangi so'rovnomalar bu yerda ko'rinadi
                              </p>
                            </motion.div>
                          )}
                        </div>

                        {/* Footer - Show link to all requests */}
                        <AnimatePresence>
                          {teacherRequests.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="p-3 bg-card border-t border-border"
                            >
                              <Link
                                href="/teachers"
                                className="block text-center text-sm font-medium text-primary hover:underline"
                              >
                                Barcha so'rovnomalarni ko'rish
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

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
                    <AvatarWithFallback
                      src={userData?.avatar_url}
                      alt="Avatar"
                      size="sm"
                    />
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
                        className="absolute top-full right-0 mt-3 min-w-72 max-w-96 bg-background rounded-2xl shadow-2xl border border-border overflow-hidden backdrop-blur-sm z-50"
                      >
                        {/* Header Section */}
                        <div className="p-4 bg-card border-b border-border">
                          <div className="flex items-center gap-3 mb-3">
                            <AvatarWithFallback
                              src={userData?.avatar_url}
                              alt="Avatar"
                              size="md"
                            />
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
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.title}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                  {link.title}
                </motion.a>
              ))}
              {isLoggedIn && (
                <motion.button
                  onClick={() => {
                    clearTokens();
                    router.push("/");
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors font-medium text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Chiqish
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export const AdminNavbar = AdminNavbarComponent;
