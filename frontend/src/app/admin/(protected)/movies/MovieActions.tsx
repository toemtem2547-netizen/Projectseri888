"use client";

import { Edit, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MovieActions({ movieId, isFeatured }: { movieId: string, isFeatured: boolean }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบภาพยนตร์เรื่องนี้?")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/movies/${movieId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        alert("เกิดข้อผิดพลาดในการลบภาพยนตร์");
      }
    } catch (e) {
      alert("เกิดข้อผิดพลาดในการลบภาพยนตร์");
    } finally {
      setIsDeleting(false);
    }
  };
  const handleToggleFeatured = async () => {
    try {
      const res = await fetch(`/api/admin/movies/${movieId}/featured`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !isFeatured })
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
      }
    } catch (e) {
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      <button 
        onClick={handleToggleFeatured}
        className={`px-3 py-1 bg-white/5 rounded-lg text-sm transition-colors inline-flex items-center gap-1 ${isFeatured ? 'text-yellow-400 hover:bg-yellow-400/20' : 'text-cv-text-dim hover:text-white hover:bg-white/10'}`}
        title={isFeatured ? "นำออกจากสไลด์หน้าแรก" : "ตั้งเป็นสไลด์หน้าแรก"}
      >
        <Star className={`w-4 h-4 ${isFeatured ? 'fill-current' : ''}`}/> {isFeatured ? "โดดเด่น" : "ทั่วไป"}
      </button>
      <Link 
        href={`/admin/movies/${movieId}/edit`} 
        className="text-cv-secondary hover:text-white px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors inline-flex items-center gap-1"
      >
        <Edit className="w-4 h-4"/> แก้ไข
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-500 hover:text-white px-3 py-1 bg-white/5 hover:bg-red-500 rounded-lg text-sm transition-colors inline-flex items-center gap-1 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4"/> {isDeleting ? "กำลังลบ..." : "ลบ"}
      </button>
    </div>
  );
}
