"use client";

import { motion } from "framer-motion";

const ContactPage = () => {
  return (
    <section className="w-full min-h-screen pt-24 pb-12 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">
            Biz bilan bog'lanin
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Savollar yoki taklif bo'lsa, biz bilan bog'laning. Sizning xabaringiz uchun tez javob beramiz.
          </p>
        </motion.div>

        {/* Contact Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl p-8 sm:p-12 border border-blue-200 dark:border-blue-800"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Telefon</p>
                  <a href="tel:+998901234567" className="text-muted-foreground hover:text-primary transition-colors">
                    +998 (90) 123-45-67
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Email</p>
                  <a href="mailto:info@education.uz" className="text-muted-foreground hover:text-primary transition-colors">
                    info@education.uz
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Manzil</p>
                  <p className="text-muted-foreground">Toshkent sh, O'zbekiston</p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-11a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Ish vaqti</p>
                  <p className="text-muted-foreground text-sm">Dushanba - Juma: 9:00 - 18:00</p>
                  <p className="text-muted-foreground text-sm">Shanba: 10:00 - 16:00</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="sm:col-span-2">
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Ismingiz"
                    className="px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Telefon raqami"
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                />
                <input
                  type="text"
                  placeholder="Mavzu"
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                />
                <textarea
                  placeholder="Sizning xabari"
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-all"
                ></textarea>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-300"
                >
                  Yuborish
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Social Media Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            Ijtimoiy tarmoqlar
          </h2>
          <div className="flex justify-center gap-6">
            {/* Facebook */}
            <motion.a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </motion.a>

            {/* Telegram */}
            <motion.a
              href="https://telegram.org"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 12.019H3.555V9h3.564v10.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
            </motion.a>

            {/* Instagram */}
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110.001 2.881 1.44 1.44 0 01-.001-2.881z" />
              </svg>
            </motion.a>

            {/* YouTube */}
            <motion.a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </motion.a>
          </div>
        </motion.div>

        {/* Security & Access Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Website Security */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-8 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">Veb saytning xavsizligi</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Veb saytimiz yuqori darajadagi xavsizlik standartlariga muvofiq. Foydalanuvchilar ma'lumotlari maxfiy shufrlanadi va himoyalangan serverlarida saqlanadi.
            </p>
          </div>

          {/* Who Can Use */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">Foydalanuvchilar</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Veb saytda o'qituvchi va o'quvchilar ro'yxatdan o'tishi mumkin. O'qituvchilar uchun qo'shimcha funktsiyalar mavjud. Barcha foydalanuvchilar shartlar va qoidalarni tan olishlari kerak.
            </p>
          </div>
        </motion.div>

        {/* Data Protection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl p-8 sm:p-12 border border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground">Foydalanuvchi ma'lumotlarining xafsizligi va himoyasi</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Ma'lumotlar shufrlanishi</h4>
              <p className="text-sm text-muted-foreground">Barcha shaxsiy ma'lumotlar SSL/TLS texnologiyasi orqali shifrlangan holda uzatiladi va saqlanadi.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Maxfiylik siyosati</h4>
              <p className="text-sm text-muted-foreground">Sizning ma'lumotlaringiz uchinchi tomonlar bilan o'zingizning roziligi siz bo'lganda ulashiladi.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Kirish huquqlari</h4>
              <p className="text-sm text-muted-foreground">Siz istalgan vaqtda o'zingizning ma'lumotlaringizni ko'rishingiz, tahrirlashingiz yoki o'chirishingiz mumkin.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Foydalanuvchi o'rnatmalari</h4>
              <p className="text-sm text-muted-foreground">Profildan ma'lumotlar qabul qilish parametrlarini sozlashingiz mumkin.</p>
            </div>
          </div>
        </motion.div>

        {/* Report Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-2xl p-8 sm:p-12 border border-yellow-200 dark:border-yellow-800"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M9 3v16.5a2.25 2.25 0 002.25 2.25h3.75a2.25 2.25 0 002.25-2.25V3" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground">Shikoyat va ariza berish</h3>
            </div>

            <p className="text-muted-foreground mb-8">
              Agar veb saytda noqulaylik yoki noto'g'ri ishlarni payqasangiz, iltimos, quyidagi forma orqali ariza berinig. Barcha arizalar jiddiy ko'rib chiqiladi.
            </p>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="To'liq ismingiz"
                  className="px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-600 placeholder-gray-400 dark:placeholder-gray-500"
                />
                <input
                  type="email"
                  placeholder="Email manzilingiz"
                  className="px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-600 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <input
                type="text"
                placeholder="Telefon raqamingiz"
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-600 placeholder-gray-400 dark:placeholder-gray-500"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select className="px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-600 text-gray-700 dark:text-gray-300">
                  <option value="">Ariza turini tanlang</option>
                  <option value="xavfsizlik">Xavfsizlik masalasi</option>
                  <option value="spam">Spam yoki noto'g'ri foydalanuvchi</option>
                  <option value="noqulaylik">Texnik noqulaylik</option>
                  <option value="boshqa">Boshqa</option>
                </select>

                <select className="px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-600 text-gray-700 dark:text-gray-300">
                  <option value="">Arizaning darajasi</option>
                  <option value="past">Past</option>
                  <option value="o'rta">O'rta</option>
                  <option value="yuqori">Yuqori</option>
                  <option value="favqulodda">Favqulodda</option>
                </select>
              </div>

              <textarea
                placeholder="Arizaning batafsil tavsifi. Qanday muammo yoki noqulaylikga duch kelganingizni ta'riflab bering."
                rows={6}
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-600 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
              ></textarea>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  className="w-4 h-4 mt-1 rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                />
                <label htmlFor="agree" className="text-sm text-muted-foreground">
                  Arizamni tekshirish jarayoni va natijasini email orqali bilantiring deb roziman.
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold shadow-lg transition-all duration-300"
              >
                Arizani yuborish
              </motion.button>
            </form>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              Sizning arizangiz maxfiy saqlanadi va faqat zarur bo'lgan shaxslar tomonidan ko'rib chiqiladi.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { ContactPage };
