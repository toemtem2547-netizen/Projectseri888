"use client";

import { useState } from "react";
import { CreditCard, FileText } from "lucide-react";
import { ReceiptModal } from "./ReceiptModal";

export function PaymentHistoryList({ payments, movieMapArray }: { payments: any[], movieMapArray: [string, string][] }) {
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  
  // Convert map array back to Map
  const movieMap = new Map(movieMapArray);

  return (
    <>
      <div className="glass-card p-6 rounded-3xl h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-cv-accent" />
          <h3 className="font-bold text-white">ประวัติการชำระเงิน</h3>
        </div>
        
        <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 flex-1 max-h-[400px]">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-cv-text-dim py-8">
              <FileText className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">ยังไม่มีประวัติการชำระเงิน</p>
            </div>
          ) : (
            payments.map((payment) => (
              <div 
                key={payment.id} 
                onClick={() => setSelectedPayment(payment)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all cursor-pointer"
              >
                <div className="mb-2 sm:mb-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">฿{payment.amount}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${payment.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500 border-green-500/20' : payment.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                      {payment.status}
                    </span>
                  </div>
                  <p className="text-xs text-cv-text-dim mt-1 line-clamp-1">
                    {payment.rentalPlan?.startsWith("VIP_") ? "สมัคร VIP" : (payment.movieId && movieMap.get(payment.movieId)) || payment.rentalPlan}
                  </p>
                </div>
                
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1">
                  <p className="text-[10px] text-cv-text-dim">{new Date(payment.createdAt).toLocaleDateString('th-TH')}</p>
                  <span className="text-[10px] text-cv-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <FileText className="w-3 h-3" /> ดูใบเสร็จ
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedPayment && (
        <ReceiptModal 
          payment={selectedPayment} 
          movieMap={movieMap}
          onClose={() => setSelectedPayment(null)} 
        />
      )}
    </>
  );
}
