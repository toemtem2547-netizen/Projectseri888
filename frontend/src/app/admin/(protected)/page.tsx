import Link from "next/link";
import { Plus, Film, TrendingUp, Wallet, Users, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { AnalyticsCharts } from "./analytics/AnalyticsCharts";

export default async function AdminPage() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const now = new Date();
  const [totalViews, totalUsers, activeVIPs, recentPayments, revenueAgg, paymentsForCharts] = await Promise.all([
    prisma.watchHistory.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.subscription.count({ where: { status: "ACTIVE", expiresAt: { gt: now } } }),
    prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true }
    }),
    prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true }
    }),
    prisma.payment.findMany({
      where: { status: "SUCCESS" },
      select: { amount: true, createdAt: true, rentalPlan: true }
    })
  ]);

  const totalRevenue = Number(revenueAgg._sum.amount || 0);

  // Manually fetch movies for the recent payments to avoid schema change
  const movieIds = recentPayments.map(p => p.movieId).filter(Boolean) as string[];
  const relatedMovies = await prisma.movie.findMany({
    where: { id: { in: movieIds } },
    select: { id: true, title: true }
  });
  const movieMap = new Map(relatedMovies.map(m => [m.id, m.title]));

  // Generate chart data
  const revenueByDate: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
    revenueByDate[dateStr] = 0;
  }
  paymentsForCharts.forEach(p => {
    if (p.createdAt >= sevenDaysAgo) {
      const dateStr = p.createdAt.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
      if (revenueByDate[dateStr] !== undefined) {
        revenueByDate[dateStr] += p.amount;
      }
    }
  });
  const revenueData = Object.keys(revenueByDate).map(key => ({ date: key, amount: revenueByDate[key] }));

  let p24 = 0, p7d = 0, plife = 0;
  paymentsForCharts.forEach(p => {
    if (p.rentalPlan === "24h") p24++;
    else if (p.rentalPlan === "7d") p7d++;
    else if (p.rentalPlan === "lifetime") plife++;
  });
  const planData = [
    { name: "3 วัน (เช่า)", value: p24 },
    { name: "VIP", value: p7d + plife }
  ].filter(p => p.value > 0);

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-medium text-cv-text-dim uppercase tracking-wider mb-1">ภาพรวมระบบ</p>
            <h1 className="text-3xl font-bold font-heading text-white">แดชบอร์ดผู้ดูแล</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Film className="w-20 h-20 text-cv-primary" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cv-primary/20 flex items-center justify-center text-cv-primary">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="text-cv-text-dim font-medium">ยอดเข้าชมทั้งหมด</h3>
            </div>
            <p className="text-4xl font-bold text-white">{totalViews.toLocaleString()}</p>
          </div>

          <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-20 h-20 text-cv-secondary" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cv-secondary/20 flex items-center justify-center text-cv-secondary">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-cv-text-dim font-medium">สมาชิกทั้งหมด</h3>
            </div>
            <p className="text-4xl font-bold text-white">{totalUsers.toLocaleString()}</p>
          </div>

          <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wallet className="w-20 h-20 text-cv-accent" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cv-accent/20 flex items-center justify-center text-cv-accent">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-cv-text-dim font-medium">สมาชิก VIP ใช้งานอยู่</h3>
            </div>
            <p className="text-4xl font-bold text-white">{activeVIPs.toLocaleString()}</p>
          </div>

          <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-20 h-20 text-green-500" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-cv-text-dim font-medium">รายได้รวม</h3>
            </div>
            <p className="text-4xl font-bold text-white">฿{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts Section */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-1 mb-8 overflow-hidden">
               <AnalyticsCharts revenueData={revenueData} planData={planData} />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full max-h-[800px]">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white font-heading">รายการล่าสุด</h2>
                <Link href="/admin/payments" className="text-cv-secondary text-sm hover:underline flex items-center gap-1">ดูทั้งหมด <ArrowRight className="w-4 h-4"/></Link>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {recentPayments.length > 0 ? recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-cv-primary/20 flex items-center justify-center text-cv-primary font-bold">
                      {payment.user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">{payment.user?.name || "ผู้ใช้งาน"}</p>
                      <p className="text-xs text-cv-text-dim truncate">{payment.movieId ? (movieMap.get(payment.movieId) || "ไม่ทราบชื่อเรื่อง") : "สมัคร VIP"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">฿{payment.amount}</p>
                      <p className="text-[10px] text-cv-text-dim">{new Date(payment.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-cv-text-dim py-8">ยังไม่มีรายการ</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
