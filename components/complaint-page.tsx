"use client";

import { motion } from "framer-motion";

const ComplaintPage = () => {
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
            Shikoyat va ariza berish
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Agar veb saytda noqulaylik yoki noto'g'ri ishlarni payqasangiz, iltimos, quyidagi forma orqali ariza berinig. Barcha arizalar jiddiy ko'rib chiqiladi.
          </p>
        </motion.div>

        {/* Report Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-2xl p-8 sm:p-12 border border-yellow-200 dark:border-yellow-800"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M9 3v16.5a2.25 2.25 0 002.25 2.25h3.75a2.25 2.25 0 002.25-2.25V3" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground">Shikoyat formasi</h3>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="To'liq ismingiz"
                  className="px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-400 dark:placeholder-gray-500"
                />
                <input
                  type="email"
                  placeholder="Email manzilingiz"
                  className="px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <input
                type="text"
                placeholder="Telefon raqamingiz"
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-400 dark:placeholder-gray-500"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select className="px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-700 dark:text-gray-300">
                  <option value="">Ariza turini tanlang</option>
                  <option value="xavfsizlik">Xavfsizlik masalasi</option>
                  <option value="spam">Spam yoki noto'g'ri foydalanuvchi</option>
                  <option value="noqulaylik">Texnik noqulaylik</option>
                  <option value="boshqa">Boshqa</option>
                </select>

                <select className="px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-700 dark:text-gray-300">
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
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
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
                type="submit"
                className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold shadow-lg transition-all duration-300"
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

export { ComplaintPage };
