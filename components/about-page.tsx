"use client";

import { useState, memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircleIcon, Linkedin, Twitter, Mail } from "lucide-react";

const teamMembers = [
  {
    id: 1,
    name: "Alisher Karimov",
    role: "Asos Ishlab Chiquvchi",
    bio: "Full-stack developer, 8+ yil tajriba",
    image: "/Education.jpg.png",
    expertise: ["React", "Node.js", "Python"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "alisher@edugame.uz",
    },
  },
  {
    id: 2,
    name: "Nilufar Abdullayeva",
    role: "Dizayner",
    bio: "UI/UX designer, zamonaviy interfeys yaratadi",
    image: "/Education.jpg.png",
    expertise: ["Figma", "UI Design", "Branding"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "nilufar@edugame.uz",
    },
  },
  {
    id: 3,
    name: "Rustam Khodjaev",
    role: "Backend Lead",
    bio: "Server architecture va database dizayner",
    image: "/Education.jpg.png",
    expertise: ["PostgreSQL", "Docker", "AWS"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "rustam@edugame.uz",
    },
  },
  {
    id: 4,
    name: "Zainab Yusupova",
    role: "Product Manager",
    bio: "Mahsulot strategiyasi va taraqqiyot",
    image: "/Education.jpg.png",
    expertise: ["Product Strategy", "Analytics", "User Research"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "zainab@edugame.uz",
    },
  },
  {
    id: 5,
    name: "Akmal Umarov",
    role: "Frontend Lead",
    bio: "Modern web technologies specialist",
    image: "/Education.jpg.png",
    expertise: ["Next.js", "TypeScript", "Tailwind"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "akmal@edugame.uz",
    },
  },
  {
    id: 6,
    name: "Sabina Mirzaeva",
    role: "QA Engineer",
    bio: "Test automation va quality assurance",
    image: "/Education.jpg.png",
    expertise: ["Testing", "Automation", "CI/CD"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "sabina@edugame.uz",
    },
  },
];

const missionValues = [
  {
    title: "Missiya",
    description: "Har bir talabaga zamonaviy texnologiyalarni o'rganish imkoniyatini berish",
  },
  {
    title: "Vizyon",
    description: "Dunyo bo'ylab eng yaxshi onlayn ta'lim platformasi bo'lish",
  },
  {
    title: "Qiymatlar",
    description: "Sifat, innovatsiya va talabalar o'rtasidagi munosabatlarga e'tibor",
  },
];

const AboutPage = memo(function AboutPage() {
  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Biz haqimizda
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              EduGame - O'zbekiston va butun dunyo bo'ylab talabalarni zamonaviy texnologiyalar bilan tanishtiradigan onlayn ta'lim platformasi
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {missionValues.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all"
              >
                <h3 className="text-2xl font-bold text-primary mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-lg">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Bizning Jamoa
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Talantli va shodmonand muhandislar, dizaynerlar va menejerlardan tashkil topgan jamoa
            </p>
          </motion.div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { number: "50+", label: "Zamonaviy Kurs" },
              { number: "10K+", label: "Faol Talaba" },
              { number: "500+", label: "O'qituvchi" },
              { number: "95%", label: "Muvaffaqiyat" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 text-center border border-primary/20"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
});

const TeamMemberCard = memo(function TeamMemberCard({
  member,
  index,
}: {
  member: (typeof teamMembers)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Image */}
        <div className="relative h-64 w-full overflow-hidden bg-secondary">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            priority={index < 3}
            quality={80}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-1">
            {member.name}
          </h3>
          <p className="text-primary font-semibold mb-3 text-sm">
            {member.role}
          </p>
          <p className="text-muted-foreground text-sm mb-4">
            {member.bio}
          </p>

          {/* Expertise Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {member.expertise.map((skill) => (
              <span
                key={skill}
                className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex gap-3 pt-4 border-t border-border/50">
            <a
              href={member.social.linkedin}
              className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={member.social.twitter}
              className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${member.social.email}`}
              className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export { AboutPage };
