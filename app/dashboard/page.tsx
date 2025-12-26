"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { getAccessToken, clearTokens } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/ui/hero-with-group-of-images-text-and-two-buttons";
import { motion } from "framer-motion";
import {
  LogOut,
  ArrowRight,
  BookOpen,
  Settings,
  GraduationCap,
  Code,
  Languages,
  Calculator,
  BookA,
  Scale,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  // Get appropriate placeholder image based on theme
  const placeholderImage =
    theme === "dark" ? "/placeholder-user.jpg" : "/placeholder-user-light.svg";

  // Icon mapping from backend to frontend
  const iconMap: { [key: string]: any } = {
    code: Code,
    languages: Languages,
    calculator: Calculator,
    book: BookA,
    scale: Scale,
    "book-open": BookOpen,
  };

  const fetchData = async (token: string) => {
    try {
      // Fetch user profile
      const profileRes = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/users/profile/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (profileRes.ok) {
        const contentType = profileRes.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await profileRes.json();
          if (data && data.user) {
            setUserData(data.user);
          }
        }
      } else {
        console.error(
          "Profile fetch failed:",
          profileRes.status,
          profileRes.statusText
        );
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }

    // Fetch courses from API - `/api/users/courses/` dan
    try {
      const coursesRes = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/users/courses/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (coursesRes.ok) {
        const contentType = coursesRes.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await coursesRes.json();
          if (data) {
            let courseList: any[] = [];
            if (
              data.courses &&
              Array.isArray(data.courses) &&
              data.courses.length > 0
            ) {
              courseList = data.courses;
            } else if (Array.isArray(data)) {
              courseList = data;
            } else if (data.results && Array.isArray(data.results)) {
              courseList = data.results;
            } else {
              courseList = defaultCourses;
            }

            // Add teacher_info to each course if available
            const enhancedCourses = courseList.map((course) => ({
              ...course,
              teacher_full_name:
                course.teacher_info?.full_name || course.teacher,
              teacher_bio: course.teacher_info?.bio || course.description,
              teacher_avatar:
                course.teacher_info?.avatar ||
                (course.teacher_image_url ? course.teacher_image_url : null),
            }));

            setCourses(enhancedCourses);
          }
        }
      } else {
        console.error(
          "Courses fetch failed:",
          coursesRes.status,
          coursesRes.statusText
        );
        setCourses(defaultCourses);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses(defaultCourses);
    }

    // Fetch teachers from API
    try {
      const teachersRes = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/teachers/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (teachersRes.ok) {
        const contentType = teachersRes.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await teachersRes.json();
          if (data) {
            console.log("Teachers data:", data);
            if (Array.isArray(data)) {
              setTeachers(data);
            } else if (data.results) {
              setTeachers(data.results);
            }
          }
        }
      } else {
        console.error(
          "Teachers fetch failed:",
          teachersRes.status,
          teachersRes.statusText
        );
      }
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      fetchData(token);
      setLoading(false);

      // Auto-refresh har 5 sekundda
      const interval = setInterval(() => {
        fetchData(token);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [router]);

  const defaultCourses = [
    {
      id: 6,
      title: "Ingliz tili",
      subject: "Ingliz tili",
      description: "Ingliz tili o'rganish",
      icon: Languages,
      lessons: 20,
    },
  ];

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
        {/* Hero Section - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full mb-16"
        >
          <Hero
            coursesCount={courses.length}
            teachersCount={teachers.length}
            studentsCount={1000}
          />
        </motion.div>

        {/* Courses Catalog Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold mb-8">Kurslar katalogi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(courses.length > 0 ? courses : defaultCourses).map(
              (course, index) => {
                // Icon'ni course'dan olib, agar bo'lmasa default'dan topish
                let IconComponent = BookOpen;
                if (course.icon) {
                  IconComponent = course.icon;
                }

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group"
                  >
                    <Link href="/courses">
                      <div className="bg-card rounded-2xl border border-border hover:border-primary/50 overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                        {/* Icon Section */}
                        <div className="p-8 flex justify-center border-b border-border bg-gradient-to-br from-card to-secondary">
                          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="w-12 h-12 text-primary" />
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-5 flex-1 flex flex-col">
                          {/* Subject Name */}
                          <h4 className="font-bold text-lg text-foreground text-center mb-2 line-clamp-2">
                            {course.subject || course.title}
                          </h4>

                          {/* English Title */}
                          <p className="text-xs text-muted-foreground text-center mb-3 line-clamp-1">
                            {course.title}
                          </p>

                          {/* Divider */}
                          <div className="mb-3 border-t border-border"></div>

                          {/* Description (if exists) */}
                          {course.description && (
                            <p className="text-xs text-muted-foreground text-center mb-3 line-clamp-2 flex-1">
                              {course.description}
                            </p>
                          )}

                          {/* Lessons Count */}
                          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                            <BookOpen className="w-4 h-4" />
                            <span>{course.lessons || 0} dars</span>
                          </div>

                          {/* Start Course Button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-sm transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-500/30"
                          >
                            <ArrowRight className="w-4 h-4" />
                            Kursni boshlash
                          </motion.button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              }
            )}
          </div>
        </motion.div>

        {/* Teachers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold mb-8">Bizning O'qituvchilar</h2>
          {teachers.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-border">
              <p className="text-lg text-muted-foreground">
                Hozircha tasdiqlangan o'qituvchilar yo'q
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher, index) => (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col h-full bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700 rounded-xl p-6 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
                >
                  {/* Avatar */}
                  <div className="flex justify-center mb-3">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0"
                    >
                      {teacher.full_name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </motion.div>
                  </div>

                  {/* Name */}
                  <p className="text-center font-semibold text-white text-lg">
                    {teacher.full_name}
                  </p>
                  <p className="text-center text-xs text-zinc-400 mb-3 h-4">
                    {teacher.email}
                  </p>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent mb-3" />

                  {/* Subject */}
                  <p className="text-center text-sm text-blue-300 px-3 py-2 bg-blue-500/10 rounded-lg font-medium mb-4 line-clamp-2">
                    🎓 {teacher.subject}
                  </p>

                  {/* Bio */}
                  <div className="flex-1 flex items-center">
                    <p className="text-center text-xs text-zinc-400 w-full">
                      {teacher.bio || "Bio bo'sh"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* User Reviews/Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold mb-8">Foydalanuvchilar fikri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                id: 1,
                name: "Aziz Karimov",
                avatar: placeholderImage,
                review:
                  "Bu platforma o'z hayotimni o'zgartti! Darslar juda tushunarligunga va o'qituvchilar juda yaxshi. Hammaga tavsiyalayapman!",
              },
              {
                id: 2,
                name: "Dilora Sattarova",
                avatar: placeholderImage,
                review:
                  "Ingliz tilini o'rgandim va endi IELTS imtixoniga tayyor. O'qituvchilar juda professional va yardamchi.",
              },
              {
                id: 3,
                name: "Rustam Abdullayev",
                avatar: placeholderImage,
                review:
                  "Dasturlash darslarini kuzatdim va hozir o'z loyihalarim bo'ylab ishlayapman. Shukriya!",
              },
              {
                id: 4,
                name: "Madina Normatova",
                avatar: placeholderImage,
                review:
                  "Matematika darslar juda aniq va to'la. Imtixonda A oladim. Ajoyib platforma!",
              },
            ].map((review) => (
              <motion.div
                key={review.id}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                    />
                    <h3 className="font-bold text-lg text-foreground">
                      {review.name}
                    </h3>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {review.review}
                  </p>

                  <Link href="/reviews" className="w-full">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                      Batafsil izohlar
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-foreground">
                Edugame
              </h3>
              <p className="text-sm text-muted-foreground">
                Oilam o'qish platforma - sifatli ta'lim uchun ayni bitta o'rin.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4 text-foreground">
                Tezkor Havolalar
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/courses"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Kurslar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/teachers"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    O'qituvchilar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Biz haqimizda
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold mb-4 text-foreground">Resurslar</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Aloqa
                  </Link>
                </li>
                <li>
                  <Link
                    href="/complaint"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Shikoyat
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account-settings"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Sozlamalar
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4 text-foreground">Bog'laning</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: info@edugame.uz</li>
                <li>Telefon: +998 90 123 45 67</li>
                <li>Manzil: Tashkent, O'zbekiston</li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Edugame. Barcha huquqlar himoyalangan.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Maxfiylik
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Shartlar
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Saytdan foydalanish
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
