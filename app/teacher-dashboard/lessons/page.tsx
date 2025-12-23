"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trash2,
  Play,
  Calendar,
  Eye,
  Star,
  Loader2,
  AlertCircle,
  BookOpen,
  Plus,
} from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  description: string;
  video_url: string;
  course_title: string;
  course_id: number;
  uploaded_date: string;
  created_at: string;
  duration: number;
  views_count: number;
  rating: number;
  teacher_name: string;
  order: number;
}

export default function LessonsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      fetchLessons(token);
    }
  }, [router]);

  const fetchLessons = async (token: string) => {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/lessons/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.lessons) {
          setLessons(data.lessons);
        }
      } else {
        setError("Darslarni yukladiqda xato ro'y berdi");
      }
    } catch (err) {
      console.error("Error fetching lessons:", err);
      setError("Server xatosi");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("uz-UZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
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
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Yuklangan Darslar</h1>
          <p className="text-muted-foreground">
            Sizning yaratilgan barcha videolarni ko'rish va boshqarish
          </p>
        </div>
        <Link href="/teacher-dashboard/upload-video">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Yangi Dars
          </motion.button>
        </Link>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </motion.div>
      )}

      {/* Lessons List */}
      {lessons.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-card border border-dashed border-border rounded-lg"
        >
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground mb-4">
            Siz hali hech qanday dars yuklamagan
          </p>
          <Link href="/teacher-dashboard/upload-video">
            <button className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold transition-colors">
              Birinchi Dars Yuklash
            </button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="flex gap-6">
                {/* Video Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-24 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    {lesson.video_url ? (
                      <a
                        href={lesson.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full h-full hover:bg-black/20 rounded-lg transition-colors"
                      >
                        <Play className="w-8 h-8 text-white" />
                      </a>
                    ) : (
                      <Play className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Lesson Info */}
                <div className="flex-1 min-w-0">
                  {/* Title and Course */}
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Kurs: <span className="font-semibold text-foreground">{lesson.course_title}</span>
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {lesson.description || "Tavsif yo'q"}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {/* Upload Date */}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(lesson.uploaded_date || lesson.created_at)}</span>
                    </div>

                    {/* Duration */}
                    {lesson.duration && (
                      <div className="flex items-center gap-1">
                        <Play className="w-4 h-4" />
                        <span>{formatDuration(lesson.duration)}</span>
                      </div>
                    )}

                    {/* Views */}
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{lesson.views_count || 0} ko'rish</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{lesson.rating || 0} / 5.0</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  {lesson.video_url && (
                    <a
                      href={lesson.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                      title="Video ko'rish"
                    >
                      <Play className="w-5 h-5" />
                    </a>
                  )}
                  <button
                    className="p-2 rounded-lg hover:bg-red-600/10 text-red-600 transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {lessons.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Jami Darslar</p>
            <p className="text-3xl font-bold text-primary">{lessons.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Jami Ko'rishlar</p>
            <p className="text-3xl font-bold text-blue-600">
              {lessons.reduce((sum, l) => sum + (l.views_count || 0), 0)}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">O'rtacha Reyting</p>
            <p className="text-3xl font-bold text-yellow-600">
              {(
                lessons.reduce((sum, l) => sum + (l.rating || 0), 0) / lessons.length
              ).toFixed(1)}
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
}
