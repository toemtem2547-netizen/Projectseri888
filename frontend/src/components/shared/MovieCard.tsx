"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Play, Clock2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Movie } from "@/types";

interface MovieCardProps {
  movie: Movie;
  index?: number;
  variant?: "default" | "large";
}

export default function MovieCard({ movie, index = 0, variant = "default" }: MovieCardProps) {
  const badgeLabel = movie.isFeatured ? "FEATURED" : movie.isTrending ? "TRENDING" : movie.isNew ? "NEW" : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="group"
    >
      <Link href={`/movie/${movie.id}`} prefetch={true} className="group block rounded-[28px] border border-white/10 bg-cv-card/80 p-2 transition duration-300 hover:-translate-y-1 hover:border-cv-accent/40 hover:shadow-[0_24px_80px_rgba(59,130,246,0.18)]">
        <div className="relative aspect-[2/3] overflow-hidden rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes={variant === "large" ? "420px" : "260px"}
              priority={index < 6}
            />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            {badgeLabel ? (
              <Badge className="border-0 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur">
                {badgeLabel}
              </Badge>
            ) : (
              <div className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur">{movie.contentType === "series" ? "SERIES" : "MOVIE"}</div>
            )}
            <div className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[10px] text-white backdrop-blur">
              <Play className="h-3.5 w-3.5" /> ดูตัวอย่าง
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex flex-wrap justify-between gap-2 p-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-3 py-1 text-[10px] text-white backdrop-blur">
              <Clock2 className="h-3.5 w-3.5" /> {movie.duration}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-3 py-1 text-[10px] text-white backdrop-blur">
              <MapPin className="h-3.5 w-3.5" /> {movie.country}
            </span>
          </div>
        </div>

        <div className="mt-4 px-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="line-clamp-1 text-sm font-semibold text-white md:text-base">{movie.title}</h3>
            <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cv-accent">{movie.year}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-cv-text-dim">{movie.tagline}</p>
          <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-cv-text-dim">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-white/80">
              <Star className="h-3.5 w-3.5 text-cv-highlight" fill="#F59E0B" /> {movie.rating}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-white/80">
              <Play className="h-3.5 w-3.5" /> {movie.ratingCount}+ รีวิว
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
