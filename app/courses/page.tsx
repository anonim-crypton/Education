"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, clearTokens } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code2,
  Globe,
  Sigma,
  Clock,
  Gavel,
  Plus,
  BookOpen,
  Languages,
  Calculator,
  History,
  Scale,
  Beaker,
  Atom,
  Leaf,
  Map,
  Play,
} from "lucide-react";

const getCourseIcon = (subject: string) => {
  const subjectLower = subject.toLowerCase();
  if (
    subjectLower.includes("dastur") ||
    subjectLower.includes("code") ||
    subjectLower.includes("program")
  ) {
    return Code2;
  } else if (
    subjectLower.includes("til") ||
    subjectLower.includes("language")
  ) {
    return Languages;
  } else if (
    subjectLower.includes("math") ||
    subjectLower.includes("riyoziy")
  ) {
    return Calculator;
  } else if (
    subjectLower.includes("tarix") ||
    subjectLower.includes("history")
  ) {
    return History;
  } else if (subjectLower.includes("huquq") || subjectLower.includes("law")) {
    return Scale;
  }
  return BookOpen;
};

const defaultCoursesData = [
  { id: "default-1", subject: "Web-Dasturlash", title: "Web Development", icon: Code2, href: "/courses" },
  { id: "default-2", subject: "Matematika", title: "Mathematics", icon: Calculator, href: "/courses" },
  { id: "default-3", subject: "Fizika", title: "Physics", icon: Beaker, href: "/courses" },
  { id: "default-4", subject: "Kimyo", title: "Chemistry", icon: Atom, href: "/courses" },
  { id: "default-5", subject: "Biologiya", title: "Biology", icon: Leaf, href: "/courses" },
  { id: "default-6", subject: "Ingliz-tili", title: "English Language", icon: Globe, href: "/courses" },
  { id: "default-7", subject: "Rus-tili", title: "Russian Language", icon: Languages, href: "/courses" },
  { id: "default-8", subject: "O'zbekiston-tarixi", title: "Uzbekistan History", icon: History, href: "/courses" },
  { id: "default-9", subject: "Geografiya", title: "Geography", icon: Map, href: "/courses" },
];

// Icon mapping from backend to frontend
const iconMap: { [key: string]: any } = {
  code: Code2,
  languages: Globe,
  calculator: Sigma,
  book: Clock,
  scale: Gavel,
  "book-open": BookOpen,
};

interface Teacher {
  id: number;
  username: string;
  full_name: string;
  subject: string;
  avatar: string;
  school: string;
  courses: any[];
}

interface CourseWithTeachers {
  id: string;
  subject: string;
  title: string;
  icon: any;
  href: string;
  teachers?: Teacher[];
}

