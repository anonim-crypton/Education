import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { PageTransitionLoader } from "@/components/page-transition-loader"
import { AIAssistant } from "@/components/ai-assistant"
import { GoogleOAuthProvider } from "@react-oauth/google"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"], 
  preload: true, 
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "EduLearn - Ta'lim Platformasi",
  description: "Zamonaviy onlayn ta'lim platformasi",
  generator: 'v0.app',
  icons: {
    icon: "/Education.jpg.png",
  },
  openGraph: {
    title: "EduLearn - Ta'lim Platformasi",
    description: "Zamonaviy onlayn ta'lim platformasi",
    type: "website",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz" suppressHydrationWarning style={{ colorScheme: "light dark" }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <PageTransitionLoader />
            <AIAssistant />
            {children}
          </ThemeProvider>
        </GoogleOAuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
