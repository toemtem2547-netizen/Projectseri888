"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";

export function RentalActions({ rentalId }: { rentalId: string }) {
  const router = useRouter();
  const [isExtending, setIsExtending] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  const handleExtend = async () => {
    if (!confirm("ยืนยันเพิ่มเวลา 7 วันให้ลูกค้ารายนี้?")) return;
    setIsExtending(true);
    try {
      const res = await fetch(`/api/admin/rentals/${rentalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "extend" })
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (e) {
      console.error(e);
      alert("Error");
    } finally {
      setIsExtending(false);
    }
  };

  const handleRevoke = async () => {
    if (!confirm("ยืนยันยกเลิกสิทธิ์ (ปรับเป็นหมดอายุทันที)?")) return;
    setIsRevoking(true);
    try {
      const res = await fetch(`/api/admin/rentals/${rentalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke" })
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (e) {
      console.error(e);
      alert("Error");
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      <button 
        onClick={handleExtend}
        disabled={isExtending || isRevoking}
        className="px-3 py-1.5 text-xs font-medium bg-cv-primary/20 text-cv-primary hover:bg-cv-primary/30 rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50"
        title="เพิ่มเวลา 7 วัน"
      >
        {isExtending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
        ต่อ 7 วัน
      </button>
      <button 
        onClick={handleRevoke}
        disabled={isExtending || isRevoking}
        className="px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50"
        title="ยกเลิกสิทธิ์ทันที"
      >
        {isRevoking ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
        ยกเลิกสิทธิ์
      </button>
    </div>
  );
}
