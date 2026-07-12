import { prisma } from "@/lib/db";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { PaymentActions } from "./PaymentActions";

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading text-white">ประวัติการชำระเงิน</h1>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-cv-text-dim text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">รหัสรายการ (TXN)</th>
                  <th className="p-4 font-medium">ผู้ใช้</th>
                  <th className="p-4 font-medium">ยอดเงิน</th>
                  <th className="p-4 font-medium">แพ็กเกจ</th>
                  <th className="p-4 font-medium">สถานะ</th>
                  <th className="p-4 font-medium">วันที่</th>
                  <th className="p-4 font-medium text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-sm text-cv-text-dim">{payment.transactionId}</td>
                    <td className="p-4 font-semibold text-white">{payment.user.email}</td>
                    <td className="p-4 text-cv-accent font-bold">฿{payment.amount}</td>
                    <td className="p-4 text-cv-text-dim">{payment.rentalPlan}</td>
                    <td className="p-4">
                      {payment.status === "SUCCESS" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-500 text-xs rounded-full border border-green-500/20">
                          <CheckCircle2 className="w-3 h-3" /> สำเร็จ
                        </span>
                      )}
                      {payment.status === "FAILED" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-500 text-xs rounded-full border border-red-500/20">
                          <XCircle className="w-3 h-3" /> ล้มเหลว
                        </span>
                      )}
                      {payment.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full border border-yellow-500/20">
                          <Clock className="w-3 h-3" /> รอดำเนินการ
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-cv-text-dim">{payment.createdAt.toLocaleDateString()}</td>
                    <td className="p-4">
                      <PaymentActions paymentId={payment.id} slipUrl={payment.slipUrl} currentStatus={payment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col divide-y divide-white/5">
            {payments.map((payment) => (
              <div key={payment.id} className="p-4 flex flex-col gap-3 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white truncate text-sm">{payment.user.email}</div>
                    <div className="font-mono text-[10px] text-cv-text-dim mt-0.5 break-all">TXN: {payment.transactionId}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-cv-accent font-bold text-sm">฿{payment.amount}</div>
                    <div className="text-[10px] text-cv-text-dim mt-0.5">{payment.createdAt.toLocaleDateString("th-TH")}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-white/5 text-cv-text-dim text-[10px] rounded-full border border-white/10 uppercase">
                    {payment.rentalPlan}
                  </span>
                  
                  <div>
                    {payment.status === "SUCCESS" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] rounded-full border border-green-500/20">
                        <CheckCircle2 className="w-3 h-3" /> สำเร็จ
                      </span>
                    )}
                    {payment.status === "FAILED" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] rounded-full border border-red-500/20">
                        <XCircle className="w-3 h-3" /> ล้มเหลว
                      </span>
                    )}
                    {payment.status === "PENDING" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[10px] rounded-full border border-yellow-500/20">
                        <Clock className="w-3 h-3" /> รอดำเนินการ
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="pt-2 border-t border-white/5 flex justify-end">
                  <PaymentActions paymentId={payment.id} slipUrl={payment.slipUrl} currentStatus={payment.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
