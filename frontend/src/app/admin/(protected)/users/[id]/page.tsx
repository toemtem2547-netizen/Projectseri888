import { prisma } from "@/lib/db";
import { ArrowLeft, User, Film, PlayCircle, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const user = await prisma.user.findUnique({
    where: { id: resolvedParams.id },
    include: {
      rentals: {
        include: { movie: true },
        orderBy: { createdAt: "desc" },
      },
      watchHistory: {
        include: { movie: true },
        orderBy: { lastWatched: "desc" },
      },
    },
  });

  if (!user) notFound();

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/users" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold font-heading text-white">ประวัติผู้ใช้งาน</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info */}
          <div className="glass-card rounded-2xl p-6 h-fit">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cv-primary/20 to-cv-secondary/20 flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-cv-primary" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{user.name || "ไม่มีชื่อ"}</h2>
              <p className="text-cv-text-dim text-sm">{user.email}</p>
              
              <div className="mt-6 w-full border-t border-white/10 pt-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-cv-text-dim">สถานะ</span>
                  <span className={`px-3 py-1 rounded-full text-xs border ${
                    user.role === 'ADMIN' ? 'bg-cv-accent/10 border-cv-accent/20 text-cv-accent' :
                    user.role === 'BANNED' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                    'bg-white/5 border-white/10 text-cv-text-dim'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-cv-text-dim">เช่าแล้ว</span>
                  <span className="text-white font-semibold">{user.rentals.length} เรื่อง</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-cv-text-dim">ประวัติการดู</span>
                  <span className="text-white font-semibold">{user.watchHistory.length} รายการ</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {/* Rentals */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Film className="w-5 h-5 text-cv-primary" />
                <h3 className="text-xl font-bold text-white">ประวัติการเช่า</h3>
              </div>
              
              {user.rentals.length === 0 ? (
                <p className="text-cv-text-dim text-sm text-center py-8">ยังไม่มีประวัติการเช่า</p>
              ) : (
                <div className="space-y-4">
                  {user.rentals.map(rental => (
                    <div key={rental.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-4">
                        <img src={rental.movie.posterUrl} alt={rental.movie.title} className="w-12 h-16 object-cover rounded-md" />
                        <div>
                          <div className="font-semibold text-white">{rental.movie.title}</div>
                          <div className="text-xs text-cv-text-dim mt-1">แพ็กเกจ: {rental.plan}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs px-2 py-1 rounded-md inline-block mb-1 ${
                          rental.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {rental.status}
                        </div>
                        <div className="text-xs text-cv-text-dim">
                          {new Date(rental.createdAt).toLocaleDateString("th-TH")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Watch History */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <PlayCircle className="w-5 h-5 text-cv-secondary" />
                <h3 className="text-xl font-bold text-white">ประวัติการรับชม</h3>
              </div>
              
              {user.watchHistory.length === 0 ? (
                <p className="text-cv-text-dim text-sm text-center py-8">ยังไม่มีประวัติการรับชม</p>
              ) : (
                <div className="space-y-4">
                  {user.watchHistory.map(history => (
                    <div key={history.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                      <img src={history.movie.backdropUrl} alt={history.movie.title} className="w-24 h-14 object-cover rounded-md" />
                      <div className="flex-1">
                        <div className="font-semibold text-white text-sm">{history.movie.title}</div>
                        <div className="flex items-center gap-1 text-xs text-cv-text-dim mt-1">
                          <Clock className="w-3 h-3" />
                          รับชมล่าสุด: {new Date(history.lastWatched).toLocaleDateString("th-TH")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-cv-text-dim">เวลาที่ดูไป</div>
                        <div className="font-medium text-white">{Math.floor(history.progress / 60)} นาที</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
