"use client"

import { useEffect, useRef, useState, ReactNode } from "react"

interface ScrollFadeWrapperProps {
  children: ReactNode
  className?: string
}

export function ScrollFadeWrapper({ children, className = "" }: ScrollFadeWrapperProps) {
  const [opacity, setOpacity] = useState(1)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          const scrollDelta = currentScrollY - lastScrollY

          // Pasga tushsa (down) - opacity kamayadi
          // Tepaga chiqsa (up) - opacity ko'payadi
          if (scrollDelta > 0) {
            // Pasga tushayapti - fade out
            setOpacity((prev) => Math.max(prev - 0.02, 0.3))
          } else if (scrollDelta < 0) {
            // Tepaga chiqayapti - fade in
            setOpacity((prev) => Math.min(prev + 0.02, 1))
          }

          setLastScrollY(currentScrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollY])

  return (
    <div
      className={className}
      style={{
        opacity,
        transition: "opacity 0.3s ease-out",
      }}
      suppressHydrationWarning
    >
      {children}
    </div>
  )
}
