"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, clearTokens } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code2,
  Globe,
  Sigma,
  Clock,
  Gavel,
  BookOpen,
  Languages,
  Calculator,
  History,
  Scale,
  Beaker,
  Atom,
  Leaf,
  Map,
  Play,
  AlertCircle,
} from "lucide-react";

const getCourseIcon = (subject: string) => {
  const subjectLower = subject.toLowerCase();
  if (
    subjectLower.includes("dastur") ||
    subjectLower.includes("code") ||
    subjectLower.includes("program")
  ) {
    return Code2;
  } else if (
    subjectLower.includes("til") ||
    subjectLower.includes("language") ||
    subjectLower.includes("ingliz")
  ) {
    return Languages;
  } else if (
    subjectLower.includes("math") ||
    subjectLower.includes("riyoziy")
  ) {
    return Calculator;
  } else if (
    subjectLower.includes("tarix") ||
    subjectLower.includes("history")
  ) {
    return History;
  } else if (subjectLower.includes("huquq") || subjectLower.includes("law")) {
    return Scale;
  } else if (subjectLower.includes("fizika") || subjectLower.includes("physics")) {
    return Beaker;
  } else if (subjectLower.includes("kimyo") || subjectLower.includes("chemistry")) {
    return Atom;
  } else if (subjectLower.includes("biologiya") || subjectLower.includes("biology")) {
    return Leaf;
  } else if (subjectLower.includes("geografiya") || subjectLower.includes("geography")) {
    return Map;
  }
  return BookOpen;
};

interface Course {
  id: number;
  subject: string;
  title: string;
  icon: any;
  description?: string;
  teacher?: {
    full_name: string;
    avatar_url?: string;
  };
}

export default function CoursesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      fetchCourses(token);
    }
  }, [router]);

  const fetchCourses = async (token: string) => {
    try {
      setLoading(true);
      setError(null);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // Fetch teachers (har bir teacher uchun kurs ko'rsatish)
      const teachersRes = await fetch(`${baseUrl}/api/teachers/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!teachersRes.ok) {
        throw new Error("O'qituvchilar ma'lumotini yuklab bo'lmagani");
      }

      const teachersData = await teachersRes.json();
      const teacherList = Array.isArray(teachersData) ? teachersData : teachersData.results || [];

      // Transform teachers to courses
      const coursesData: Course[] = teacherList.map((teacher: any) => ({
        id: teacher.id,
        subject: teacher.subject || "Noma'lum",
        title: teacher.full_name || teacher.user?.get_full_name || "Noma'lum",
        icon: getCourseIcon(teacher.subject || ""),
        description: teacher.bio || "",
        teacher: {
          full_name: teacher.full_name || teacher.user?.get_full_name || "Noma'lum",
          avatar_url:
            teacher.user?.avatar_url ||
            teacher.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.user?.username || teacher.id}`,
        },
      }));

      if (coursesData.length === 0) {
        setError("Hozircha o'qituvchilar qo'shilmagan");
        setCourses([]);
      } else {
        setCourses(coursesData);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Kurslar yuklab bo'lmagani. Iltimos keyinroq urinib ko'ring."
      );
      setCourses([]);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">Barcha Kurslar</h1>
          <p className="text-lg text-muted-foreground">
            Siz uchun mavjud bo'lgan barcha kurslarni ko'ring va o'qishni boshlang
          </p>
        </motion.div>

        {/* Error State */}
        {error && courses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 mb-8 flex items-start gap-4"
          >
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-500 mb-1">Xato</h3>
              <p className="text-sm text-amber-400">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => {
              const IconComponent = course.icon || BookOpen;

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group"
                >
                  <Link href={`/courses/${encodeURIComponent(course.subject)}`}>
                    <div className="bg-card rounded-2xl border border-border hover:border-primary/50 overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col cursor-pointer">
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
                          {course.subject}
                        </h4>

                        {/* Teacher Name */}
                        <p className="text-xs text-muted-foreground text-center mb-3 line-clamp-1">
                          {course.teacher?.full_name || "O'qituvchi"}
                        </p>

                        {/* Divider */}
                        <div className="mb-3 border-t border-border"></div>

                        {/* Description (if exists) */}
                        {course.description && (
                          <p className="text-xs text-muted-foreground text-center mb-3 line-clamp-2 flex-1">
                            {course.description}
                          </p>
                        )}

                        {/* Start Course Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-sm transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-500/30"
                        >
                          <Play className="w-4 h-4" />
                          Kursni boshlash
                        </motion.button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Hozircha kurslar yo'q
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Admin panelda o'qituvchi qo'shilmagan. Iltimos admin panelidan o'qituvchi qo'shing.
            </p>
            <a href="http://localhost:8000/admin/" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold transition-all duration-300"
              >
                Admin Panelga O'tish
              </motion.button>
            </a>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 pt-12 border-t border-border max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-foreground">Edugame</h3>
            <p className="text-sm text-muted-foreground">
              Online o'qish platforma - sifatli ta'lim uchun ayni bitta o'rin.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-foreground">Tezkor Havolalar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Dashboard
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
    </div>
  );
}
