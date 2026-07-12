import { HeroCarousel } from "@/components/shared/HeroCarousel";
import { ContinueWatchingRow } from "@/components/shared/ContinueWatchingRow";
import { MovieGridSection } from "@/components/shared/MovieGridSection";
import { GenreSelector } from "@/components/shared/GenreSelector";
import { watchHistory } from "@/lib/data/users";
import { prisma } from "@/lib/db";
import { getPersonalizedRecommendations } from "@/lib/recommendations";

import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  // Fetch from Express Backend
  let allMovies: any[] = [];
  let featuredMovies: any[] = [];
  let categories: any[] = [];
  
  try {
    allMovies = await prisma.movie.findMany({
      orderBy: { createdAt: "desc" },
    });
    featuredMovies = allMovies.filter((m: any) => m.isFeatured);
    
    // Fallback categories for now
    categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      take: 8,
    });
  } catch (error) {
    console.error("Failed to fetch from database:", error);
  }

  const carouselMovies = featuredMovies.length > 0 ? featuredMovies : allMovies.slice(0, 3);
  const featured = allMovies.filter((m: any) => m.isFeatured); // To show below in grid if wanted, or just skip it
  const trending = allMovies.slice(0, 6);
  const recommended = await getPersonalizedRecommendations(session?.user?.id, 6);

  let userWatchHistory: any[] = [];
  if (session?.user?.id) {
    const history = await prisma.watchHistory.findMany({
      where: { userId: session.user.id },
      include: { movie: true },
      orderBy: { lastWatched: "desc" },
      take: 4,
    });
    
    userWatchHistory = history.map(h => {
      let progressPercent = 0;
      if (h.movie.duration) {
         const hMatch = h.movie.duration.match(/(\d+)h/i);
         const mMatch = h.movie.duration.match(/(\d+)m/i);
         const hrs = hMatch ? parseInt(hMatch[1]) : 0;
         const mins = mMatch ? parseInt(mMatch[1]) : 0;
         const totalSecs = (hrs * 3600) + (mins * 60);
         if (totalSecs > 0) {
            progressPercent = Math.min(100, Math.floor((h.progress / totalSecs) * 100));
         } else if (h.progress > 0) {
            progressPercent = Math.min(100, h.progress); // fallback if duration parsing fails
         }
      }
      
      return {
        movieId: h.movie.id,
        movieTitle: h.movie.title,
        posterUrl: h.movie.posterUrl,
        progress: progressPercent,
        lastWatched: h.lastWatched.toISOString().split('T')[0],
        duration: h.movie.duration
      };
    });
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1920px]">
        {carouselMovies.length > 0 ? (
          <HeroCarousel featuredMovies={carouselMovies} />
        ) : (
          <div className="h-[60vh] rounded-[32px] border border-white/10 bg-cv-card flex items-center justify-center">
            <h1 className="text-2xl text-cv-text-dim">ยังไม่มีภาพยนตร์ในระบบ</h1>
          </div>
        )}

        <div className="mt-8 space-y-8">
          <ContinueWatchingRow items={userWatchHistory} />
          
          {featured.length > 0 && (
            <MovieGridSection
              title="ภาพยนตร์แนะนำพิเศษ (Featured)"
              subtitle="คัดสรรผลงานระดับมาสเตอร์พีซที่คุณต้องไม่พลาด"
              items={featured}
            />
          )}

          {trending.length > 0 && (
            <MovieGridSection
              title="เรื่องมาแรงประจำสัปดาห์"
              subtitle="คัดสรรผลงานยอดนิยมสำหรับผู้ชมสายพรีเมียม"
              items={trending}
            />
          )}
          
          <GenreSelector categories={categories} />
          
          {recommended.length > 0 && (
            <MovieGridSection
              title="แนะนำสำหรับคุณ"
              subtitle="คัดเลือกเพื่อประสบการณ์ชมภาพยนตร์พรีเมียม"
              items={recommended}
            />
          )}
        </div>
      </div>
    </div>
  );
}
