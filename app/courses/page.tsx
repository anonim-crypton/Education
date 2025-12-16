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
  Plus,
  BookOpen,
} from "lucide-react";

const defaultCoursesData = [
  {
    id: 1,
    title: "Dasturlash",
    slug: "dasturlash",
    teacher: "Ali Qodirov",
    teacherAge: 32,
    teacherAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ali",
    lessons: 24,
    icon: Code2,
  },
  {
    id: 2,
    title: "Ingliz tili",
    slug: "ingliz-tili",
    teacher: "Fotima Shodmonova",
    teacherAge: 28,
    teacherAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fotima",
    lessons: 18,
    icon: Globe,
  },
  {
    id: 3,
    title: "Matematika",
    slug: "matematika",
    teacher: "Abdulaziz Olimov",
    teacherAge: 35,
    teacherAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abdulaziz",
    lessons: 30,
    icon: Sigma,
  },
  {
    id: 4,
    title: "Tarix",
    slug: "tarix",
    teacher: "Shahlo Karimova",
    teacherAge: 30,
    teacherAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shahlo",
    lessons: 15,
    icon: Clock,
  },
  {
    id: 5,
    title: "Huquq",
    slug: "huquq",
    teacher: "Oleg Petrov",
    teacherAge: 38,
    teacherAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oleg",
    lessons: 12,
    icon: Gavel,
  },
];

// Icon mapping from backend to frontend
const iconMap: { [key: string]: any } = {
  code: Code2,
  languages: Globe,
  calculator: Sigma,
  book: Clock,
  scale: Gavel,
  "book-open": BookOpen,
};

export default function CoursesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>(defaultCoursesData);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);

      // Fetch courses from API
      fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/users/courses/`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.courses && data.courses.length > 0) {
            // Map API courses to frontend format
            const mappedCourses = data.courses.map((course: any) => ({
              ...course,
              slug: course.title.toLowerCase().replace(/\s+/g, "-"),
              teacherAge: 30, // Default if not provided
              teacherAvatar: course.teacher_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.teacher}`,
              icon: iconMap[course.icon] || BookOpen,
            }));
            setCourses(mappedCourses);
          } else {
            setCourses(defaultCoursesData);
          }
        })
        .catch((err) => {
          console.error("Error fetching courses:", err);
          setCourses(defaultCoursesData);
        })
        .finally(() => setLoading(false));
    }
  }, [router]);

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

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {courses.map((course, index) => (
             <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
             >
              <div className="bg-card rounded-2xl border border-border hover:border-primary/50 overflow-hidden transition-all duration-300 hover:shadow-lg h-full">
                {/* Course Header */}
                <div className="bg-card p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <course.icon className="w-9 h-9 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-0.5">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground text-xs">{course.lessons} dars</p>
                    </div>
                  </div>
                </div>

                {/* Teacher Section */}
                <div className="p-4">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">
                    O'qituvchi
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    {/* Avatar */}
                    <img
                      src={course.teacherAvatar}
                      alt={course.teacher}
                      className="w-13 h-13 rounded-full object-cover border-2 border-primary flex-shrink-0"
                    />

                    {/* Teacher Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-foreground mb-0.5">
                        {course.teacher}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {course.teacherAge} yosh
                      </p>
                    </div>
                  </div>

                  {/* Course Title */}
                  <p className="text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
                    <span className="font-semibold text-foreground">Fani:</span> {course.title}
                  </p>

                  {/* Enroll Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold text-xs transition-all duration-300 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Qo'shilish
                  </motion.button>
                </div>
              </div>
            </motion.div>
           ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 pt-12 border-t border-border max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-foreground">Edugame</h3>
            <p className="text-sm text-muted-foreground">
              Oilam o'qish platforma - sifatli ta'lim uchun ayni bitta o'rin.
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
