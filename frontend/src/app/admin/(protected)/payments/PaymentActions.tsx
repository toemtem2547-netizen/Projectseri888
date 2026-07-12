"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Check, X, FileImage, Loader2, Trash2 } from "lucide-react";

export function PaymentActions({ paymentId, slipUrl, currentStatus }: { paymentId: string, slipUrl: string | null, currentStatus: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSlip, setShowSlip] = useState(false);

  const handleAction = async (action: string) => {
    if (!confirm(`ยืนยันการทำรายการ ${action}?`)) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/payments/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        alert("ทำรายการสำเร็จ");
        router.refresh();
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      alert("Error processing request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("ลบประวัติการทำรายการนี้อย่างถาวร? (การกระทำนี้ย้อนกลับไม่ได้)")) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/payments/${paymentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("ลบข้อมูลสำเร็จ");
        router.refresh();
      } else {
        alert("เกิดข้อผิดพลาดในการลบ");
      }
    } catch (error) {
      alert("Error deleting record");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {slipUrl && (
        <button 
          onClick={() => setShowSlip(true)} 
          className="p-2 bg-cv-primary/10 hover:bg-cv-primary/20 text-cv-primary rounded-lg transition-colors" 
          title="ดูสลิปโอนเงิน"
        >
          <FileImage className="w-4 h-4" />
        </button>
      )}

      {showSlip && slipUrl && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative max-w-2xl w-full bg-cv-deep rounded-2xl overflow-hidden border border-white/10 shadow-2xl p-4 flex flex-col items-center">
            <button 
              onClick={() => setShowSlip(false)} 
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-red-500 rounded-full text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-white font-bold mb-4 w-full text-left">หลักฐานการโอนเงิน</h3>
            <img src={slipUrl} alt="Slip" className="max-h-[70vh] w-auto object-contain rounded-lg" />
            <div className="w-full flex justify-end mt-4">
              <button onClick={() => setShowSlip(false)} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      
      {currentStatus === "PENDING" && (
        <>
          <button 
            onClick={() => handleAction("APPROVE")}
            disabled={isLoading}
            className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors disabled:opacity-50"
            title="อนุมัติ"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => handleAction("REJECT")}
            disabled={isLoading}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors disabled:opacity-50"
            title="ปฏิเสธ"
          >
            <X className="w-4 h-4" />
          </button>
        </>
      )}

      <button 
        onClick={handleDelete}
        disabled={isLoading}
        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors disabled:opacity-50 ml-2"
        title="ลบรายการ"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
