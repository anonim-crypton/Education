import { Navbar } from "@/components/navbar"
import { HeroHeader } from "@/components/hero-header"
import { FeaturesSection } from "@/components/features-section"
import { AboutSection } from "@/components/about-section"
import { TeachersSection } from "@/components/teachers-section"
import { FooterSection } from "@/components/ui/footer-section"

export const dynamic = "force-static"
export const revalidate = 3600

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroHeader />
      <FeaturesSection />
      <AboutSection />
      <TeachersSection />
      <FooterSection />
    </main>
  )
}
