import { Navbar } from "@/components/navbar"
import { AboutPage } from "@/components/about-page"
import { FooterSection } from "@/components/ui/footer-section"

export const metadata = {
  title: "Biz haqimizda - EduGame",
  description: "Edugame jamoa va missiyasi haqida ma'lumot",
}

export const dynamic = "force-static"
export const revalidate = 3600

export default function About() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <AboutPage />
      <FooterSection />
    </main>
  )
}
