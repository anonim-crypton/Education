"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Facebook, Instagram, Linkedin, Mail, Send, Twitter } from "lucide-react"
import { useTheme } from "next-themes"

function FooterSection() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkMode = theme === "dark"

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300" suppressHydrationWarning>
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Newsletter Section */}
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Yangiliklar</h2>
            <p className="mb-6 text-muted-foreground">
              Eng yangi kurslar va eksklusiv takliflar uchun bizning newsletter-ga obuna bo'ling.
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Email manzilingiz"
                className="pr-12 backdrop-blur-sm"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Obuna bo'lish</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Tez havolalar</h3>
            <nav className="space-y-2 text-sm">
              <a href="/" className="block transition-colors hover:text-primary">
                Bosh sahifa
              </a>
              <a href="/about" className="block transition-colors hover:text-primary">
                Biz haqimizda
              </a>
              <a href="/courses" className="block transition-colors hover:text-primary">
                Kurslar
              </a>
              <a href="/teachers" className="block transition-colors hover:text-primary">
                O'qituvchilar
              </a>
              <a href="/contact" className="block transition-colors hover:text-primary">
                Aloqa
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Biz bilan bog'lanish</h3>
            <address className="space-y-2 text-sm not-italic">
              <p>Tashkent, Uzbekistan</p>
              <p>Telefon: +998 (99) 123-45-67</p>
              <p>Email: info@edugame.uz</p>
              <p>Vaqti: 09:00 - 18:00</p>
            </address>
          </div>

          {/* Social Links & Theme Toggle */}
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Bizni kuzatib turing</h3>
            <div className="mb-6 flex space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full hover:bg-primary hover:text-primary-foreground"
                      asChild
                    >
                      <a href="#facebook" aria-label="Facebook">
                        <Facebook className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Facebook-da bizni kuzatib turing</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full hover:bg-primary hover:text-primary-foreground"
                      asChild
                    >
                      <a href="#twitter" aria-label="Twitter">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Twitter-da bizni kuzatib turing</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full hover:bg-primary hover:text-primary-foreground"
                      asChild
                    >
                      <a href="#instagram" aria-label="Instagram">
                        <Instagram className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Instagram-da bizni kuzatib turing</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full hover:bg-primary hover:text-primary-foreground"
                      asChild
                    >
                      <a href="#linkedin" aria-label="LinkedIn">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>LinkedIn-da biz bilan ulanish</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <div className="flex items-center space-x-3 pt-4 border-t">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Mavzu:</span>
                <Switch
                  id="theme-toggle"
                  checked={isDarkMode}
                  onCheckedChange={() =>
                    setTheme(isDarkMode ? "light" : "dark")
                  }
                />
                <Label htmlFor="theme-toggle" className="sr-only">
                  Mavzuni o'zgartirish
                </Label>
              </div>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 Edugame. Barcha huquqlar himoyalangan.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="#privacy" className="transition-colors hover:text-primary">
              Maxfiylik siyosati
            </a>
            <a href="#terms" className="transition-colors hover:text-primary">
              Foydalanish shartlari
            </a>
            <a href="#cookies" className="transition-colors hover:text-primary">
              Cookie sozlamalari
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { FooterSection }
