"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { HeroHeader } from "@/components/hero-header";
import { FeaturesSection } from "@/components/features-section";
import { AboutSection } from "@/components/about-section";
import { TeachersSection } from "@/components/teachers-section";
import { FooterSection } from "@/components/ui/footer-section";
import { getAccessToken } from "@/lib/api";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Agar token saqlanib bo'lsa, dashboard ga redirect qil
    const token = getAccessToken();
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroHeader />
      <FeaturesSection />
      <AboutSection />
      <TeachersSection />
      <FooterSection />
    </main>
  );
}
