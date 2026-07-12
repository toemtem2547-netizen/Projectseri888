"use client";

import { X, CheckCircle2, FileText, Download } from "lucide-react";
import { useState } from "react";

export function ReceiptModal({ payment, movieMap, onClose }: { payment: any, movieMap: Map<string, string>, onClose: () => void }) {
  const isVIP = payment.rentalPlan?.startsWith("VIP_");
  
  const getPlanName = (plan: string) => {
    switch (plan) {
      case "3d": return "เช่า 3 วัน";
      case "VIP_1_MONTH": return "VIP 1 เดือน";
      case "VIP_3_MONTH": return "VIP 3 เดือน";
      case "VIP_6_MONTH": return "VIP 6 เดือน";
      case "VIP_1_YEAR": return "VIP 1 ปี";
      default: return plan;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS": return <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30">สำเร็จ</span>;
      case "PENDING": return <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">รอตรวจสอบ</span>;
      case "FAILED": return <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">ล้มเหลว</span>;
      default: return <span>{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#1A1A1A] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cv-primary" />
            <h3 className="font-bold text-white">ใบเสร็จรับเงิน</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-cv-text-dim transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${payment.status === 'SUCCESS' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm text-cv-text-dim">ยอดชำระสุทธิ</p>
            <h2 className="text-3xl font-bold font-number text-white">฿{payment.amount}</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-sm text-cv-text-dim">รหัสทำรายการ</span>
              <span className="text-sm font-medium text-white font-mono">{payment.transactionId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-sm text-cv-text-dim">วันที่ทำรายการ</span>
              <span className="text-sm font-medium text-white">{new Date(payment.createdAt).toLocaleString('th-TH')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-sm text-cv-text-dim">สถานะ</span>
              {getStatusBadge(payment.status)}
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-sm text-cv-text-dim">ช่องทางชำระเงิน</span>
              <span className="text-sm font-medium text-white uppercase">{payment.method}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-sm text-cv-text-dim">รายการสั่งซื้อ</span>
              <div className="text-right">
                <span className="text-sm font-medium text-white block">
                  {isVIP ? "สมัครสมาชิก VIP" : (payment.movieId && movieMap.get(payment.movieId)) || "เช่าภาพยนตร์"}
                </span>
                <span className="text-xs text-cv-primary">{getPlanName(payment.rentalPlan)}</span>
              </div>
            </div>
          </div>
          
          {payment.slipUrl && (
            <div className="mt-6">
              <p className="text-sm text-cv-text-dim mb-2">สลิปโอนเงินแนบ</p>
              <a href={payment.slipUrl} target="_blank" rel="noopener noreferrer" className="block relative group rounded-xl overflow-hidden border border-white/10 aspect-[3/4] max-w-[200px] mx-auto bg-black/50">
                <img src={payment.slipUrl} alt="Slip" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="flex items-center gap-2 text-white text-sm font-medium bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-md">
                    <Download className="w-4 h-4" /> ดูรูปเต็ม
                  </span>
                </div>
              </a>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-white/5 text-center">
          <p className="text-xs text-cv-text-dim">ขอบคุณที่ใช้บริการ Cinevault</p>
        </div>
      </div>
    </div>
  );
}
