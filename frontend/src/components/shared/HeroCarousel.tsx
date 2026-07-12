"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";

export function HeroCarousel({ featuredMovies }: { featuredMovies: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    
    let interval: NodeJS.Timeout;
    if (!isHovered) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
      }, 6000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [featuredMovies.length, isHovered]);

  if (!featuredMovies || featuredMovies.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const currentMovie = featuredMovies[currentIndex];

  return (
    <div 
      className="relative h-[78vh] min-h-[560px] w-full overflow-hidden rounded-[32px] border border-white/10 bg-cv-deep/35 shadow-[0_0_80px_rgba(11,16,32,0.45)] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={currentMovie.backdropUrl || currentMovie.posterUrl} 
              alt={currentMovie.title}
              className="w-full h-full object-cover object-top"
            />
          </div>
          {/* Gradients to blend with background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cv-deep/95 via-cv-deep/60 to-transparent z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-cv-deep/95 via-cv-deep/30 to-transparent z-[2]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.18),_transparent_22%)] z-[3]" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/80 z-[4]" />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-10 pb-16">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cv-accent backdrop-blur shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cv-accent shadow-[0_0_10px_rgba(6,182,212,0.45)]" />
                {currentMovie.type === "SERIES" ? "ซีรีส์แนะนำ" : "หนังเด่นประจำสัปดาห์"}
              </div>
              
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl mb-4">
                {currentMovie.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm md:text-base text-gray-300 mb-6 font-medium">
                <span className="text-green-400 font-bold">{currentMovie.year}</span>
                <span>•</span>
                <span>{currentMovie.genres.split(',')[0]}</span>
                <span>•</span>
                <span>{currentMovie.duration}</span>
                {currentMovie.rating > 0 && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-yellow-400">
                      ★ {currentMovie.rating.toFixed(1)}
                    </span>
                  </>
                )}
              </div>
              
              <p className="mt-4 max-w-xl text-base leading-8 text-cv-text-dim sm:text-lg mb-8 line-clamp-3">
                {currentMovie.description}
              </p>
              
              <div className="mt-8 flex flex-wrap gap-3">
                <Link 
                  href={`/watch/${currentMovie.id}`} 
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#4f6fed] to-[#06b6d4] px-6 py-3 font-semibold text-white shadow-[0_14px_40px_rgba(79,70,229,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(79,70,229,0.32)]"
                >
                  <Play className="h-4 w-4 fill-current" /> 
                  <span>เล่นเลย</span>
                </Link>
                
                <Link 
                  href={`/movie/${currentMovie.id}`} 
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  <Info className="h-4 w-4" /> 
                  <span>ข้อมูลเพิ่มเติม</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {featuredMovies.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all z-20 hover:bg-black/60 hover:scale-110 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button 
            onClick={handleNext}
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all z-20 hover:bg-black/60 hover:scale-110 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {featuredMovies.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {featuredMovies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${currentIndex === idx ? 'w-8 h-2 bg-cv-primary shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'w-2 h-2 bg-white/40 hover:bg-white/80'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
