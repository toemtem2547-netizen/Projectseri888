"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="th">
      <body className="bg-cv-deep text-white min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card p-8 rounded-3xl text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold font-heading mb-3">เกิดข้อผิดพลาดร้ายแรง</h1>
          <p className="text-cv-text-dim mb-8">
            ขออภัย ระบบขัดข้องอย่างรุนแรง ไม่สามารถแสดงผลหน้าเว็บได้
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => reset()}
              className="w-full btn-gradient py-3 rounded-xl flex items-center justify-center gap-2 font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              ลองใหม่อีกครั้ง
            </button>
            <Link
              href="/"
              className="w-full bg-white/5 hover:bg-white/10 transition-colors py-3 rounded-xl font-medium"
            >
              กลับสู่หน้าหลัก
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
