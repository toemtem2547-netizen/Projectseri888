import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import MovieCard from "@/components/shared/MovieCard";

export const metadata = {
  title: "My Watchlist - CineVault",
  description: "ภาพยนตร์และซีรีส์ที่คุณบันทึกไว้",
};

export default async function WatchlistPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/watchlist");
  }

  const watchlistItems = await prisma.watchlist.findMany({
    where: { userId: session.user.id },
    include: { movie: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen pt-28 px-4 md:px-8 max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white font-heading mb-2">My Watchlist</h1>
        <p className="text-cv-text-dim">ภาพยนตร์และซีรีส์ที่คุณต้องการรับชม ({watchlistItems.length} รายการ)</p>
      </div>

      {watchlistItems.length === 0 ? (
        <div className="h-[50vh] flex flex-col items-center justify-center bg-white/5 rounded-3xl border border-white/10">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cv-text-dim"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">ยังไม่มีรายการใน Watchlist</h2>
          <p className="text-cv-text-dim text-center max-w-md">
            ค้นหาภาพยนตร์และซีรีส์ที่คุณชื่นชอบแล้วกดที่ไอคอนหัวใจเพื่อเพิ่มเข้ารายการ
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {watchlistItems.map((item, i) => (
            <MovieCard key={item.id} movie={item.movie} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
