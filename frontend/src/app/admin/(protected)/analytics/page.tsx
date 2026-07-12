import { prisma } from "@/lib/db";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { TrendingUp, Film } from "lucide-react";

export default async function AdminAnalyticsPage() {
  // Generate last 7 days revenue
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const payments = await prisma.payment.findMany({
    where: { 
      status: "SUCCESS",
      createdAt: { gte: sevenDaysAgo }
    },
    select: { amount: true, createdAt: true }
  });

  const revenueByDate: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
    revenueByDate[dateStr] = 0;
  }

  let total7Days = 0;
  payments.forEach(p => {
    const dateStr = p.createdAt.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
    if (revenueByDate[dateStr] !== undefined) {
      revenueByDate[dateStr] += p.amount;
      total7Days += p.amount;
    }
  });

  const revenueData = Object.keys(revenueByDate).map(key => ({
    date: key,
    amount: revenueByDate[key]
  }));

  // Plan proportion
  const allPayments = await prisma.payment.findMany({
    where: { status: "SUCCESS" },
    select: { rentalPlan: true }
  });

  let p24 = 0, p7d = 0, plife = 0;
  allPayments.forEach(p => {
    if (p.rentalPlan === "24h") p24++;
    else if (p.rentalPlan === "7d") p7d++;
    else if (p.rentalPlan === "lifetime") plife++;
  });

  const planData = [
    { name: "24 ชั่วโมง", value: p24 },
    { name: "7 วัน", value: p7d },
    { name: "ถาวร", value: plife }
  ].filter(p => p.value > 0);

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading text-white">สถิติและรายได้</h1>
          <p className="text-cv-text-dim mt-1">ข้อมูลเชิงลึกและการวิเคราะห์ระบบ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border border-white/10">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-cv-text-dim">รายได้ 7 วันล่าสุด</p>
              <p className="text-3xl font-bold text-white">฿{total7Days.toLocaleString()}</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border border-white/10">
            <div className="w-12 h-12 rounded-full bg-cv-primary/20 flex items-center justify-center text-cv-primary">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <p className="text-cv-text-dim">ยอดขายทั้งหมด</p>
              <p className="text-3xl font-bold text-white">{allPayments.length} รายการ</p>
            </div>
          </div>
        </div>

        <AnalyticsCharts revenueData={revenueData} planData={planData} />
      </div>
    </main>
  );
}
