"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, PlayCircle, Sparkles, LockKeyhole } from "lucide-react";
import type { Movie } from "@/types";

interface PaywallModalProps {
  movie: Movie;
  onRent: () => void;
  onSubscribe: () => void;
  onTrailer: () => void;
  onBack: () => void;
}

export function PaywallModal({ movie, onRent, onSubscribe, onTrailer, onBack }: PaywallModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-cv-deep/80 backdrop-blur-2xl p-4"
      >
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35 }}
          className="relative flex w-full max-w-5xl flex-col overflow-y-auto md:overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-cv-surface/90 to-cv-deep/95 shadow-[0_30px_120px_rgba(15,23,42,0.7)] md:flex-row max-h-full"
        >
          <div className="relative min-h-[220px] flex-shrink-0 flex-1 md:min-h-[420px]">
            <Image src={movie.backdropUrl} alt={movie.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-cv-deep via-cv-deep/70 to-cv-deep/20" />
            <div className="absolute inset-0 flex items-end p-6 md:p-8">
              <div className="max-w-md rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-md">
                <div className="mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-cv-accent">
                  <Sparkles className="h-4 w-4" />
                  เข้าถึงพรีเมียม
                </div>
                <h3 className="text-2xl font-semibold text-white">{movie.title}</h3>
                <p className="mt-2 text-sm text-cv-text-dim">{movie.tagline}</p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col justify-center p-6 md:w-[420px] md:p-8">
            <div className="mb-6 flex items-center gap-2 text-sm text-cv-accent">
              <LockKeyhole className="h-4 w-4" />
              ตัวอย่างฟรีจบแล้ว
            </div>
            <h2 className="text-3xl font-semibold text-white">ซื้อสิทธิ์ดูต่อได้ทันที</h2>
            <p className="mt-3 text-sm leading-7 text-cv-text-dim">
              คืนประสบการณ์การชมต่อจากจุดที่หยุด พร้อมภาพบรรยากาศพรีเมียมเต็มจอ
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-cv-text-dim">เช่าดูต่อ 3 วัน</span>
                <span className="text-lg font-semibold text-white">฿{(movie.price24h || 0).toFixed(2)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-cv-text-dim">สมัครสมาชิก VIP</span>
                <span className="text-lg font-semibold text-cv-accent">เริ่ม ฿59/ด.</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button onClick={onRent} className="rounded-2xl bg-gradient-to-r from-cv-primary to-cv-accent px-4 py-3 font-semibold text-white shadow-[0_12px_35px_rgba(59,130,246,0.25)] transition hover:scale-[1.01]">
                เช่าดูต่อ
              </button>
              <button onClick={onSubscribe} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10">
                สมัครสมาชิก
              </button>
              <button onClick={onTrailer} className="flex items-center justify-center gap-2 rounded-2xl border border-cv-accent/30 px-4 py-3 font-semibold text-cv-accent transition hover:bg-cv-accent/10">
                <PlayCircle className="h-4 w-4" />
                ดูตัวอย่างเต็ม
              </button>
              <button onClick={onBack} className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-cv-text-dim transition hover:bg-white/5 hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                ย้อนกลับ
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
