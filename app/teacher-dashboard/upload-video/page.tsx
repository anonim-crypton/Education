"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/api";
import { motion } from "framer-motion";
import {
  Upload,
  Video,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface TeacherData {
  id: number;
  subject: string;
  user: {
    first_name: string;
    last_name: string;
    username: string;
  };
}

interface Course {
  id: number;
  title: string;
  description: string;
  lessons: number;
}

export default function UploadVideoPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState<TeacherData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [videoDuration, setVideoDuration] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_file: null as File | null,
    thumbnail: null as File | null,
    course_id: null as number | null,
  });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      fetchTeacherData(token);
      fetchTeacherCourses(token);
    }
  }, [router]);

  const fetchTeacherData = async (token: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/users/teacher/profile/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.teacher) {
          setTeacher(data.teacher);
        }
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherCourses = async (token: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/teacher/courses/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.courses && data.courses.length > 0) {
          setCourses(data.courses);
          // Auto-select first course
          setFormData((prev) => ({
            ...prev,
            course_id: data.courses[0].id,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: "video_file" | "thumbnail"
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        [fileType]: file,
      }));

      // Get video duration if it's a video file
      if (fileType === "video_file" && file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.onloadedmetadata = () => {
          setVideoDuration(Math.round(video.duration));
        };
        video.src = URL.createObjectURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError("");
    setUploadSuccess(false);
    setUploadProgress(0);

    if (!formData.title.trim()) {
      setUploadError("Video sarlavhasi majburiy");
      return;
    }

    if (!formData.video_file) {
      setUploadError("Video faylini tanlang");
      return;
    }

    if (!formData.course_id) {
      setUploadError("Kurs tanlang");
      return;
    }

    if (!teacher) {
      setUploadError("O'qituvchi ma'lumotlari topilmadi");
      return;
    }

    setUploading(true);

    try {
      const token = getAccessToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("subject", teacher.subject);
      formDataToSend.append("teacher_id", teacher.id.toString());
      formDataToSend.append("course_id", formData.course_id.toString());
      formDataToSend.append("video_file", formData.video_file);
      formDataToSend.append("duration", videoDuration.toString());

      if (formData.thumbnail) {
        formDataToSend.append("thumbnail", formData.thumbnail);
      }

      // Simulate progress based on video duration
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            return prev;
          }
          return prev + Math.random() * 30;
        });
      }, 500);

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/lessons/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formDataToSend,
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (res.ok) {
        setUploadSuccess(true);
        setFormData({
          title: "",
          description: "",
          video_file: null,
          thumbnail: null,
          course_id: courses.length > 0 ? courses[0].id : null,
        });
        setVideoDuration(0);

        // Reset form inputs
        const videoInput = document.getElementById(
          "video_file"
        ) as HTMLInputElement;
        const thumbnailInput = document.getElementById(
          "thumbnail"
        ) as HTMLInputElement;
        if (videoInput) videoInput.value = "";
        if (thumbnailInput) thumbnailInput.value = "";

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/teacher-dashboard/lessons");
        }, 2000);
      } else {
        const errorData = await res.json();
        setUploadError(
          errorData.detail || "Video yukladiqda xato ro'y berdi. Iltimos qayta urinib ko'ring."
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Server xatosi. Iltimos qayta urinib ko'ring.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !teacher) {
    return null;
  }

  return (
    <>
      {/* Back Button */}
      <Link href="/teacher-dashboard">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Orqaga qaytish
        </motion.button>
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Video Yuklash</h1>
        <p className="text-muted-foreground">
          "{teacher.subject}" fani uchun yangi video yuklang
        </p>
      </motion.div>

      {/* Teacher Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-6 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {teacher.user?.first_name?.[0] || teacher.user?.username?.[0]}
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {teacher.user?.first_name} {teacher.user?.last_name}
            </p>
            <p className="text-sm text-muted-foreground">
              Fani: <span className="font-medium text-foreground">{teacher.subject}</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Success Message */}
      {uploadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600"
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Muvaffaqiyatli yuklandi!</p>
            <p className="text-sm">Video boshqarish panelga qaytayapti...</p>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {uploadError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Yuklashda xato!</p>
            <p className="text-sm">{uploadError}</p>
          </div>
        </motion.div>
      )}

      {/* Upload Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Video Sarlavhasi *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Masalan: HTML asoslari"
              disabled={uploading}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Tavsif
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Video haqida qisqa tavsif yozing..."
              disabled={uploading}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 resize-none"
            />
          </div>

          {/* Course Selection */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Kurs *
            </label>
            <select
              value={formData.course_id || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  course_id: parseInt(e.target.value) || null,
                }))
              }
              disabled={uploading || courses.length === 0}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
            >
              <option value="">Kurs tanlang...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} ({course.lessons} dars)
                </option>
              ))}
            </select>
            {courses.length === 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Avval kurs yarating, keyin video yuklay olasiz
              </p>
            )}
          </div>

          {/* Video File Upload */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Video Fayli *
            </label>
            <div className="relative">
              <input
                type="file"
                id="video_file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, "video_file")}
                disabled={uploading}
                className="hidden"
              />
              <label
                htmlFor="video_file"
                className="flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors disabled:opacity-50 bg-card/50"
              >
                <Video className="w-8 h-8 text-primary mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Video faylini tanlang
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  MP4, WebM, Ogg va boshqa video formatlar qo'llaniladi
                </p>
                {formData.video_file && (
                   <div className="mt-2 w-full">
                     <p className="text-xs text-green-600 font-semibold mb-2">
                       ✓ {formData.video_file.name}
                     </p>
                     {videoDuration > 0 && (
                       <p className="text-xs text-muted-foreground">
                         Davomiyligi: {Math.floor(videoDuration / 60)}:{String(videoDuration % 60).padStart(2, "0")}
                       </p>
                     )}
                   </div>
                 )}
              </label>
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Thumbnail (Ixtiyoriy)
            </label>
            <div className="relative">
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "thumbnail")}
                disabled={uploading}
                className="hidden"
              />
              <label
                htmlFor="thumbnail"
                className="flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors disabled:opacity-50 bg-card/50"
              >
                <Upload className="w-8 h-8 text-primary mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Thumbnail rasmini tanlang
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG va boshqa rasm formatlar qo'llaniladi
                </p>
                {formData.thumbnail && (
                  <p className="text-xs text-green-600 mt-2 font-semibold">
                    ✓ {formData.thumbnail.name}
                  </p>
                )}
              </label>
            </div>
          </div>

          {/* Upload Progress Bar */}
          {uploading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-foreground">
                  Yuklash jarayoni
                </p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(uploadProgress)}%
                </p>
              </div>
              <div className="w-full h-3 rounded-full bg-border overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                />
              </div>
              {videoDuration > 0 && (
                <p className="text-xs text-muted-foreground">
                  Video davomiyligi: {Math.floor(videoDuration / 60)}:{String(videoDuration % 60).padStart(2, "0")}
                </p>
              )}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={uploading || courses.length === 0}
            whileHover={{ scale: uploading || courses.length === 0 ? 1 : 1.05 }}
            whileTap={{ scale: uploading || courses.length === 0 ? 1 : 0.95 }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Yukladilyapti...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Video Yuklash
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20"
      >
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-blue-600">Eslatma:</span> Siz faqat "{teacher.subject}" fani 
          uchun video yuklay olasiz. Boshqa fanga video yuklay olmaysiz.
        </p>
      </motion.div>
    </>
  );
}
