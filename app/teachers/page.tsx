import { Navbar } from "@/components/navbar"
import { TeachersPage } from "@/components/teachers-page"
import { FooterSection } from "@/components/ui/footer-section"

export const metadata = {
  title: "O'qituvchilar - EduGame",
  description: "Bizning tajribali va sertifikali o'qituvchilar haqida ma'lumot",
}

export const dynamic = "force-static"
export const revalidate = 3600

export default function Teachers() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <TeachersPage />
      <FooterSection />
    </main>
  )
}
