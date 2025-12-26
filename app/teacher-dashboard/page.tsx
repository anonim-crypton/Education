"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  Code,
  Languages,
  Calculator,
  BookA,
  Scale,
  BookOpen,
  Plus,
} from "lucide-react";

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);

  const iconMap: { [key: string]: any } = {
    code: Code,
    languages: Languages,
    calculator: Calculator,
    book: BookA,
    scale: Scale,
    "book-open": BookOpen,
  };

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);

      // Fetch teacher courses
      fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/users/teacher/courses/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.courses) {
            setCourses(data.courses);
          }
        })
        .catch((err) => {
          console.error("Error fetching courses:", err);
          setCourses([]);
        })
        .finally(() => setLoading(false));
    }
  }, [router]);
  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold mb-2">Mening Kurslarim</h1>
        <p className="text-muted-foreground">
          Sizning yaratilgan barcha kurslaringiz
        </p>
      </motion.div>

      {/* Courses Grid */}

      {/* Add Course Button */}
      <div className="mb-8">
        <Link href="/teacher-dashboard/add-course">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Yangi Kurs Qo'shish
          </motion.button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-card border border-dashed border-border rounded-lg"
        >
          <p className="text-muted-foreground mb-4">
            Siz hali hech qanday kurs qo'shmagansiz
          </p>
          <Link href="/teacher-dashboard/add-course">
            <Button className="bg-primary hover:bg-primary/90">
              Birinchi Kurs Qo'shish
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group"
            >
              <div className="bg-card rounded-xl p-4 h-full border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg">
                {/* Teacher Image or Icon */}
                <div className="mb-3 w-full flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {course.teacher_image_url &&
                  course.teacher_image_url !== "/placeholder-user.jpg" ? (
                    <img
                      src={course.teacher_image_url}
                      alt={course.teacher}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center bg-primary/10">
                      {(() => {
                        const IconComponent = course.icon
                          ? iconMap[course.icon]
                          : Code;
                        return IconComponent ? (
                          <IconComponent className="w-6 h-6 text-primary" />
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                  {course.description}
                </p>

                {/* Videos Count */}
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {course.videos_count || course.lessons || 0} video
                  </span>
                </div>

                {/* Course Info */}
                {course.total_views && (
                  <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                    <span>👁 {course.total_views} ko'rish</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
