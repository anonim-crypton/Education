"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const allTeachers = [
  {
    id: 1,
    name: "Abdullayev Shavkat",
    subject: "Dasturlash",
    image: "/Education.jpg.png",
    bio: "10+ yillik tajribaga ega",
    description: "Python, JavaScript, React va boshqa dasturlash tillarida expertiza",
    experience: "10+ yil",
    students: "250+",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Hamrayeva Gulnoza",
    subject: "Ingliz tili",
    image: "/Education.jpg.png",
    bio: "Sertifikali o'qituvchi",
    description: "IELTS va TOEFL sertifikati bilan, xalqaro standartda ta'lim beradi",
    experience: "8 yil",
    students: "180+",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Mirzoev Rustam",
    subject: "Matematika",
    image: "/Education.jpg.png",
    bio: "Fani ustasi",
    description: "Algebra, geometriya va kalkulusda chuqur bilim va sodda tushuntirish usuli",
    experience: "12 yil",
    students: "300+",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Karimova Dilfuza",
    subject: "Tarix",
    image: "/Education.jpg.png",
    bio: "Tarix fani mutaxassisi",
    description: "Jahon tarixi va o'zbekiston tarixi bo'yicha sohali mutaxassis",
    experience: "9 yil",
    students: "200+",
    rating: 4.7,
  },
  {
    id: 5,
    name: "Nazarov Ali",
    subject: "Fizika",
    image: "/Education.jpg.png",
    bio: "Fizika fani o'qituvchisi",
    description: "Klassik va modern fizika bo'yicha amaliy tajriba bilan ta'lim",
    experience: "11 yil",
    students: "220+",
    rating: 4.8,
  },
  {
    id: 6,
    name: "Yusupova Sabina",
    subject: "Kimyo",
    image: "/Education.jpg.png",
    bio: "Kimyo mutaxassisi",
    description: "Organik va noorganik kimyada sohali bilim va laboratoriya tajribasi",
    experience: "7 yil",
    students: "150+",
    rating: 4.6,
  },
];

function TeachersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeachers = useMemo(() => {
    return allTeachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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
              Tajribali va sertifikali o'qituvchilar tomonidan yuqori sifatli ta'lim
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
          {filteredTeachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTeachers.map((teacher, index) => (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group"
                >
                  <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 shadow-lg hover:shadow-2xl transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-80 w-full overflow-hidden bg-secondary">
                      <Image
                        src={teacher.image}
                        alt={teacher.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        priority={index < 3}
                        quality={80}
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {teacher.name}
                      </h3>
                      <p className="text-lg text-primary font-semibold mb-3">
                        {teacher.subject}
                      </p>

                      <p className="text-sm text-muted-foreground mb-4">
                        {teacher.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-border/50">
                        <div className="text-center">
                          <p className="text-lg font-bold text-primary">
                            {teacher.experience}
                          </p>
                          <p className="text-xs text-muted-foreground">Tajriba</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-primary">
                            {teacher.students}
                          </p>
                          <p className="text-xs text-muted-foreground">O'quvchi</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-primary">
                            {teacher.rating}
                          </p>
                          <p className="text-xs text-muted-foreground">Reyting</p>
                        </div>
                      </div>

                      <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105">
                        Kurs ko'rish
                      </button>
                    </div>
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
                Boshqa so'z bilan qidiring yoki barcha o'qituvchilarni ko'rish uchun izoh o'chirib tashlang
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export { TeachersPage };
