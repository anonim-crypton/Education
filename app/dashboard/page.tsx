"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Blank space - only navbar visible */}
      <div className="pt-20"></div>
    </div>
  );
}
