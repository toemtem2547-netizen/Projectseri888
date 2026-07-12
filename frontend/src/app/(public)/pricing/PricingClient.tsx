"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Star, Sparkles, Film, Tv, Download, Zap } from "lucide-react";
import { CheckoutModal } from "@/components/shared/CheckoutModal";
import { toast } from "sonner";

export default function PricingClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleSubscribeClick = () => {
    if (!isLoggedIn) {
      router.push("/login?callbackUrl=/pricing");
      return;
    }
    setShowCheckout(true);
  };

  const features = [
    { icon: Film, text: "รับชมภาพยนตร์และซีรีส์ทุกเรื่องในเว็บไซต์แบบไม่จำกัด" },
    { icon: Tv, text: "ความคมชัดระดับ 4K HDR บนอุปกรณ์ที่รองรับ" },
    { icon: Zap, text: "ไม่มีโฆษณาคั่นระหว่างการรับชม" },
    { icon: Download, text: "ดาวน์โหลดเก็บไว้ดูแบบออฟไลน์ได้ทุกเรื่อง" },
    { icon: Star, text: "สิทธิ์เข้าชมคอนเทนต์พิเศษก่อนใคร (Early Access)" },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto">
      <div className="text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cv-primary/10 border border-cv-primary/30 text-cv-primary text-sm font-bold tracking-wider uppercase mb-6"
        >
          <Sparkles className="w-4 h-4" /> CineVault VIP
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-[family-name:var(--font-heading)] mb-6"
        >
          ปลดล็อกทุกความบันเทิง
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-cv-text-dim max-w-2xl mx-auto"
        >
          สมัครแพ็กเกจ VIP วันนี้เพื่อรับชมภาพยนตร์และซีรีส์ทุกเรื่องบน CineVault แบบไม่มีข้อจำกัด ตลอด 24 ชั่วโมง
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto relative z-10">
        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 rounded-3xl"
        >
          <h2 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-heading)]">
            สิทธิพิเศษสำหรับคุณ
          </h2>
          <ul className="space-y-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cv-primary/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-cv-primary" />
                  </div>
                  <p className="text-cv-text-dim pt-2">{feature.text}</p>
                </li>
              );
            })}
          </ul>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-cv-primary to-cv-accent rounded-3xl blur-xl opacity-30" />
          <div className="glass-card p-8 rounded-3xl relative border border-cv-primary/50 bg-gradient-to-b from-cv-primary/10 to-transparent flex flex-col h-full">
            <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              คุ้มค่าที่สุด
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">VIP Access</h3>
            <p className="text-cv-text-dim mb-6">เข้าถึงภาพยนตร์และซีรีส์ทุกเรื่อง</p>
            
            <div className="mb-8">
              <span className="text-5xl font-black text-white font-number">฿59</span>
              <span className="text-cv-text-dim"> / เดือนเริ่มต้น</span>
            </div>
            
            <div className="flex-1" />
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-cv-text-dim">
                <Check className="w-5 h-5 text-cv-accent" /> สามารถยกเลิกได้ตลอดเวลา
              </div>
              <div className="flex items-center gap-3 text-sm text-cv-text-dim">
                <Check className="w-5 h-5 text-cv-accent" /> ไม่มีข้อผูกมัดระยะยาว
              </div>
            </div>
            
            <button
              onClick={handleSubscribeClick}
              className="w-full btn-gradient py-4 rounded-xl font-bold text-lg text-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
              เริ่มต้นสมัคร VIP
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Background Decor */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cv-primary/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cv-secondary/20 blur-[120px] pointer-events-none" />

      {showCheckout && (
        <CheckoutModal
          mode="vip"
          onSuccess={() => {
            setShowCheckout(false);
            toast.success("ขอบคุณที่สมัคร VIP กับเรา! (ถ้าคุณชำระด้วยพร้อมเพย์ กรุณารอแอดมินอนุมัติ)");
            router.push("/profile");
          }}
          onCancel={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}
