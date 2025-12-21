"use client";

import { BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface HeroProps {
  coursesCount?: number;
  teachersCount?: number;
  studentsCount?: number;
}

function Hero({ coursesCount = 0, teachersCount = 0, studentsCount = 0 }: HeroProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + '+';
    }
    return num + '+';
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 items-stretch lg:grid-cols-2 h-full">
          {/* Content Section */}
          <div className="flex gap-12 flex-col justify-start pt-0">
          
            <div className="flex gap-6 flex-col">
              <h1 className="text-5xl md:text-6xl lg:text-5xl tracking-tight text-left font-bold leading-tight text-foreground">
                Sayt qanday ishlaydi?
              </h1>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground text-left max-w-md">
                Sifatli ta'lim, turli kurslar, tajribali o'qituvchilar bilan o'rganing
              </p>
            </div>
            
            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/courses" className="flex-1 sm:flex-initial">
                <Button size="lg" className="gap-2 w-full px-8 py-6 text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <BookOpen className="w-6 h-6" />
                  <span>Kurslar</span>
                </Button>
              </Link>
              <Link href="/teachers" className="flex-1 sm:flex-initial">
                <Button size="lg" className="gap-2 w-full px-8 py-6 text-base font-semibold rounded-lg border-2 border-primary/30 hover:border-primary/60 bg-transparent hover:bg-primary/5 transition-all duration-300" variant="outline">
                  <GraduationCap className="w-6 h-6" />
                  <span>O'qituvchilar</span>
                </Button>
              </Link>
         
            </div>

     
            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="bg-card border border-border rounded-lg p-6 flex items-center justify-center hover:border-primary/40 transition-all duration-300">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary">{formatNumber(coursesCount)}</div>
                  <p className="text-sm text-muted-foreground font-semibold mt-2">Kurslar</p>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 flex items-center justify-center hover:border-primary/40 transition-all duration-300">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary">{formatNumber(teachersCount)}</div>
                  <p className="text-sm text-muted-foreground font-semibold mt-2">O'qituvchilar</p>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 flex items-center justify-center hover:border-primary/40 transition-all duration-300">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary">{formatNumber(studentsCount)}</div>
                  <p className="text-sm text-muted-foreground font-semibold mt-2">O'quvchilar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Section */}
           <div className="flex items-start justify-center pt-4">
             <div className="w-11/12 flex items-center justify-center">
               <video
                 width="100%"
                 height="100%"
                 autoPlay
                 loop
                 muted
                 className="min-h-96 md:min-h-[250px] lg:min-h-[37px] w-full h-auto object-contain border-2 border-primary/30 rounded-lg"
               >
                 <source src="/edu-game-video.mp4" type="video/mp4" />
                 Your browser does not support the video tag.
               </video>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
