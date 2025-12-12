"use client"

import { motion } from "framer-motion"

interface IconProps {
  className?: string
  isHovered?: boolean
}

export function BookOpenIcon({ className, isHovered }: IconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
        animate={isHovered ? { x: -2 } : { x: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.path
        d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
        animate={isHovered ? { x: 2 } : { x: 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.svg>
  )
}

export function GraduationCapIcon({ className, isHovered }: IconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={isHovered ? { y: -2, rotate: 5 } : { y: 0, rotate: 0 }}
      transition={{ duration: 0.3 }}
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </motion.svg>
  )
}

export function CodeIcon({ className, isHovered }: IconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.polyline
        points="16 18 22 12 16 6"
        animate={isHovered ? { x: 2 } : { x: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.polyline
        points="8 6 2 12 8 18"
        animate={isHovered ? { x: -2 } : { x: 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.svg>
  )
}

export function PaletteIcon({ className, isHovered }: IconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={isHovered ? { rotate: 15 } : { rotate: 0 }}
      transition={{ duration: 0.3 }}
    >
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
    </motion.svg>
  )
}

export function BriefcaseIcon({ className, isHovered }: IconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </motion.svg>
  )
}

export function TrendingUpIcon({ className, isHovered }: IconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.polyline
        points="22 7 13.5 15.5 8.5 10.5 2 17"
        animate={isHovered ? { pathLength: 1 } : { pathLength: 1 }}
        initial={{ pathLength: 0 }}
        transition={{ duration: 0.5 }}
      />
      <motion.polyline
        points="16 7 22 7 22 13"
        animate={isHovered ? { y: -3 } : { y: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.svg>
  )
}

export function LanguagesIcon({ className, isHovered }: IconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={isHovered ? { rotateY: 180 } : { rotateY: 0 }}
      transition={{ duration: 0.4 }}
    >
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </motion.svg>
  )
}

export function HomeIcon({ className, isHovered }: IconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={isHovered ? { y: -2 } : { y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </motion.svg>
  )
}

export function UsersIcon({ className, isHovered }: IconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
        animate={isHovered ? { x: -2 } : { x: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.circle
        cx="9"
        cy="7"
        r="4"
        animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.path
        d="M22 21v-2a4 4 0 0 0-3-3.87"
        animate={isHovered ? { x: 2 } : { x: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.path
        d="M16 3.13a4 4 0 0 1 0 7.75"
        animate={isHovered ? { x: 2 } : { x: 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.svg>
  )
}

export function PhoneIcon({ className, isHovered }: IconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={isHovered ? { rotate: [0, -10, 10, -10, 0] } : { rotate: 0 }}
      transition={{ duration: 0.5 }}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </motion.svg>
  )
}

export function SunIcon({ className }: IconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.3 }}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </motion.svg>
  )
}

export function MoonIcon({ className }: IconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ scale: 0, rotate: 90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.3 }}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </motion.svg>
  )
}

export function ChevronDownIcon({ className, isHovered }: IconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={isHovered ? { rotate: 180 } : { rotate: 0 }}
      transition={{ duration: 0.3 }}
    >
      <path d="m6 9 6 6 6-6" />
    </motion.svg>
  )
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

export function XIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export function PlayIcon({ className, isHovered }: IconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </motion.svg>
  )
}

export function SparklesIcon({ className, isHovered }: IconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={isHovered ? { rotate: 15, scale: 1.1 } : { rotate: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </motion.svg>
  )
}

export function ArrowRightIcon({ className, isHovered }: IconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={isHovered ? { x: 4 } : { x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </motion.svg>
  )
}
