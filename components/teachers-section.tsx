"use client";

import { useState, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const teachers = [
  {
    id: 1,
    name: "Abdullayev Shavkat",
    subject: "Dasturlash",
    image: "/Education.jpg.png",
    bio: "10+ yillik tajribaga ega",
  },
  {
    id: 2,
    name: "Hamrayeva Gulnoza",
    subject: "Ingliz tili",
    image: "/Education.jpg.png",
    bio: "Sertifikali o'qituvchi",
  },
  {
    id: 3,
    name: "Mirzoev Rustam",
    subject: "Matematika",
    image: "/Education.jpg.png",
    bio: "Fani ustasi",
  },
  {
    id: 4,
    name: "Karimova Dilfuza",
    subject: "Tarix",
    image: "/Education.jpg.png",
    bio: "Tarix fani mutaxassisi",
  },
];

const TeachersSection = memo(function TeachersSection() {
  return (
    <section className="w-full pt-24 pb-12 bg-gradient-to-b from-background to-secondary/20" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            O'qituvchilarimiz
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tajribali va sertifikali o'qituvchilar o'z fani bo'yicha bilim beradi
          </p>
        </motion.div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((teacher, index) => (
            <TeacherCard key={teacher.id} teacher={teacher} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <Link href="/teachers">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-lg transition-all duration-300"
            >
              Barcha o'qituvchilarni ko'rish
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

const TeacherCard = memo(function TeacherCard({
  teacher,
  index,
}: {
  teacher: (typeof teachers)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 shadow-lg transition-all duration-300 hover:shadow-2xl">
        {/* Teacher Image */}
        <div className="relative h-64 w-full overflow-hidden bg-secondary">
          <Image
            src={teacher.image}
            alt={teacher.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            priority={index < 2}
            quality={75}
          />
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end"
          >
            <div className="w-full p-4">
              <p className="text-white text-sm italic">{teacher.bio}</p>
            </div>
          </motion.div>
        </div>

        {/* Teacher Info */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-foreground mb-1">
            {teacher.name}
          </h3>
          <p className="text-sm text-primary font-semibold mb-3">
            {teacher.subject}
          </p>
          <Link href={`/teachers/${teacher.id}`}>
            <motion.button
              whileHover={{ x: 4 }}
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
            >
              Profil
              <span className="text-xs">→</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
});

export { TeachersSection };
