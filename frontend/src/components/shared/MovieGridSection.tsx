"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import MovieCard from "@/components/shared/MovieCard";
import type { Movie } from "@/types";

interface MovieGridSectionProps {
  title: string;
  subtitle: string;
  items: Movie[];
}

export function MovieGridSection({ title, subtitle, items }: MovieGridSectionProps) {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-xl font-semibold text-white">
            <Sparkles className="h-5 w-5 text-cv-accent" />
            {title}
          </div>
          <p className="mt-1 text-sm text-cv-text-dim">{subtitle}</p>
        </div>
        <Link href="/browse" className="inline-flex items-center gap-1 text-sm font-medium text-cv-text-dim hover:text-white transition-colors">
          ดูทั้งหมด
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {items.slice(0, 6).map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} index={index} variant="large" />
        ))}
      </div>
    </section>
  );
}
