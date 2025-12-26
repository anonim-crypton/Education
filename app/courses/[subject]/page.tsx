"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAccessToken, clearTokens } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import { BookOpen, Play, ArrowLeft, Star, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Teacher {
  id: number;
  full_name: string;
  subject: string;
  bio: string;
  avatar_url?: string;
  user?: {
    avatar?: string;
    username?: string;
  };
}

interface Video {
  id: number;
  title: string;
  description: string;
  video_file?: string;
  duration?: string;
  views_count?: number;
  rating?: number;
  order?: number;
  teacher_name?: string;
}

export default function CoursePage() {
  const router = useRouter();
  const params = useParams();
  const subject = decodeURIComponent(params.subject as string);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      fetchCourseData(token, subject);
    }
  }, [router, subject]);

  const fetchCourseData = async (token: string, courseSubject: string) => {
    try {
      setLoading(true);
      setError(null);

      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // 1. Fetch kurslar API'dan - kurs title'i subject'ga mos kelsin
      const coursesRes = await fetch(`${baseUrl}/api/users/courses/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        const coursesList = Array.isArray(coursesData.courses)
          ? coursesData.courses
          : [];

        // Course title'i (kurs nomi) subject'ga mos kelsin
        // Title boshida subject bo'lsa match qil (masalan "Ingliz-tili" match "Ingliz-tili - Kurs" bilan)
        const foundCourse = coursesList.find((c: any) => {
          const courseTitle = c.title?.toLowerCase().trim() || "";
          const courseSubjectLower = courseSubject.toLowerCase().trim();
          return (
            courseTitle === courseSubjectLower ||
            courseTitle.startsWith(courseSubjectLower + " ") ||
            courseTitle.includes(courseSubjectLower)
          );
        });

        if (foundCourse) {
          // Teacher info'ni course'dan olib (teacher_info'dan birinchi, keyin fallback)
          const tInfo = foundCourse.teacher_info || {};

          // O'chirilgan yoki bloklangan o'qituvchilarni skip qilish
          if (tInfo.is_deleted || tInfo.is_blocked) {
            // O'chirilgan o'qituvchi - fallback ma'lumot qo'llanish
            const teacherInfo: Teacher = {
              id: foundCourse.id,
              full_name: foundCourse.teacher || "Nomalum",
              subject: foundCourse.title,
              bio: foundCourse.description || "",
              avatar_url:
                foundCourse.teacher_image_url ||
                generateAvatarUrl(foundCourse.teacher),
            };
            setTeacher(teacherInfo);
          } else {
            const teacherInfo: Teacher = {
              id: tInfo.id || foundCourse.id,
              full_name: tInfo.full_name || foundCourse.teacher || "Nomalum",
              subject: tInfo.subject || foundCourse.title,
              bio: tInfo.bio || foundCourse.description || "",
              avatar_url:
                tInfo.avatar ||
                foundCourse.teacher_image_url ||
                generateAvatarUrl(tInfo.username || foundCourse.teacher),
              user: {
                avatar: tInfo.avatar,
                username: tInfo.username,
              },
            };
            setTeacher(teacherInfo);
          }

          // Videolar course'dan
          if (foundCourse.videos && Array.isArray(foundCourse.videos)) {
            setVideos(foundCourse.videos);
          } else {
            setVideos([]);
          }
        } else {
          // Agar course topilmasa, lessons API'dan subject bo'yicha qidirish
          const videosRes = await fetch(
            `${baseUrl}/api/lessons/?subject=${encodeURIComponent(
              courseSubject
            )}`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );

          if (videosRes.ok) {
            const videosData = await videosRes.json();
            const videoList = Array.isArray(videosData)
              ? videosData
              : videosData.results || videosData.lessons || [];

            if (Array.isArray(videoList) && videoList.length > 0) {
              // Videolar'dan teacher info'ni olish
              const firstVideo = videoList[0];
              const teacherInfo: Teacher = {
                id: 0,
                full_name: firstVideo.teacher_name || "Nomalum",
                subject: courseSubject,
                bio: "",
                avatar_url: generateAvatarUrl(firstVideo.teacher_name),
              };
              setTeacher(teacherInfo);
              setVideos(videoList);
            } else {
              setError(`"${courseSubject}" fani uchun videolar topilmadi`);
            }
          } else {
            setError(`"${courseSubject}" fani uchun o'qituvchi topilmadi`);
          }
        }
      } else {
        throw new Error("Kurslar ma'lumotini yuklab bo'lmagani");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching course data:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Kurs ma'lumotini yuklab bo'lmagani"
      );
      setLoading(false);
    }
  };

  // Dummy avatar yaratish (DiceBear API)
  const generateAvatarUrl = (username?: string) => {
    const seed = username || "default";
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      seed
    )}`;
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
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link href="/courses">
            <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" />
              Orqaga qaytish
            </button>
          </Link>
        </motion.div>

        {/* Error State */}
        {error && !teacher && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8 flex items-start gap-4"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-500 mb-1">Xato</h3>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Teacher Info Section */}
        {teacher && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8 mb-12"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg border-4 border-blue-400 overflow-hidden">
                {teacher.avatar_url ? (
                  <img
                    src={teacher.avatar_url}
                    alt={teacher.full_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = generateAvatarUrl(teacher.user?.username);
                    }}
                  />
                ) : (
                  <span>
                    {teacher.full_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                )}
              </div>

              {/* Teacher Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {teacher.full_name}
                </h1>
                <div className="flex flex-col gap-2 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Fani:</span>{" "}
                    {teacher.subject}
                  </p>
                  {teacher.bio && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Bio:
                      </span>{" "}
                      {teacher.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-col gap-4 text-right">
                <div>
                  <p className="text-2xl font-bold text-blue-500">
                    {videos.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Videolar</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-500">4.8</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    Reyting
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Videos Section */}
        {videos.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold mb-8">
              {teacher?.subject || "Kurs"} - Videolar
            </h2>

            {/* Videos Grid - 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group h-full"
                >
                  <div className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                    {/* Thumbnail / Placeholder */}
                    <div className="relative overflow-hidden bg-gray-900 h-48 flex items-center justify-center group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white fill-white opacity-50" />
                      </div>
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-12 h-12 text-white fill-white" />
                      </div>

                      {/* Duration Badge (if available) */}
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col">
                      {/* Title */}
                      <h3 className="font-bold text-sm text-foreground mb-2 line-clamp-2">
                        {video.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground mb-3 flex-1 line-clamp-2">
                        {video.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                        <span className="flex items-center gap-1">
                          👁 {(video.views_count || 0).toLocaleString()}
                        </span>
                        {video.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            {video.rating}
                          </span>
                        )}
                      </div>

                      {/* Watch Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-sm transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-500/30"
                      >
                        <Play className="w-3 h-3" />
                        Ko'rish
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center py-12 bg-card rounded-xl border border-border"
          >
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Hozircha videolar yo'q
            </h2>
            <p className="text-muted-foreground">
              {teacher
                ? `${teacher.subject} kursi uchun videolar qo'shilmagan`
                : "Bu kurs uchun videolar qo'shilmagan"}
            </p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 pt-12 border-t border-border max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-foreground">Edugame</h3>
            <p className="text-sm text-muted-foreground">
              Online o'qish platforma - sifatli ta'lim uchun ayni bitta o'rin.
            </p>
          </div>

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
                  href="/courses"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Kurslar
                </Link>
              </li>
            </ul>
          </div>

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
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-foreground">Bog'laning</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: info@edugame.uz</li>
              <li>Telefon: +998 90 123 45 67</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Edugame. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </footer>
    </div>
  );
}
