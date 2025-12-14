"use client"

import { motion } from "framer-motion"
import { BookOpenIcon, UsersIcon, TrendingUpIcon, LockIcon } from "lucide-react"

const features = [
  {
    title: "Professional Kurslar",
    description: "Python, JavaScript, React va boshqa zamonaviy texnologiyalarni o'rganing",
    icon: BookOpenIcon,
  },
  {
    title: "Sertifikatsiya",
    description: "Har bir kurs tugagach sertifikat oling va ish topishni osonlashtiring",
    icon: TrendingUpIcon,
  },
  {
    title: "Live Darslar",
    description: "O'qituvchilar bilan bevosita suhbat qiling va savollaringizga javob oling",
    icon: UsersIcon,
  },
  {
    title: "Xavfsiz O'qish",
    description: "Sizning shaxsiy ma'lumotlaringiz to'liq himoyalangan",
    icon: LockIcon,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nega <span className="text-primary">Edugame</span> ni tanlash kerak?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Biz sizga zamonaviy ta'lim bilan omon bo'lish va ish topishni osonlashtirish uchun to'liq yechim taqdim etamiz
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
