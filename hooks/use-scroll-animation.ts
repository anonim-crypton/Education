"use client"

import { useEffect, useState, useRef } from "react"

interface ScrollState {
  direction: "up" | "down" | null
  scrollY: number
  isScrolling: boolean
}

export function useScrollAnimation() {
  const [scrollState, setScrollState] = useState<ScrollState>({
    direction: null,
    scrollY: 0,
    isScrolling: false,
  })

  const prevScrollYRef = useRef(0)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const direction = currentScrollY > prevScrollYRef.current ? "down" : "up"

      setScrollState({
        direction,
        scrollY: currentScrollY,
        isScrolling: true,
      })

      prevScrollYRef.current = currentScrollY

      // Scroll tugashi uchun timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setScrollState((prev) => ({
          ...prev,
          isScrolling: false,
        }))
      }, 150)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return scrollState
}
