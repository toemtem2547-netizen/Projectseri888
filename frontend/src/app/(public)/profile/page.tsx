import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { User, Film, CreditCard, LogOut, Heart } from "lucide-react";
import Link from "next/link";
import { ProfileEditor } from "./ProfileEditor";
import { PaymentHistoryList } from "./PaymentHistoryList";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      rentals: {
        include: { movie: true },
        orderBy: { createdAt: "desc" }
      },
      payments: {
        orderBy: { createdAt: "desc" }
      },
      watchHistory: {
        include: { movie: true },
        orderBy: { lastWatched: "desc" }
      },
      watchlist: {
        include: { movie: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  const activeRentals = user.rentals.filter(r => r.status === "ACTIVE");

  // Fetch movie titles for payment history mapping
  const paymentMovieIds = [...new Set(user.payments.map(p => p.movieId).filter(Boolean) as string[])];
  const paymentMovies = await prisma.movie.findMany({
    where: { id: { in: paymentMovieIds } },
    select: { id: true, title: true }
  });
  const movieMapArray: [string, string][] = paymentMovies.map(m => [m.id, m.title]);

  return (
    <div className="min-h-screen px-4 pb-8 pt-32 md:px-8 md:pb-12 md:pt-40">
      <div className="mx-auto max-w-[1440px]">
        <h1 className="text-3xl font-bold font-heading text-white mb-8">โปรไฟล์ของฉัน</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <ProfileEditor user={user} />
            <PaymentHistoryList payments={user.payments} movieMapArray={movieMapArray} />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Film className="w-6 h-6 text-cv-primary" />
                  <h2 className="text-2xl font-bold text-white">ภาพยนตร์ของฉัน (เช่า/ซื้อแล้ว)</h2>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {activeRentals.length === 0 ? (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-cv-text-dim mb-4">คุณยังไม่มีภาพยนตร์ที่สามารถรับชมได้</p>
                    <Link href="/" className="px-6 py-2 rounded-full bg-cv-primary/10 text-cv-primary hover:bg-cv-primary/20 transition-colors">
                      เลือกชมภาพยนตร์
                    </Link>
                  </div>
                ) : (
                  activeRentals.map((rental) => (
                    <Link key={rental.id} href={`/watch/${rental.movieId}`} className="group block rounded-2xl bg-white/5 border border-white/10 p-2 transition hover:-translate-y-1 hover:border-cv-primary/50">
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3">
                        <img src={rental.movie.posterUrl} alt={rental.movie.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-cv-primary/90 flex items-center justify-center text-white shadow-lg">
                            <Film className="w-6 h-6" />
                          </div>
                        </div>
                      </div>
                      <div className="px-1">
                        <p className="text-sm font-bold text-white truncate">{rental.movie.title}</p>
                        <p className="text-xs text-cv-text-dim mt-1">
                          {rental.plan === "lifetime" ? "ซื้อถาวร" : rental.expiresAt ? `หมดอายุ: ${rental.expiresAt.toLocaleDateString()}` : `แพ็กเกจ: ${rental.plan}`}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Watch History */}
            {user.watchHistory.length > 0 && (
              <div className="glass-card p-6 rounded-3xl mt-8">
                <div className="flex items-center gap-2 mb-6">
                  <Film className="w-6 h-6 text-cv-accent" />
                  <h2 className="text-2xl font-bold text-white">ประวัติการรับชมล่าสุด</h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {user.watchHistory.slice(0, 4).map((history) => (
                    <Link key={history.id} href={`/watch/${history.movieId}`} className="group block rounded-2xl bg-white/5 border border-white/10 p-2 transition hover:-translate-y-1 hover:border-cv-accent/50">
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3">
                        <img src={history.movie.posterUrl} alt={history.movie.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="px-1">
                        <p className="text-sm font-bold text-white truncate">{history.movie.title}</p>
                        <p className="text-xs text-cv-text-dim mt-1">{history.lastWatched.toLocaleDateString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Watchlist */}
            {user.watchlist.length > 0 && (
              <div className="glass-card p-6 rounded-3xl mt-8 border border-white/10">
                <div className="flex items-center gap-2 mb-6">
                  <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
                  <h2 className="text-2xl font-bold text-white">รายการที่อยากดู (Watchlist)</h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {user.watchlist.map((item) => (
                    <Link key={item.id} href={`/movie/${item.movieId}`} className="group block rounded-2xl bg-white/5 border border-white/10 p-2 transition hover:-translate-y-1 hover:border-red-500/50">
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3">
                        <img src={item.movie.posterUrl} alt={item.movie.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="px-1">
                        <p className="text-sm font-bold text-white truncate">{item.movie.title}</p>
                        <p className="text-xs text-cv-text-dim mt-1">เพิ่มเมื่อ: {item.createdAt.toLocaleDateString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
