"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-cv-deep flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-cv-primary/10 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-cv-primary" />
        </div>
        <h1 className="text-2xl font-bold font-heading mb-3 text-white">เกิดข้อผิดพลาดบางอย่าง</h1>
        <p className="text-cv-text-dim mb-8 text-sm">
          ไม่สามารถโหลดข้อมูลในหน้านี้ได้ กรุณาลองใหม่อีกครั้ง หรือกลับสู่หน้าหลัก
        </p>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => reset()}
            className="w-full btn-gradient py-3 rounded-xl flex items-center justify-center gap-2 font-medium text-white"
          >
            <RotateCcw className="w-4 h-4" />
            โหลดข้อมูลใหม่
          </button>
          <Link
            href="/"
            className="w-full bg-white/5 hover:bg-white/10 transition-colors py-3 rounded-xl font-medium text-white"
          >
            กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    </main>
  );
}
