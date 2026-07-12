import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cv-deep text-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-cv-primary animate-spin" />
        <h2 className="text-xl font-bold font-heading text-white/80 animate-pulse">กำลังโหลดข้อมูล...</h2>
      </div>
    </div>
  );
}
