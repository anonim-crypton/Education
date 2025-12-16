"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/api";
import { motion } from "framer-motion";
import { Upload, Loader, ArrowLeft } from "lucide-react";
import Link from "next/link";

const ICON_OPTIONS = [
  { value: "code", label: "Dasturlash" },
  { value: "languages", label: "Tillar" },
  { value: "calculator", label: "Matematika" },
  { value: "book", label: "Tarix" },
  { value: "scale", label: "Huquq" },
  { value: "book-open", label: "Kitob/Boshqa" },
];

// Kurs nomi bo'yicha icon tanlash
const getIconByCourseName = (title: string): string => {
  const titleLower = title.toLowerCase();

  if (
    titleLower.includes("python") ||
    titleLower.includes("javascript") ||
    titleLower.includes("kod") ||
    titleLower.includes("dastur")
  ) {
    return "code";
  } else if (
    titleLower.includes("ingliz") ||
    titleLower.includes("til") ||
    titleLower.includes("language") ||
    titleLower.includes("arabic")
  ) {
    return "languages";
  } else if (
    titleLower.includes("math") ||
    titleLower.includes("matematika") ||
    titleLower.includes("algebra") ||
    titleLower.includes("geometriya")
  ) {
    return "calculator";
  } else if (
    titleLower.includes("tarix") ||
    titleLower.includes("history") ||
    titleLower.includes("iqtisod")
  ) {
    return "book";
  } else if (
    titleLower.includes("huquq") ||
    titleLower.includes("law") ||
    titleLower.includes("konstitutsiya")
  ) {
    return "scale";
  }

  return "book-open";
};

export default function AddCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    lessons: "1",
    icon: "book-open",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Kurs nomini o'zgartirganda iconni avtomatik o'zgartirish
    if (name === "title") {
      const autoIcon = getIconByCourseName(value);
      setFormData((prev) => ({
        ...prev,
        icon: autoIcon,
      }));
    }

    // Field error'ni olib tashlash
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Kurs nomini kiritingiz";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Kurs izohini kiritingiz";
    }
    if (!imageFile) {
      newErrors.image = "Profil rasmini tanlangiz";
    }
    if (parseInt(formData.lessons) < 1) {
      newErrors.lessons = "Dars soni kamida 1 bo'lishi kerak";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const token = getAccessToken();

    console.log("Starting course creation...");
    console.log("Token:", token);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("lessons", formData.lessons);
      formDataToSend.append("icon", formData.icon);
      formDataToSend.append("teacher", ""); // Empty, will be set by backend
      formDataToSend.append("teacher_image", imageFile as Blob);
      formDataToSend.append("is_active", "true");
      formDataToSend.append("order", "0");

      const apiUrl = `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      }/api/users/teacher/courses/`;
      
      console.log("API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formDataToSend,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers));

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        setErrors(data.errors || { general: "Xato yuz berdi" });
        setIsLoading(false);
        return;
      }

      // Success - dashboard'ga o'tish
      router.push("/teacher-dashboard");
    } catch (err) {
      setErrors({
        general: "Kurs qo'shishda xato yuz berdi. Qayta urinib ko'ring.",
      });
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Link href="/teacher-dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Orqaga</span>
        </Link>
        <h1 className="text-3xl font-bold">Yangi Kurs Qo'shish</h1>
        <p className="text-muted-foreground mt-2">
          Yangi kurs yaratish uchun ma'lumotlarni to'ldiring
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-2xl p-8 space-y-6"
      >
        {/* General Error */}
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-600/10 border border-red-600/30 rounded-lg"
          >
            <p className="text-sm text-red-600">{errors.general}</p>
          </motion.div>
        )}

        {/* Image Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <label className="block text-sm font-semibold text-foreground">
            O'qituvchi Profil Rasmi <span className="text-red-600">*</span>
          </label>

          {/* Image Preview */}
          <div className="flex justify-center">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-0 right-0 p-1 bg-red-600 rounded-full text-white hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center bg-primary/5">
                <Upload className="w-8 h-8 text-primary/50" />
              </div>
            )}
          </div>

          {/* Upload Input */}
          <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-primary/50 rounded-lg hover:border-primary/80 cursor-pointer transition-colors bg-primary/5 hover:bg-primary/10">
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Rasmni tanlang</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              required
            />
          </label>

          {errors.image && (
            <p className="text-xs text-red-600">{errors.image}</p>
          )}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <label className="block text-sm font-semibold text-foreground">
            Kurs Nomi <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Masalan: Python Dasturlashni O'rganamiz"
            className={`w-full px-4 py-3 rounded-lg bg-background border transition-colors ${
              errors.title ? "border-red-600" : "border-border"
            } focus:border-primary outline-none`}
          />
          {errors.title && (
            <p className="text-xs text-red-600">{errors.title}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Icon avtomatik tanlanadi: {ICON_OPTIONS.find(opt => opt.value === formData.icon)?.label}
          </p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <label className="block text-sm font-semibold text-foreground">
            Kurs Haqida <span className="text-red-600">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Kurs nima haqida bo'lganini qisqacha yozing..."
            rows={4}
            className={`w-full px-4 py-3 rounded-lg bg-background border transition-colors ${
              errors.description ? "border-red-600" : "border-border"
            } focus:border-primary outline-none resize-none`}
          />
          {errors.description && (
            <p className="text-xs text-red-600">{errors.description}</p>
          )}
        </motion.div>

        {/* Lessons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <label className="block text-sm font-semibold text-foreground">
            Dars Soni
          </label>
          <input
            type="number"
            name="lessons"
            min="1"
            value={formData.lessons}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg bg-background border transition-colors ${
              errors.lessons ? "border-red-600" : "border-border"
            } focus:border-primary outline-none`}
          />
          {errors.lessons && (
            <p className="text-xs text-red-600">{errors.lessons}</p>
          )}
        </motion.div>

        {/* Icon (Hidden, but shown in preview) */}
        <input type="hidden" name="icon" value={formData.icon} />

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Saqlanmoqda...</span>
            </>
          ) : (
            <span>Kursni Saqlash</span>
          )}
        </motion.button>
      </motion.form>
    </div>
  );
}
