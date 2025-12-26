"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";

function TeachersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allTeachers, setAllTeachers] = useState<any[]>([
    {
      id: 1,
      user_id: 1,
      username: "abdullayev",
      email: "abdullayev@example.com",
      full_name: "Abdullayev Shavkat",
      subject: "Dasturlash",
      bio: "10+ yillik tajribaga ega bo'lgan dasturlash mutaxassisi",
      avatar_url: null,
      courses: [],
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [expandedTeacher, setExpandedTeacher] = useState<number | null>(null);

  useEffect(() => {
    // Fetch teachers from API
    const fetchTeachers = async () => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
          }/api/teachers/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Teachers API Response:", data);
          const teachers = Array.isArray(data) ? data : data.results || [];

          // Har bir o'qituvchi uchun kurslarni fetch qilish
          const teachersWithCourses = await Promise.all(
            teachers.map(async (teacher: any) => {
              try {
                const coursesRes = await fetch(
                  `${
                    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
                  }/api/teachers/${teacher.id}/courses/`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );
                if (coursesRes.ok) {
                  const coursesData = await coursesRes.json();
                  const courses = Array.isArray(coursesData)
                    ? coursesData
                    : coursesData.results || [];
                  return { ...teacher, courses };
                }
              } catch (error) {
                console.error(
                  `Error fetching courses for teacher ${teacher.id}:`,
                  error
                );
              }
              return { ...teacher, courses: [] };
            })
          );

          console.log("Teachers with courses:", teachersWithCourses);
          setAllTeachers(teachersWithCourses);
        } else {
          console.error("Failed to fetch teachers:", response.status);
          setAllTeachers([]);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setAllTeachers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = useMemo(() => {
    return allTeachers.filter(
      (teacher) =>
        teacher.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allTeachers]);

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      {/* Page Header */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Bizning o'qituvchilar
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Tajribali va sertifikali o'qituvchilar tomonidan yuqori sifatli
              ta'lim
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="O'qituvchi yoki fanni qidiring..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">Yuklanmoqda...</p>
            </div>
          ) : filteredTeachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher, index) => (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group"
                >
                  <div className="p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <AvatarWithFallback
                          src={teacher.avatar || teacher.avatar_url}
                          alt={teacher.full_name}
                          size="lg"
                          className="border-4 border-border bg-gradient-to-br from-blue-500 to-purple-600"
                        />
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-bold text-foreground text-center">
                      {teacher.full_name}
                    </h3>

                    {/* Subject Badge */}
                    <div className="flex justify-center mt-3 mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 gap-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                        {teacher.subject}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="my-4 border-t border-border"></div>

                    {/* Bio */}
                    {teacher.bio && (
                      <div className="p-3 bg-primary/5 rounded-lg mb-4 border border-primary/10">
                        <p className="text-xs font-semibold text-primary uppercase mb-2">
                          Ta'rif
                        </p>
                        <p className="text-sm text-foreground/80">
                          {teacher.bio.substring(0, 60)}...
                        </p>
                      </div>
                    )}

                    {/* Courses Count */}
                    {teacher.courses && teacher.courses.length > 0 && (
                      <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <p className="text-xs font-semibold text-primary uppercase mb-2">
                          📚 Kurslar
                        </p>
                        <div className="space-y-2">
                          {teacher.courses.slice(0, 2).map((course: any) => (
                            <div
                              key={course.id}
                              className="text-xs text-foreground/80 truncate"
                            >
                              • {course.title || course.subject}
                            </div>
                          ))}
                          {teacher.courses.length > 2 && (
                            <p className="text-xs text-primary/70 font-medium">
                              +{teacher.courses.length - 2} ta kurs
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <button className="w-full px-3 py-2 rounded-lg bg-primary/10 text-primary text-center font-semibold text-sm hover:bg-primary/20 transition-colors flex items-center justify-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                      Kursni ko'rish
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-2">
                Qidiruvga mos o'qituvchi topilmadi
              </p>
              <p className="text-sm text-muted-foreground">
                Boshqa so'z bilan qidiring yoki barcha o'qituvchilarni ko'rish
                uchun izoh o'chirib tashlang
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export { TeachersPage };
