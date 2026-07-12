"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CreditCard, CheckCircle2, Loader2, X, QrCode, Tag, Upload, Clock, Calendar, Sparkles, Film, Crown, Star, Zap } from "lucide-react";
import type { Movie } from "@/types";
import { toast } from "sonner";

interface CheckoutModalProps {
  movie?: Movie;
  mode?: "movie" | "vip";
  onSuccess: () => void;
  onCancel: () => void;
}

export function CheckoutModal({ movie, mode = "movie", onSuccess, onCancel }: CheckoutModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(mode === "movie" ? "3d" : "VIP_1_MONTH");
  const [method, setMethod] = useState<"CREDIT_CARD" | "PROMPTPAY">("CREDIT_CARD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Settings
  const [paymentAccountNo, setPaymentAccountNo] = useState("0801234567");
  const [paymentAccountName, setPaymentAccountName] = useState("ชื่อบัญชี");

  useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (data.paymentAccountNo) setPaymentAccountNo(data.paymentAccountNo);
      if (data.paymentAccountName) setPaymentAccountName(data.paymentAccountName);
    }).catch(e => {});
  }, []);
  
  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  
  // Slip
  const [slipUrl, setSlipUrl] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.status === 401) {
        toast.error("กรุณาเข้าสู่ระบบก่อนทำรายการ");
        window.location.href = "/login";
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setSlipUrl(data.url);
        toast.success("อัปโหลดสลิปสำเร็จ");
      } else {
        toast.error("อัปโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการอัปโหลด");
    } finally {
      setIsUploading(false);
    }
  };

  const plans = mode === "movie" && movie ? [
    { id: "3d", name: "เช่า 3 วัน", price: movie.price24h || 0, icon: Clock, color: "cv-accent" },
  ] : [
    { id: "VIP_1_MONTH", name: "VIP 1 เดือน", price: 59, icon: Star, color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
    { id: "VIP_3_MONTH", name: "VIP 3 เดือน", price: 149, icon: Sparkles, color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
    { id: "VIP_6_MONTH", name: "VIP 6 เดือน", price: 199, icon: Zap, color: "text-pink-400 bg-pink-400/10 border-pink-400/20" },
    { id: "VIP_1_YEAR", name: "VIP 1 ปี", price: 299, icon: Crown, color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  ];
  
  const basePrice = plans.find(p => p.id === selectedPlan)?.price || 0;
  const finalPrice = Math.max(0, basePrice - discount);

  const applyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode })
      });
      const data = await res.json();
      
      if (res.ok) {
        setDiscount(data.discountAmount);
        setCouponMsg(`ลดไป ฿${data.discountAmount}`);
      } else {
        setDiscount(0);
        setCouponMsg(data.error || "คูปองไม่ถูกต้องหรือหมดอายุ");
      }
    } catch (e) {
      setDiscount(0);
      setCouponMsg("เกิดข้อผิดพลาด");
    }
  };

  const handlePayment = async () => {
    if (method === "PROMPTPAY" && !slipUrl) {
      toast.error("กรุณาแนบลิงก์รูปภาพสลิปโอนเงิน (URL)");
      return;
    }

    setIsProcessing(true);
    
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: mode === "movie" && movie ? movie.id : null,
          plan: selectedPlan,
          amount: finalPrice,
          method: method,
          slipUrl: slipUrl,
          couponCode: discount > 0 ? couponCode : undefined,
        }),
      });
      
      if (res.status === 401) {
        toast.error("กรุณาเข้าสู่ระบบก่อนทำรายการ");
        window.location.href = "/login";
        return;
      }
      
      if (!res.ok) throw new Error("Payment failed");
      const data = await res.json();
      
      if (data.pending) {
        setIsPending(true);
        toast.success("ส่งสลิปสำเร็จ กรุณารอแอดมินตรวจสอบ");
      } else {
        setIsSuccess(true);
        toast.success("ชำระเงินสำเร็จ!");
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการชำระเงิน กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-cv-deep/90 backdrop-blur-md p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-cv-deep/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_120px_rgba(239,68,68,0.15)] my-4 max-h-[95vh] overflow-y-auto no-scrollbar"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[32px] pointer-events-none" />
          <button onClick={onCancel} className="absolute top-4 right-4 text-cv-text-dim hover:text-white z-10">
            <X className="w-5 h-5" />
          </button>
          
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-14 h-14 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-4"
              >
                <CheckCircle2 className="w-7 h-7" />
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-2">ชำระเงินสำเร็จ!</h2>
              <p className="text-sm text-cv-text-dim">กำลังปลดล็อกภาพยนตร์ให้คุณ...</p>
            </div>
          ) : isPending ? (
            <div className="flex flex-col items-center justify-center py-8 text-center relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-14 h-14 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-4"
                >
                  <CheckCircle2 className="w-7 h-7" />
                </motion.div>
                <h2 className="text-xl font-bold text-white mb-2">ส่งสลิปสำเร็จ!</h2>
              <p className="text-sm text-cv-text-dim mb-6">กรุณารอแอดมินตรวจสอบการชำระเงิน</p>
              <button onClick={onCancel} className="btn-gradient w-full py-2.5 rounded-xl text-sm">ปิดหน้าต่าง</button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-5 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${mode === "movie" ? "bg-gradient-to-br from-cv-primary to-cv-accent shadow-cv-primary/30" : "bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-yellow-500/30"}`}>
                  {mode === "movie" ? <Film className="w-6 h-6 text-white" /> : <Crown className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white font-[family-name:var(--font-heading)]">
                    {mode === "movie" ? "สั่งซื้อแพ็กเกจ" : "สมัครสมาชิก VIP"}
                  </h2>
                  {mode === "movie" && movie ? (
                    <p className="text-xs text-cv-text-dim mt-0.5">สำหรับ <span className="text-white font-medium">{movie.title}</span></p>
                  ) : (
                    <p className="text-xs text-cv-text-dim mt-0.5">ปลดล็อกการรับชม <span className="text-cv-primary font-bold">ทุกเรื่องในเว็บไซต์</span></p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 mb-5 relative z-10">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      key={plan.id}
                      onClick={() => { setSelectedPlan(plan.id as any); setDiscount(0); setCouponMsg(""); }}
                      className={`relative flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                        isSelected 
                          ? "border-cv-primary bg-gradient-to-r from-cv-primary/10 to-transparent shadow-[inset_0_0_20px_rgba(239,68,68,0.1)] ring-1 ring-cv-primary/30" 
                          : "border-white/5 hover:border-white/20 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {isSelected && (
                        <motion.div layoutId="activePlan" className="absolute left-0 top-0 bottom-0 w-1 bg-cv-primary rounded-l-full" />
                      )}
                      <div className="flex items-center gap-3 relative z-10">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${isSelected ? `border-transparent bg-cv-primary/20 text-cv-primary scale-110 shadow-[0_0_15px_rgba(239,68,68,0.3)]` : plan.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className={`text-sm md:text-base font-bold transition-colors ${isSelected ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-cv-text-dim"}`}>{plan.name}</div>
                        </div>
                      </div>
                      <div className="text-lg md:text-xl font-bold font-number text-white relative z-10 tracking-tight">฿{plan.price}</div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Coupon */}
              <div className="mb-5 relative z-10">
                <label className="block text-xs font-semibold text-cv-text-dim uppercase tracking-wider mb-2">คูปองส่วนลด</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-3 w-4 h-4 text-cv-text-dim" />
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="กรอกโค้ดส่วนลด (ถ้ามี)" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white outline-none focus:border-cv-primary focus:bg-white/10 transition-all uppercase placeholder:normal-case placeholder:text-cv-text-dim/50"
                    />
                  </div>
                  <button onClick={applyCoupon} className="px-5 text-sm bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all">ใช้โค้ด</button>
                </div>
                {couponMsg && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className={`text-xs mt-2 flex items-center gap-1.5 ${discount > 0 ? "text-green-400" : "text-cv-primary"}`}>
                    {discount > 0 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    {couponMsg}
                  </motion.p>
                )}
              </div>

              {/* Payment Methods */}
              <div className="mb-5 relative z-10">
                <label className="block text-xs font-semibold text-cv-text-dim uppercase tracking-wider mb-2">ช่องทางการชำระเงิน</label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMethod("CREDIT_CARD")}
                    className={`relative flex flex-row items-center justify-center gap-2 p-3.5 rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                      method === "CREDIT_CARD" ? "border-cv-primary bg-gradient-to-br from-cv-primary/20 to-transparent text-white shadow-[0_0_15px_rgba(239,68,68,0.15)]" : "border-white/10 bg-white/5 text-cv-text-dim hover:bg-white/10"
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 transition-colors ${method === "CREDIT_CARD" ? "text-cv-primary" : ""}`} />
                    <span className="text-sm font-semibold">บัตรเครดิต</span>
                    {method === "CREDIT_CARD" && <div className="absolute inset-0 border-2 border-cv-primary rounded-xl" />}
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMethod("PROMPTPAY")}
                    className={`relative flex flex-row items-center justify-center gap-2 p-3.5 rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                      method === "PROMPTPAY" ? "border-[#113566] bg-gradient-to-br from-[#113566]/40 to-transparent text-white shadow-[0_0_15px_rgba(17,53,102,0.3)]" : "border-white/10 bg-white/5 text-cv-text-dim hover:bg-white/10"
                    }`}
                  >
                    <QrCode className={`w-5 h-5 transition-colors ${method === "PROMPTPAY" ? "text-[#00479A]" : ""}`} />
                    <span className="text-sm font-semibold">พร้อมเพย์</span>
                    {method === "PROMPTPAY" && <div className="absolute inset-0 border-2 border-[#113566] rounded-xl" />}
                  </motion.div>
                </div>
              </div>

              {/* PromptPay Slip Upload */}
              <AnimatePresence>
                {method === "PROMPTPAY" && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden relative z-10"
                  >
                    <div className="mb-5 p-4 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent flex flex-col sm:flex-row gap-4 items-center">
                      <div className="bg-white p-3 rounded-2xl shadow-xl shrink-0 w-40 h-40 mx-auto sm:mx-0">
                        <img src={`https://promptpay.io/${paymentAccountNo}/${finalPrice}.png`} alt="QR" className="w-full h-full object-contain" />
                      </div>
                      
                      <div className="flex-1 w-full space-y-3">
                        <div className="text-center sm:text-left">
                          <div className="text-white font-bold text-lg md:text-xl text-[#113566] font-number tracking-tight">โอนเงิน ฿{finalPrice}</div>
                          <div className="text-cv-text-dim text-sm">{paymentAccountName}</div>
                          <div className="text-cv-text-dim text-xs opacity-80">พร้อมเพย์: {paymentAccountNo}</div>
                        </div>
                        <div className="relative">
                          {slipUrl ? (
                            <div className="relative w-full h-32 rounded-lg border border-white/10 overflow-hidden bg-black/40 group">
                              <img src={slipUrl} alt="Slip Preview" className="w-full h-full object-contain" />
                              <button 
                                onClick={() => setSlipUrl("")} 
                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 rounded-full text-white transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="relative">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleFileUpload}
                                disabled={isUploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                              />
                              <div className={`w-full bg-black/40 border border-dashed border-white/20 rounded-lg p-4 text-center transition-all ${isUploading ? 'opacity-50' : 'hover:border-[#113566] hover:bg-white/5'}`}>
                                {isUploading ? (
                                  <div className="flex flex-col items-center gap-2 text-cv-text-dim">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-xs">กำลังอัปโหลด...</span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center gap-2 text-cv-text-dim">
                                    <Upload className="w-5 h-5" />
                                    <span className="text-xs">แตะเพื่ออัปโหลดสลิปโอนเงิน</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-1 relative z-10">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-bold text-white text-base transition-all duration-300 hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:hover:scale-100 ${
                    method === "PROMPTPAY" ? "bg-gradient-to-r from-[#113566] to-[#00479A] shadow-[#113566]/25" : "bg-gradient-to-r from-cv-primary to-cv-accent shadow-cv-primary/25"
                  }`}
                >
                  {isProcessing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> กำลังดำเนินการ...</>
                  ) : (
                    <>
                      {method === "CREDIT_CARD" ? <CreditCard className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />} 
                      ชำระเงิน <span className="font-number tracking-tight">฿{finalPrice}</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
