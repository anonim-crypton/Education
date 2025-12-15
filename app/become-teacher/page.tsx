"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getAccessToken } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function BecomeTeacherPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    subject: "",
    qualifications: "",
    experience_years: "",
    bio: "",
    phone: "+998 ",
  });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [router]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters except +
    let cleaned = value.replace(/\D/g, "");
    
    // If it starts with 998, format it
    if (cleaned.length > 0) {
      if (!value.startsWith("+")) {
        // Add +998 if missing
        if (cleaned.length <= 9) {
          cleaned = "998" + cleaned;
        }
      }
      
      // Format: +998 XX-XXX-XX-XX
      if (cleaned.length <= 3) {
        return "+" + cleaned;
      } else if (cleaned.length <= 5) {
        return "+" + cleaned.slice(0, 3) + " " + cleaned.slice(3);
      } else if (cleaned.length <= 8) {
        return "+" + cleaned.slice(0, 3) + " " + cleaned.slice(3, 5) + "-" + cleaned.slice(5);
      } else if (cleaned.length <= 10) {
        return "+" + cleaned.slice(0, 3) + " " + cleaned.slice(3, 5) + "-" + cleaned.slice(5, 8) + "-" + cleaned.slice(8);
      } else {
        return "+" + cleaned.slice(0, 3) + " " + cleaned.slice(3, 5) + "-" + cleaned.slice(5, 8) + "-" + cleaned.slice(8, 10);
      }
    }
    return value;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Apply phone formatting for phone field
    let finalValue = value;
    if (name === "phone") {
      finalValue = formatPhoneNumber(value);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Validation
    if (!formData.full_name.trim()) {
      setErrorMessage("To'liq ism kiritish majburiy");
      setIsSubmitting(false);
      return;
    }
    if (!formData.subject.trim()) {
      setErrorMessage("Fanini kiritish majburiy");
      setIsSubmitting(false);
      return;
    }
    if (!formData.experience_years.trim()) {
      setErrorMessage("Tajribani kiritish majburiy");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = getAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/teachers/apply/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setSuccessMessage("O'qituvchi so'rovingiz muvaffaqiyatli yuborildi!");
        setFormData({
          full_name: "",
          subject: "",
          qualifications: "",
          experience_years: "",
          bio: "",
          phone: "+998 ",
        });
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Xato yuz berdi");
      }
    } catch (error) {
      setErrorMessage("Aloqa xatosi. Iltimos, qaytadan urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Yuklanyapti...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Back Button */}
        <motion.button
          onClick={() => router.back()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Orqaga
        </motion.button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            O'qituvchi bo'lish
          </h1>
          <p className="text-muted-foreground text-lg">
            O'z bilimlaringizni boshqalarni o'rgatish orqali o'zlashtiring
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl border border-border p-8 mb-8"
        >
          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3 text-green-400">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p>{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                To'liq Ism *
              </label>
              <Input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Isim Familiya"
                className="w-full"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                O'qituvchi sifatida nomlanishingiz uchun to'liq ismingiz
              </p>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fan/Predmet *
              </label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Masalan: Matematika, Ingliz tili, Dasturlash"
                className="w-full"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Qaysi fanni o'rgatishni rejalashtiraptyapsiz?
              </p>
            </div>

            {/* Experience Years */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tajriba (yil) *
              </label>
              <Input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full"
                min="0"
                max="70"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                O'qituvchilik tajribangiz necha yil?
              </p>
            </div>

            {/* Qualifications */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Sertifikati/Diplomi
              </label>
              <Input
                type="text"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleInputChange}
                placeholder="Masalan: Bakalavriat (Pedagogika), TEFL sertifikati"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Sizning ta'lim va sertifikatlaringiz (ixtiyoriy)
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Bio/Ta'rif
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="O'zingiz haqida qisqacha ma'lumot. Nima sababli o'qituvchi bo'lishni xohlaysiz?"
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Talabalaringizga nima bera olasiz? (ixtiyoriy)
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Telefon raqami
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+998 99-999-99-99"
                className="w-full"
                maxLength={17}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Format: +998 99-999-99-99 (ixtiyoriy)
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Yuborilmoqda..." : "O'qituvchi so'rovini yuborish"}
            </motion.button>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-foreground">
              <strong>Muhim:</strong> Sizning so'rovingiz adminlar tomonidan ko'rib
              chiqiladi. Tasdiqlangandan so'ng, o'qituvchi sifatida kurs yarata
              olasiz.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
