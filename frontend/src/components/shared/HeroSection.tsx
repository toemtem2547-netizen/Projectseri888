"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Star, Clock2, Film } from "lucide-react";
import type { Movie } from "@/types";

interface HeroSectionProps {
  movie: Movie;
}

export function HeroSection({ movie }: HeroSectionProps) {
  return (
    <section className="relative h-[78vh] min-h-[560px] overflow-hidden rounded-[32px] border border-white/10 bg-cv-deep/35 shadow-[0_0_80px_rgba(11,16,32,0.45)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image src={movie.backdropUrl} alt={movie.title} fill sizes="(max-width: 768px) 100vw, 100vw" className="object-cover" priority />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-cv-deep/95 via-cv-deep/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-cv-deep/95 via-cv-deep/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.18),_transparent_22%)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/80" />

      <div className="relative z-10 flex h-full items-end p-6 md:p-10">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cv-accent backdrop-blur shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cv-accent shadow-[0_0_10px_rgba(6,182,212,0.45)]" />
            หนังเด่นประจำสัปดาห์
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">{movie.title}</h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-cv-text-dim sm:text-lg">{movie.tagline}</p>

          <div className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur transition hover:bg-white/15">
                <Star className="h-4 w-4 text-cv-highlight" /> {(movie.rating || 0).toFixed(1)} คะแนน
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur transition hover:bg-white/15">
                <Clock2 className="h-4 w-4 text-cv-accent" /> {movie.duration}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur transition hover:bg-white/15">
                <Film className="h-4 w-4 text-cv-primary" /> {movie.contentType === "series" ? "ซีรีส์" : "ภาพยนตร์"}
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-cv-text-dim backdrop-blur">
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.language}</span>
              <span>•</span>
              <span>{movie.country}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/watch/${movie.id}`} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#4f6fed] to-[#06b6d4] px-6 py-3 font-semibold text-white shadow-[0_14px_40px_rgba(79,70,229,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(79,70,229,0.32)]">
              <Play className="h-4 w-4" /> ดูตัวอย่างฟรี
            </Link>
            <Link href={`/movie/${movie.id}`} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/10">
              ดูรายละเอียด
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
