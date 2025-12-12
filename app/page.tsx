import { Navbar } from "@/components/navbar"
import { HeroHeader } from "@/components/hero-header"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroHeader />
    </main>
  )
}