export default function CoursesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseWithTeachers[]>(defaultCoursesData);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);

      // Avval default courses'larni ko'rsat
      setCourses(defaultCoursesData);
      setLoading(false);

      // Har bir course uchun teachers'ni fetch qilish
      const fetchTeachersForCourses = async () => {
        try {
          const coursesWithTeachers = await Promise.all(
            defaultCoursesData.map(async (course) => {
              try {
                const response = await fetch(
                  `${
                    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
                  }/api/users/courses/${encodeURIComponent(course.subject)}/teachers/`
                );
                const data = await response.json();
                return {
                  ...course,
                  teachers: data.teachers || []
                };
              } catch (err) {
                console.error(`Error fetching teachers for ${course.subject}:`, err);
                return {
                  ...course,
                  teachers: []
                };
              }
            })
          );
          
          setCourses(coursesWithTeachers);
        } catch (err) {
          console.error("Error fetching teachers:", err);
        }
      };

      fetchTeachersForCourses();

      // API'dan kurslar va videolar bilan data fetch qilish
      fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/users/courses/`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
            // API'dan kelgan courses'larni map qilish - unique ID'lar bilan
            const apiCourses = data.courses.map((course: any, index: number) => ({
              id: `api-${course.id}-${index}`, // Unique ID - collision oldini olish
              title: course.teacher || "Unknown",
              subject: course.title || "",
              description: course.description || "",
              icon: getCourseIcon(course.title || ""),
              teacherAvatar: course.teacher_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.teacher}`,
              videos: course.videos || [],
              videosCount: course.videos_count || 0,
              totalViews: course.total_views || 0,
            }));
            // Default courses + API courses = barcha courses chiqadi
            setCourses((prevCourses) => [...prevCourses, ...apiCourses]);
          }
        })
        .catch((err) => {
          console.error("Error fetching courses:", err);
          // API xatosi bo'lsa, default courses'ni saqlab qolish
        });
    }
  }, [router]);

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
          <h1 className="text-4xl font-bold mb-2">Barcha Kurslar</h1>
          <p className="text-lg text-muted-foreground">
            Siz uchun mavjud bo'lgan barcha kurslarni ko'ring va o'qishni boshlang
          </p>
        </motion.div>

        {/* Courses Grid */}
         <div className="space-y-12">
           {courses.map((course, index) => {
             const uniqueKey = `${course.id}-${index}`;
             // Icon'ni course'dan olib, agar bo'lmasa defaultCoursesData'dan topish
             let IconComponent = BookOpen;
             
             if (course.icon) {
               IconComponent = course.icon;
             } else {
               // API'dan data kelsa, subject bo'yicha icon topish
               const defaultCourse = defaultCoursesData.find(c => c.subject === course.subject);
               if (defaultCourse && defaultCourse.icon) {
                 IconComponent = defaultCourse.icon;
               }
             }

             return (
               <motion.div
                 key={uniqueKey}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.4, delay: index * 0.05 }}
                 className="space-y-6"
               >
                 {/* Course Header Card */}
                 <Link href={`/courses/${encodeURIComponent(course.subject)}`}>
                   <div className="bg-card rounded-2xl border border-border hover:border-primary/50 overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col cursor-pointer group">
                     {/* Icon Section */}
                     <div className="p-8 flex justify-center border-b border-border bg-gradient-to-br from-card to-secondary">
                       <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                         <IconComponent className="w-12 h-12 text-primary" />
                       </div>
                     </div>

                     {/* Content Section */}
                     <div className="p-5 flex-1 flex flex-col">
                       {/* Subject Name */}
                       <h4 className="font-bold text-lg text-foreground text-center mb-2 line-clamp-2">
                         {course.subject}
                       </h4>

                       {/* English Title */}
                       <p className="text-xs text-muted-foreground text-center mb-3 line-clamp-1">
                         {course.title}
                       </p>

                       {/* Divider */}
                       <div className="mb-3 border-t border-border"></div>

                       {/* Description (if exists) */}
                       {course.description && (
                         <p className="text-xs text-muted-foreground text-center mb-3 line-clamp-2 flex-1">
                           {course.description}
                         </p>
                       )}

                       {/* Videos Count */}
                       {course.videosCount > 0 && (
                         <p className="text-xs text-blue-500 text-center mb-2">
                           📹 {course.videosCount} ta video
                         </p>
                       )}

                       {/* Start Course Button */}
                       <motion.button
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         className="w-full mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-sm transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-500/30"
                       >
                         <Play className="w-4 h-4" />
                         Kursni boshlash
                       </motion.button>
                     </div>
                   </div>
                 </Link>

                 {/* Teachers Section */}
                 {course.teachers && course.teachers.length > 0 && (
                   <div className="space-y-4">
                     <h5 className="text-lg font-semibold text-foreground ml-4">
                       O'qituvchilar ({course.teachers.length})
                     </h5>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                       {course.teachers.map((teacher) => (
                         <motion.div
                           key={`teacher-${teacher.id}`}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.3 }}
                           className="bg-card rounded-xl border border-border p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                         >
                           {/* Teacher Avatar */}
                           <div className="flex justify-center mb-3">
                             <img
                               src={teacher.avatar}
                               alt={teacher.full_name}
                               className="w-16 h-16 rounded-full border-2 border-primary/20 object-cover"
                             />
                           </div>

                           {/* Teacher Name */}
                           <h6 className="font-semibold text-center text-foreground text-sm mb-1 line-clamp-2">
                             {teacher.full_name}
                           </h6>

                           {/* School */}
                           <p className="text-xs text-muted-foreground text-center mb-3 line-clamp-1">
                             {teacher.school}
                           </p>

                           {/* Courses Count */}
                           {teacher.courses.length > 0 && (
                             <div className="text-center mb-3 p-2 bg-primary/5 rounded-lg">
                               <p className="text-xs text-primary font-semibold">
                                 📚 {teacher.courses.length} ta kurs
                               </p>
                               <p className="text-xs text-muted-foreground mt-1">
                                 {teacher.courses.reduce((sum, c: any) => sum + (c.videos_count || 0), 0)} ta video
                               </p>
                             </div>
                           )}

                           {/* View Profile Button */}
                           <motion.button
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                             className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-primary/80 to-primary/70 hover:from-primary hover:to-primary/80 text-white font-semibold text-xs transition-all duration-300"
                           >
                             Profilni ko'rish
                           </motion.button>
                         </motion.div>
                       ))}
                     </div>
                   </div>
                 )}
               </motion.div>
             );
           })}
         </div>

         {/* Empty State */}
         {courses.length === 0 && !loading && (
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4 }}
             className="text-center py-16"
           >
             <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
             <h2 className="text-2xl font-bold text-foreground mb-2">
               Hozircha kurslar yo'q
             </h2>
             <p className="text-muted-foreground mb-6 max-w-md mx-auto">
               Tez orada yangi o'qituvchilar qo'shiladi. Iltimos kuting yoki boshqa sahifalarga o'ting.
             </p>
             <Link href="/teachers">
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold transition-all duration-300"
               >
                 O'qituvchilar sahifasiga
               </motion.button>
             </Link>
           </motion.div>
         )}
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
                  href="/teachers"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  O'qituvchilar
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
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
