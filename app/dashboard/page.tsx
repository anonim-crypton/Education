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
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [router]);

  const courses = [
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
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ali",
      courses: ["Dasturlash", "Python"],
      experience: "8 yil",
    },
    
    {
      id: 2,
      name: "Fotima Shodmonova",
      age: 28,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fotima",
      courses: ["Ingliz tili", "IELTS"],
      experience: "5 yil",
    },
    {
      id: 3,
      name: "Abdulaziz Olimov",
      age: 35,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abdulaziz",
      courses: ["Matematika", "Algebra"],
      experience: "10 yil",
    },
    {
      id: 4,
      name: "Shahlo Karimova",
      age: 30,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shahlo",
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group"
              >
                <Link href="/courses">
                  <div className="bg-card rounded-xl p-4 h-full border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${course.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <course.icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>

                    {/* Teacher */}
                    <p className="text-sm text-muted-foreground mb-2 truncate">
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
      </main>
    </div>
  );
}
