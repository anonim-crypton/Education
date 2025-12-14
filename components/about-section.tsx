"use client"

import { motion } from "framer-motion"
import { CheckCircleIcon } from "lucide-react"

const benefits = [
  "Boshlang'ich dan o'ta ilg'or darajagacha o'qish imkoniyati",
  "Haqiqiy loyihalar bilan amaliy tajriba",
  "24/7 support va community forum",
  "Sekin sekin o'rganish (self-paced) imkoniyati",
  "Yillik 10,000+ talaba bilan birga o'qish",
  "100% online va jami vaqtda qulaylik",
]

export function AboutSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Biz haqimizda
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              <span className="text-primary font-semibold">Edugame</span> - O'zbekiston va butun dunyo bo'ylab talabalarni zamonaviy texnologiyalar bilan tanishtiradigan onlayn ta'lim platformasi.
            </p>
            <p className="text-muted-foreground text-lg mb-8">
              Biz texnologiyani o'rganishni oson, qulay va har kimga ma'sul qilish uchun shodmonmand. Sizning maqsadingiz bizning maqsadimiz.
            </p>

            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircleIcon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { number: "50+", label: "Zamonaviy Kurs" },
              { number: "10K+", label: "Faol Talaba" },
              { number: "500+", label: "O'qituvchi" },
              { number: "95%", label: "Muvaffaqiyat Darajasi" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}
