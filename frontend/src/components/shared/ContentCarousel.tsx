"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// framer-motion intentionally unused here; keep for future animations

interface ContentCarouselProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  seeAllHref?: string;
}

export default function ContentCarousel({
  children,
  title,
  subtitle,
  seeAllHref,
}: ContentCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 400);
  };

  return (
    <section className="relative">
      {/* Header */}
      {title && (
        <div className="flex items-end justify-between mb-6 px-4 md:px-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-heading)]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-cv-text-dim mt-1">{subtitle}</p>
            )}
            <div className="h-1 w-12 bg-gradient-to-r from-cv-primary to-cv-accent rounded-full mt-3" />
          </div>
          <div className="flex items-center gap-2">
            {seeAllHref && (
              <a
                href={seeAllHref}
                className="text-sm text-cv-primary hover:text-cv-accent transition-colors mr-2"
              >
                ดูทั้งหมด
              </a>
            )}
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="relative group/carousel">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar px-4 md:px-8 pb-4"
        >
          {children}
        </div>

        {/* Gradient Fade Edges */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-cv-deep to-transparent pointer-events-none z-10" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-cv-deep to-transparent pointer-events-none z-10" />
        )}
      </div>
    </section>
  );
}
