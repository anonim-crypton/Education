"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, clearTokens } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  LogOut,
  ArrowRight,
  BookOpen,
  Settings,
  GraduationCap,
  Code,
  Languages,
  Calculator,
  BookA,
  Scale,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);

  // Icon mapping from backend to frontend
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

      // Fetch user profile
      fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/users/profile/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUserData(data.user);
          }
        })
        .catch((err) => console.error(err));

      // Fetch courses from API
      fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/users/courses/`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.courses && data.courses.length > 0) {
            setCourses(data.courses);
          } else {
            // Use default courses if no courses from API
            setCourses(defaultCourses);
          }
        })
        .catch((err) => {
          console.error("Error fetching courses:", err);
          // Fallback to default courses
          setCourses(defaultCourses);
        })
        .finally(() => setLoading(false));
    }
  }, [router]);

  const defaultCourses = [
    {
      id: 1,
      title: "Dasturlash",
      teacher: "Ali Qodirov",
      lessons: 24,
      icon: Code,
      color: "from-blue-600 to-blue-500",
    },
    {
      id: 2,
      title: "Ingliz tili",
      teacher: "Fotima Shodmonova",
      lessons: 18,
      icon: Languages,
      color: "from-green-600 to-green-500",
    },
    {
      id: 3,
      title: "Matematika",
      teacher: "Abdulaziz Olimov",
      lessons: 30,
      icon: Calculator,
      color: "from-purple-600 to-purple-500",
    },
    {
      id: 4,
      title: "Tarix",
      teacher: "Shahlo Karimova",
      lessons: 15,
      icon: BookA,
      color: "from-orange-600 to-orange-500",
    },
    {
      id: 5,
      title: "Huquq",
      teacher: "Oleg Petrov",
      lessons: 12,
      icon: Scale,
      color: "from-red-600 to-red-500",
    },
  ];

  const teachers = [
    {
      id: 1,
      name: "Ali Qodirov",
      age: 32,
      avatar: "/placeholder-user.jpg",
      courses: ["Dasturlash", "Python"],
      experience: "8 yil",
    },
    
    {
      id: 2,
      name: "Fotima Shodmonova",
      age: 28,
      avatar: "/placeholder-user.jpg",
      courses: ["Ingliz tili", "IELTS"],
      experience: "5 yil",
    },
    {
      id: 3,
      name: "Abdulaziz Olimov",
      age: 35,
      avatar: "/placeholder-user.jpg",
      courses: ["Matematika", "Algebra"],
      experience: "10 yil",
    },
    {
      id: 4,
      name: "Shahlo Karimova",
      age: 30,
      avatar: "/placeholder-user.jpg",
      courses: ["Tarix", "O'zbek tarixi"],
      experience: "7 yil",
    },
  ];

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
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
      {/* Navbar from home page */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Buttons Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4 lg:order-2 lg:col-span-1 h-fit lg:pt-16"
          >
            {/* Courses Catalog Button */}
            <Link href="/courses" className="w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
              >
                <BookOpen className="w-5 h-5" />
                <span>Kurslar katalogi</span>
              </motion.button>
            </Link>

            {/* Teachers List Button */}
            <Link href="/teachers" className="w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
              >
                <GraduationCap className="w-5 h-5" />
                <span>O'qituvchilar ro'yxati</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Video Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-3 lg:order-2"
          >
            <div className="bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-indigo-900/30 rounded-2xl p-6 backdrop-blur-sm h-full">
              <h3 className="text-2xl font-bold mb-4">Sayt qanday ishlatiladi?</h3>
              <div className="w-full" style={{ aspectRatio: "16 / 9" }}>
                <iframe
                  className="w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Vebsayt qo'llanmasi"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Courses Catalog Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold mb-8">Kurslar katalogi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {(courses.length > 0 ? courses : defaultCourses).map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group"
              >
                <Link href="/courses">
                   <div className="bg-card rounded-xl p-4 h-full border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg">
                     {/* Teacher Image or Icon */}
                     <div className="mb-3 w-full flex justify-center group-hover:scale-110 transition-transform duration-300">
                       {course.teacher_image_url && course.teacher_image_url !== '/placeholder-user.jpg' ? (
                         <img
                           src={course.teacher_image_url}
                           alt={course.teacher}
                           className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                         />
                       ) : (
                         <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center bg-primary/10">
                           {(() => {
                             // Handle both API icon string and default icon object
                             const iconKey = typeof course.icon === 'string' ? course.icon : 'book-open';
                             const IconComponent = iconMap[iconKey] || Code;
                             return IconComponent ? <IconComponent className="w-6 h-6 text-primary" /> : null;
                           })()}
                         </div>
                       )}
                     </div>

                     {/* Title */}
                     <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                       {course.title}
                     </h3>

                     {/* Teacher */}
                     <p className="text-sm text-muted-foreground mb-2 truncate text-foreground">
                       <span className="font-medium">O'qituvchi:</span>{" "}
                       {course.teacher}
                     </p>

                     {/* Lessons Count */}
                     <div className="flex items-center gap-2 pt-3 border-t border-border">
                       <BookOpen className="w-4 h-4 text-primary" />
                       <span className="text-sm font-medium text-foreground">
                         {course.lessons} dars
                       </span>
                     </div>
                   </div>
                 </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Teachers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold mb-8">Bizning O'qituvchilar</h2>
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: [0, -1200] }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...teachers, ...teachers].map((teacher, index) => (
                <motion.div
                  key={`${teacher.id}-${index}`}
                  className="flex-shrink-0 w-72"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 h-full shadow-md hover:shadow-xl">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                      />
                    </div>

                    {/* Name */}
                    <h3 className="text-xl font-bold text-center text-foreground mb-1">
                      {teacher.name}
                    </h3>

                    {/* Age */}
                    <p className="text-center text-sm text-muted-foreground mb-4">
                      {teacher.age} yosh
                    </p>

                    {/* Courses */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                        O'rgatadigan Fanlari
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {teacher.courses.map((course) => (
                          <span
                            key={course}
                            className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="pt-4 border-t border-border">
                      <p className="text-center text-sm font-semibold text-foreground">
                        <span className="text-primary">Tajribasi:</span>{" "}
                        {teacher.experience}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* User Reviews/Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold mb-8">Foydalanuvchilar fikri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
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
            ].map((review) => (
              <motion.div
                key={review.id}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                    />
                    <h3 className="font-bold text-lg text-foreground">
                      {review.name}
                    </h3>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {review.review}
                  </p>

                  <Link href="/reviews" className="w-full">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                      Batafsil izohlar
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-border">
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
                  <Link href="/courses" className="text-muted-foreground hover:text-primary transition-colors">
                    Kurslar
                  </Link>
                </li>
                <li>
                  <Link href="/teachers" className="text-muted-foreground hover:text-primary transition-colors">
                    O'qituvchilar
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
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
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Aloqa
                  </Link>
                </li>
                <li>
                  <Link href="/complaint" className="text-muted-foreground hover:text-primary transition-colors">
                    Shikoyat
                  </Link>
                </li>
                <li>
                  <Link href="/account-settings" className="text-muted-foreground hover:text-primary transition-colors">
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
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Maxfiylik
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Shartlar
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Saytdan foydalanish
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
