"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";

interface Review {
  id: number;
  name: string;
  avatar: string;
  review: string;
}

export default function ReviewsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      name: "Aziz Karimov",
      avatar: "/placeholder-user.jpg",
      review: "Bu platforma o'z hayotimni o'zgartti! Darslar juda tushunarligunga va o'qituvchilar juda yaxshi. Hammaga tavsiyalayapman!",
    },
    {
      id: 2,
      name: "Dilora Sattarova",
      avatar: "/placeholder-user.jpg",
      review: "Ingliz tilini o'rgandim va endi IELTS imtixoniga tayyor. O'qituvchilar juda professional va yardamchi.",
    },
    {
      id: 3,
      name: "Rustam Abdullayev",
      avatar: "/placeholder-user.jpg",
      review: "Dasturlash darslarini kuzatdim va hozir o'z loyihalarim bo'ylab ishlayapman. Shukriya!",
    },
    {
      id: 4,
      name: "Madina Normatova",
      avatar: "/placeholder-user.jpg",
      review: "Matematika darslar juda aniq va to'la. Imtixonda A oladim. Ajoyib platforma!",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    review: "",
    avatar: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const MAX_WORDS = 300;

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    
    if (words <= MAX_WORDS) {
      setFormData({ ...formData, review: text });
      setWordCount(words);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.review.trim()) {
      alert("Iltimos ism va izohni to'ldiring");
      return;
    }

    const newReview: Review = {
      id: reviews.length + 1,
      name: formData.name,
      avatar: preview || "/placeholder-user.jpg",
      review: formData.review,
    };

    setReviews([...reviews, newReview]);
    setFormData({ name: "", review: "", avatar: null });
    setPreview(null);
    setWordCount(0);
    setShowForm(false);
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
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">Foydalanuvchilar Izohlari</h1>
          <p className="text-lg text-muted-foreground">
            O'quv platformamiz haqidagi foydalanuvchilar fikrini o'qing
          </p>
        </motion.div>

        {/* Add Review Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          onClick={() => setShowForm(!showForm)}
          className="mb-8 flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Izoh qo'shish
        </motion.button>

        {/* Add Review Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto bg-card rounded-xl p-5 border border-border mb-12"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Izoh qo'shish</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-muted rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-foreground">
                  Ismingiz
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ism va familiyangizni kiriting"
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-primary outline-none transition-all text-sm text-foreground"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold mb-2 text-foreground">
                  Rasm yuklash
                </label>
                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-b from-blue-500 to-purple-600 hover:shadow-lg active:shadow-md text-white font-semibold text-sm transition-all duration-300 cursor-pointer shadow-lg hover:shadow-purple-400/50 active:shadow-purple-500/50">
                    <svg viewBox="0 0 640 512" fill="white" height="1.2em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"></path>
                    </svg>
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                    />
                  )}
                </div>
              </div>

              {/* Review Textarea */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-foreground">
                    Izoh ({wordCount}/{MAX_WORDS} so'z)
                  </label>
                  <span className={`text-xs ${wordCount > MAX_WORDS * 0.9 ? "text-orange-500" : "text-muted-foreground"}`}>
                    {MAX_WORDS - wordCount} qoldi
                  </span>
                </div>
                <textarea
                  value={formData.review}
                  onChange={handleReviewChange}
                  placeholder="O'quv platformamiz haqidagi fikringizni yozing..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-primary outline-none transition-all text-sm text-foreground resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-2 pt-2 justify-center w-full max-w-xs mx-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all duration-300 cursor-pointer"
                >
                  Yuborish
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-all duration-300 cursor-pointer"
                >
                  Bekor
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 h-full shadow-md hover:shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                  />
                  <h3 className="font-bold text-lg text-foreground">
                    {review.name}
                  </h3>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {review.review}
                </p>
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
