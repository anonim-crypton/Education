"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/api";
import { motion } from "framer-motion";
import {
  Users,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
  Search,
  UserCheck,
  BookOpen,
} from "lucide-react";

interface Student {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  school_name?: string;
  enrolled_courses?: number;
  avatar_url?: string;
}

export default function StudentsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      fetchStudents(token);
    }
  }, [router]);

  const fetchStudents = async (token: string) => {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/users/teacher/students/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.students) {
          setStudents(data.students);
          setFilteredStudents(data.students);
        } else {
          // If endpoint doesn't exist, show empty state
          setStudents([]);
          setFilteredStudents([]);
        }
      } else if (res.status === 404) {
        // Endpoint not available yet, show informational message
        setStudents([]);
        setFilteredStudents([]);
      } else {
        setError("O'quvchilarni yukladiqda xato ro'y berdi");
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Server xatosi");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (student) =>
          student.first_name.toLowerCase().includes(term.toLowerCase()) ||
          student.last_name.toLowerCase().includes(term.toLowerCase()) ||
          student.email.toLowerCase().includes(term.toLowerCase()) ||
          student.username.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">O'quvchilar</h1>
        <p className="text-muted-foreground">
          Sizning kurslariga yozilgan o'quvchilarni ko'rish
        </p>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </motion.div>
      )}

      {/* Search Bar */}
      {students.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="O'quvchi izlash (ismi, emaili yoki login)..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </motion.div>
      )}

      {/* Students List */}
      {students.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-card border border-dashed border-border rounded-lg"
        >
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground mb-4">
            Hozircha sizning kurslariga hech qanday o'quvchi yozilmagan
          </p>
          <p className="text-sm text-muted-foreground">
            Kurs yaratib o'quvchilar uni topganda yozila boshlanadi
          </p>
        </motion.div>
      ) : (
        <>
          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
              >
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  {student.avatar_url ? (
                    <img
                      src={student.avatar_url}
                      alt={student.first_name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                      {student.first_name?.[0] || student.username?.[0]}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {student.first_name} {student.last_name}
                    </h3>
                    <p className="text-xs text-muted-foreground">@{student.username}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm">
                  {/* Email */}
                  <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{student.email}</span>
                  </div>

                  {/* Phone */}
                  {student.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{student.phone}</span>
                    </div>
                  )}

                  {/* School */}
                  {student.school_name && (
                    <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <BookOpen className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{student.school_name}</span>
                    </div>
                  )}

                  {/* Enrolled Courses */}
                  {student.enrolled_courses !== undefined && (
                    <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors pt-2 border-t border-border mt-2">
                      <UserCheck className="w-4 h-4 flex-shrink-0" />
                      <span>{student.enrolled_courses} kurs</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Results Info */}
          {filteredStudents.length !== students.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-muted-foreground mb-4"
            >
              {filteredStudents.length} ta o'quvchi topildi ({students.length} tadan)
            </motion.div>
          )}

          {/* No Results */}
          {filteredStudents.length === 0 && searchTerm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8 bg-card border border-dashed border-border rounded-lg"
            >
              <p className="text-muted-foreground">
                "{searchTerm}" busucha o'quvchi topilmadi
              </p>
            </motion.div>
          )}

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
          >
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">Jami O'quvchilar</p>
              <p className="text-3xl font-bold text-primary">{students.length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">Faol O'quvchilar</p>
              <p className="text-3xl font-bold text-blue-600">
                {students.filter((s) => s.enrolled_courses && s.enrolled_courses > 0)
                  .length}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}
