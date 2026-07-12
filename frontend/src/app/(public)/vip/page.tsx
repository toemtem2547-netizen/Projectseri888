"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Crown, Loader2, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function VIPPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSlip, setShowSlip] = useState(false);
  const [slipUrl, setSlipUrl] = useState("");

  const handleSubscribe = async () => {
    if (!slipUrl) {
      alert("กรุณาอัปโหลดสลิป");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: "VIP", slipUrl }),
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.ok) {
        alert("สมัคร VIP สำเร็จ! ขอให้สนุกกับการรับชมครับ");
        router.push("/profile");
      }
    } catch (e) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(234,179,8,0.5)]">
            <Crown className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">S888 VIP PASS</h1>
          <p className="text-xl text-cv-text-dim">ปลดล็อคทุกความบันเทิง ดูกี่เรื่องก็ได้ ไม่มีอั้น!</p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="glass-card rounded-3xl p-8 border border-yellow-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">POPULAR</div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">แพ็กเกจรายเดือน</h2>
            <div className="text-center mb-8">
              <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">฿199</span>
              <span className="text-cv-text-dim"> / เดือน</span>
            </div>

            <ul className="space-y-4 mb-8">
              {["ดูภาพยนตร์และซีรีส์ได้ทุกเรื่อง", "ความคมชัดระดับ 4K HDR", "ไม่มีโฆษณาคั่น", "ดาวน์โหลดดูออฟไลน์ได้"].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-white">
                  <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            {!showSlip ? (
              <button onClick={() => setShowSlip(true)} className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white font-bold text-lg transition-all shadow-lg hover:shadow-yellow-500/50">
                สมัครเลยตอนนี้
              </button>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-center text-sm">
                  <p className="text-cv-text-dim mb-2">โอนเงินเข้าบัญชี</p>
                  <p className="font-bold text-white text-lg">012-3-45678-9 (กสิกรไทย)</p>
                  <p className="text-white">บจก. S888 สตูดิโอ</p>
                </div>
                <div>
                  <label className="block text-sm text-cv-text-dim mb-2">แนบลิงก์รูปสลิปโอนเงิน (URL)</label>
                  <input value={slipUrl} onChange={e => setSlipUrl(e.target.value)} placeholder="https://example.com/slip.jpg" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500" />
                </div>
                <button onClick={handleSubscribe} disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold transition-all disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "ยืนยันการชำระเงิน"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
