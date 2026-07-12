"use client";

import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import type { WatchHistoryItem } from "@/types";

interface ContinueWatchingRowProps {
  items: WatchHistoryItem[];
}

export function ContinueWatchingRow({ items }: ContinueWatchingRowProps) {
  if (!items.length) return null;

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">รับชมต่อ</h2>
          <p className="mt-1 text-sm text-cv-text-dim">ต่อจากจุดที่คุณค้างไว้</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
        {items.slice(0, 4).map((item) => (
          <Link key={item.movieId} href={`/watch/${item.movieId}`} className="shrink-0 w-[200px] md:w-[280px] lg:w-[340px] group block rounded-[28px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-3 transition hover:-translate-y-1 hover:border-cv-accent/40 hover:shadow-[0_20px_50px_rgba(59,130,246,0.18)]">
            <div className="relative aspect-[2/3] overflow-hidden rounded-[22px] shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
              <Image src={item.posterUrl} alt={item.movieTitle} fill sizes="(max-width: 768px) 200px, (max-width: 1024px) 280px, 340px" className="object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 rounded-b-[22px] bg-gradient-to-t from-cv-deep/90 to-transparent p-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-[11px] text-white">
                  <Play className="h-3.5 w-3.5" /> รับชมต่อ
                </div>
              </div>
            </div>
            <div className="mt-4 px-1">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-white">{item.movieTitle}</div>
                <span className="text-xs text-cv-text-dim">{item.lastWatched}</span>
              </div>
              <div className="mt-3 text-xs text-cv-text-dim">{item.progress}% รับชมแล้ว</div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cv-primary to-cv-accent transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
