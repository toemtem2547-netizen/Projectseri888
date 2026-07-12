import { prisma } from "@/lib/db";
import { Clock, User, Film, Calendar, AlertCircle } from "lucide-react";
import { RentalActions } from "./RentalActions";
import Link from "next/link";

export default async function AdminRentalsPage() {
  const rentals = await prisma.rental.findMany({
    include: {
      user: true,
      movie: true
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cv-primary to-cv-secondary flex items-center justify-center shadow-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-heading text-white">จัดการการเช่าภาพยนตร์</h1>
            <p className="text-cv-text-dim text-sm mt-1">ดูประวัติการเช่าทั้งหมด และต่ออายุเวลาให้ลูกค้า</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-cv-text-dim text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">ผู้ใช้งาน</th>
                  <th className="p-4 font-medium">ภาพยนตร์</th>
                  <th className="p-4 font-medium">แพ็กเกจเช่า</th>
                  <th className="p-4 font-medium">หมดอายุวันที่</th>
                  <th className="p-4 font-medium text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rentals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-cv-text-dim">
                      ยังไม่มีข้อมูลการเช่า
                    </td>
                  </tr>
                ) : (
                  rentals.map((rental) => {
                    const isExpired = rental.status === "EXPIRED" || (rental.expiresAt && new Date(rental.expiresAt) < new Date());
                    
                    return (
                      <tr key={rental.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-cv-primary/20 flex items-center justify-center text-cv-primary">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-semibold text-white">{rental.user.email}</div>
                              <div className="text-xs text-cv-text-dim">{rental.user.name || "ไม่มีชื่อ"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {rental.movie.posterUrl ? (
                              <img src={rental.movie.posterUrl} alt="poster" className="w-8 h-12 object-cover rounded" />
                            ) : (
                              <div className="w-8 h-12 bg-white/10 rounded flex items-center justify-center"><Film className="w-4 h-4 text-white/30" /></div>
                            )}
                            <div className="font-medium text-white max-w-[200px] truncate" title={rental.movie.title}>{rental.movie.title}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-white/5 text-white text-xs rounded-full border border-white/10 uppercase">
                            {rental.plan}
                          </span>
                        </td>
                        <td className="p-4">
                          {isExpired ? (
                            <span className="inline-flex items-center gap-1.5 text-red-500 text-sm font-medium">
                              <AlertCircle className="w-4 h-4" />
                              หมดอายุแล้ว
                            </span>
                          ) : rental.expiresAt ? (
                            <span className="inline-flex items-center gap-1.5 text-cv-primary text-sm font-medium">
                              <Calendar className="w-4 h-4" />
                              {new Date(rental.expiresAt).toLocaleString("th-TH")}
                            </span>
                          ) : (
                            <span className="text-cv-text-dim text-sm">ตลอดชีพ</span>
                          )}
                        </td>
                        <td className="p-4">
                          <RentalActions rentalId={rental.id} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col divide-y divide-white/5">
            {rentals.length === 0 ? (
              <div className="p-8 text-center text-cv-text-dim">ยังไม่มีข้อมูลการเช่า</div>
            ) : (
              rentals.map((rental) => {
                const isExpired = rental.status === "EXPIRED" || (rental.expiresAt && new Date(rental.expiresAt) < new Date());
                return (
                  <div key={rental.id} className="p-4 flex flex-col gap-3 hover:bg-white/5 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cv-primary/20 flex items-center justify-center text-cv-primary flex-shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate text-sm">{rental.user.email}</div>
                          <div className="text-xs text-cv-text-dim truncate">{rental.user.name || "ไม่มีชื่อ"}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-white/5 text-white text-[10px] rounded-full border border-white/10 uppercase shrink-0">
                        {rental.plan}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1 bg-black/20 p-2 rounded-lg border border-white/5">
                      {rental.movie.posterUrl ? (
                        <img src={rental.movie.posterUrl} alt="poster" className="w-10 h-14 object-cover rounded shadow-md shrink-0" />
                      ) : (
                        <div className="w-10 h-14 bg-white/10 rounded flex items-center justify-center shrink-0"><Film className="w-4 h-4 text-white/30" /></div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-white text-sm truncate">{rental.movie.title}</div>
                        <div className="mt-1">
                          {isExpired ? (
                            <span className="inline-flex items-center gap-1 text-red-500 text-xs font-medium">
                              <AlertCircle className="w-3 h-3" /> หมดอายุ
                            </span>
                          ) : rental.expiresAt ? (
                            <span className="inline-flex items-center gap-1 text-cv-primary text-xs font-medium">
                              <Calendar className="w-3 h-3" /> {new Date(rental.expiresAt).toLocaleDateString("th-TH")}
                            </span>
                          ) : (
                            <span className="text-cv-text-dim text-xs">ตลอดชีพ</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-white/5 flex justify-end">
                      <RentalActions rentalId={rental.id} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
