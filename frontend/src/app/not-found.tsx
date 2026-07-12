import Link from "next/link";
import { Film } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-cv-deep flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-cv-primary/10 rounded-full flex items-center justify-center mb-6">
          <Film className="w-10 h-10 text-cv-primary" />
        </div>
        <h1 className="text-4xl font-bold font-heading mb-3 text-white">404</h1>
        <h2 className="text-xl font-medium text-white mb-4">ไม่พบหน้าที่คุณต้องการ</h2>
        <p className="text-cv-text-dim mb-8 text-sm">
          ขออภัย หน้าที่คุณกำลังพยายามเข้าถึงไม่มีอยู่หรืออาจถูกลบไปแล้ว
        </p>
        <Link
          href="/"
          className="w-full btn-gradient py-3 rounded-xl flex items-center justify-center gap-2 font-medium text-white"
        >
          กลับสู่หน้าหลัก
        </Link>
      </div>
    </main>
  );
}
