"use client"

import { useEffect, useState, useRef } from "react"
import { OrbitalLoader } from "@/components/ui/orbital-loader"

export function PageTransitionLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadDoneRef = useRef(false)

  // Faqat BIRINCHI yuklashda animatsiyani ko'rsatadi
  useEffect(() => {
    if (initialLoadDoneRef.current) return

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    
    timerRef.current = setTimeout(() => {
      setIsLoading(false)
      initialLoadDoneRef.current = true
    }, 800)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-background to-background/80 backdrop-blur-md z-50">
      <OrbitalLoader message="Yuklanmoqda..." messagePlacement="bottom" size="lg" />
    </div>
  )
}
