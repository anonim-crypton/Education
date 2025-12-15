"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Flag,
  Shield,
  AlertTriangle,
  Wrench,
  MessageSquare,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";

interface Particle {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

const reportTypes = [
  { value: "", label: "Ariza turini tanlang", icon: Flag },
  { value: "xavfsizlik", label: "Xavfsizlik masalasi", icon: Shield },
  {
    value: "spam",
    label: "Spam yoki noto'g'ri foydalanuvchi",
    icon: AlertTriangle,
  },
  { value: "noqulaylik", label: "Texnik noqulaylik", icon: Wrench },
  { value: "boshqa", label: "Boshqa", icon: MessageSquare },
];

const priorityLevels = [
  { value: "", label: "Arizaning darajasi", icon: Flag },
  { value: "past", label: "Past", icon: TrendingDown },
  { value: "o'rta", label: "O'rta", icon: Flag },
  { value: "yuqori", label: "Yuqori", icon: TrendingUp },
  { value: "favqulodda", label: "Favqulodda", icon: Zap },
];

const CustomSelect = ({ options, value, onChange, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt: any) => opt.value === value);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-orange-600 text-foreground cursor-pointer text-left flex items-center justify-between hover:border-orange-600 transition-all duration-200 text-sm"
      >
        <span className="text-sm">{selectedOption?.label || placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-10"
        >
          {options.map((option: any) => {
            return (
              <motion.button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg text-foreground"
                whileHover={{ x: 2 }}
              >
                {option.label}
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default function ComplaintPage() {
  const [reportType, setReportType] = useState("");
  const [priority, setPriority] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    agree: false,
  });

  useEffect(() => {
    const generatedParticles: Particle[] = [...Array(8)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 4 + Math.random() * 2,
      delay: Math.random() * 1,
    }));
    setParticles(generatedParticles);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      console.log("Complaint Form:", {
        ...formData,
        reportType,
        priority,
      });
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        agree: false,
      });
      setReportType("");
      setPriority("");
      setIsLoading(false);
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      <section className="relative pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Shikoyat va <span className="text-orange-600">ariza berish</span>
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              Agar veb saytda noqulaylik yoki noto'g'ri ishlarni payqasangiz,
              iltimos, quyidagi forma orqali ariza berinig.
            </p>
          </motion.div>

          {/* Report Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-xl p-6 border border-border shadow-lg"
          >
            <h2 className="text-lg font-bold text-foreground mb-5">
              Shikoyat formasi
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Ismingiz
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ismingiz"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-orange-600 placeholder-gray-400 dark:placeholder-gray-500 text-foreground text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-orange-600 placeholder-gray-400 dark:placeholder-gray-500 text-foreground text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Telefon
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Telefon raqami"
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-orange-600 placeholder-gray-400 dark:placeholder-gray-500 text-foreground text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Ariza turi
                  </label>
                  <CustomSelect
                    options={reportTypes}
                    value={reportType}
                    onChange={setReportType}
                    placeholder="Turini tanlang"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Darajasi
                  </label>
                  <CustomSelect
                    options={priorityLevels}
                    value={priority}
                    onChange={setPriority}
                    placeholder="Darajasini tanlang"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Tavsifi
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Muammoni ta'riflab bering..."
                  rows={4}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-orange-600 placeholder-gray-400 dark:placeholder-gray-500 text-foreground text-sm resize-none"
                ></textarea>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agree"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 rounded border-border text-orange-600 focus:ring-orange-600"
                />
                <label
                  htmlFor="agree"
                  className="text-xs text-muted-foreground"
                >
                  Arizamni tekshirish jarayonini email orqali bilantiring deb
                  roziman.
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium text-sm shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  "Yuborish"
                )}
              </motion.button>

              {/* Success Message */}
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-2 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-xs text-center"
                >
                  ✓ Arizangiz yuborildi!
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
