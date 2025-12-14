"use client"

import React, { memo } from "react"
import { cva } from "class-variance-authority"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const orbitalLoaderVariants = cva("flex gap-4 items-center justify-center", {
  variants: {
    messagePlacement: {
      bottom: "flex-col",
      top: "flex-col-reverse",
      right: "flex-row",
      left: "flex-row-reverse",
    },
  },
  defaultVariants: {
    messagePlacement: "bottom",
  },
})

export interface OrbitalLoaderProps {
  message?: string
  messagePlacement?: "top" | "bottom" | "left" | "right"
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-24 h-24",
}

const orbitalClasses = {
  sm: ["inset-0", "inset-1", "inset-2"],
  md: ["inset-0", "inset-2", "inset-4"],
  lg: ["inset-0", "inset-3", "inset-6"],
}

const Orbit1 = memo(({ orbital }: { orbital: string }) => (
  <motion.div
    className={cn(
      orbital,
      "absolute border-2 border-transparent border-t-primary border-r-primary/50 rounded-full"
    )}
    animate={{ rotate: 360 }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    }}
    style={{ willChange: "transform" }}
  />
))
Orbit1.displayName = "Orbit1"

const Orbit2 = memo(({ orbital }: { orbital: string }) => (
  <motion.div
    className={cn(
      orbital,
      "absolute border-2 border-transparent border-t-primary/70 border-b-primary/30 rounded-full"
    )}
    animate={{ rotate: -360 }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "linear",
    }}
    style={{ willChange: "transform" }}
  />
))
Orbit2.displayName = "Orbit2"

const Orbit3 = memo(({ orbital }: { orbital: string }) => (
  <motion.div
    className={cn(
      orbital,
      "absolute border-2 border-transparent border-t-primary/40 border-l-primary/20 rounded-full"
    )}
    animate={{ rotate: 360 }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "linear",
    }}
    style={{ willChange: "transform" }}
  />
))
Orbit3.displayName = "Orbit3"

const CenterDot = memo(() => (
  <motion.div
    className="absolute inset-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"
    animate={{ scale: [1, 1.2, 1] }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    style={{ willChange: "transform" }}
  />
))
CenterDot.displayName = "CenterDot"

export function OrbitalLoader({
  className,
  message,
  messagePlacement,
  size = "md",
  ...props
}: React.ComponentProps<"div"> & OrbitalLoaderProps) {
  const orbitals = orbitalClasses[size]

  return (
    <div className={cn(orbitalLoaderVariants({ messagePlacement }))}>
      <div className={cn("relative", sizeClasses[size], className)} {...props}>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-transparent blur-xl animate-pulse" />

        <Orbit1 orbital={orbitals[0]} />
        <Orbit2 orbital={orbitals[1]} />
        <Orbit3 orbital={orbitals[2]} />
        <CenterDot />
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-foreground font-medium text-sm md:text-base">
            {message}
          </p>
          <motion.div
            className="flex gap-1 justify-center mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-primary rounded-full"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
                style={{ willChange: "transform" }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
