"use client";

import { useState, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const teachers = [
  {
    id: 1,
    name: "Abdullayev Shavkat",
    subject: "Dasturlash",
    image: "/professional-avatar.png",
    bio: "10+ yillik tajribaga ega",
  },
  {
    id: 2,
    name: "Hamrayeva Gulnoza",
    subject: "Ingliz tili",
    image: "/professional-avatar.png",
    bio: "Sertifikali o'qituvchi",
  },
  {
    id: 3,
    name: "Mirzoev Rustam",
    subject: "Matematika",
    image: "/professional-avatar.png",
    bio: "Fani ustasi",
  },
  {
    id: 4,
    name: "Karimova Dilfuza",
    subject: "Tarix",
    image: "/professional-avatar.png",
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
  const router = useRouter();

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      router.push(`/teachers/${teacher.id}`);
    } else {
      router.push("/register");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-border overflow-hidden flex-shrink-0">
            <Image
              src={teacher.image}
              alt={teacher.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
              priority={index < 2}
              quality={75}
            />
          </div>
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-foreground text-center">
          {teacher.name}
        </h3>

        {/* Subject Badge */}
        <div className="flex justify-center mt-3 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            {teacher.subject}
          </span>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-border"></div>

        {/* Bio */}
        <div className="p-3 bg-primary/5 rounded-lg mb-4 border border-primary/10">
          <p className="text-xs font-semibold text-primary uppercase mb-2">Ta'rif</p>
          <p className="text-sm text-foreground/80">{teacher.bio}</p>
        </div>

        {/* Profile Button */}
        <motion.button
          onClick={handleProfileClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-3 py-2 rounded-lg bg-primary/10 text-primary text-center font-semibold text-sm hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          Profil
        </motion.button>
      </div>
    </motion.div>
  );
});

export { TeachersSection };
