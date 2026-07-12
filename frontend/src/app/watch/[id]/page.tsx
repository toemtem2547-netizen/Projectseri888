import { notFound } from "next/navigation";
import PreviewPlayer from "@/components/shared/PreviewPlayer";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ep?: string }>;
}

import Link from "next/link";
import { Play, ChevronLeft } from "lucide-react";

export default async function WatchPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { ep } = await searchParams;
  
  const movie = await prisma.movie.findUnique({
    where: { id },
    include: { episodes: { orderBy: { epNumber: 'asc' } } }
  });
  
  if (!movie) return notFound();

  let videoToPlay = movie.videoUrl;
  let titleToPlay = movie.title;
  let currentEpNumber = 1;

  if (movie.type === 'SERIES' && movie.episodes.length > 0) {
    currentEpNumber = ep ? parseInt(ep) : 1;
    const currentEp = movie.episodes.find(e => e.epNumber === currentEpNumber) || movie.episodes[0];
    videoToPlay = currentEp.videoUrl;
    titleToPlay = `${movie.title} - EP ${currentEp.epNumber}: ${currentEp.title}`;
  }

  // Override movie object for PreviewPlayer
  const playerMovie = { ...movie, videoUrl: videoToPlay, title: titleToPlay };

  // Check server-side access (Rental or VIP)
  let isUnlockedServer = false;
  let initialProgress = 0;
  
  const session = await auth();
  if (session?.user?.id) {
    const activeRental = await prisma.rental.findFirst({
      where: { userId: session.user.id, movieId: movie.id, status: "ACTIVE" }
    });
    const activeSub = await prisma.subscription.findFirst({
      where: { userId: session.user.id, status: "ACTIVE" }
    });
    if (activeRental || activeSub) {
      isUnlockedServer = true;
    }

    const history = await prisma.watchHistory.findUnique({
      where: { userId_movieId: { userId: session.user.id, movieId: movie.id } }
    });
    if (history) {
      initialProgress = history.progress;
    }
  }

  const isSeries = movie.type === 'SERIES' && movie.episodes.length > 0;

  return (
    <main className="min-h-screen bg-cv-deep p-4 md:p-6 text-white pt-24">
      <div className="mx-auto max-w-[1600px]">
        <div className={`grid grid-cols-1 ${isSeries ? 'lg:grid-cols-4 gap-6' : ''}`}>
          <div className={`${isSeries ? 'lg:col-span-3 flex flex-col items-center' : 'w-full max-w-[1440px] mx-auto'}`}>
            <div className={`${isSeries ? 'w-full max-w-[450px]' : 'w-full'}`}>
              <div className="mb-4 flex">
                <Link href={`/movie/${movie.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-cv-text-dim hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10">
                  <ChevronLeft className="w-4 h-4" />
                  กลับไปหน้าข้อมูล
                </Link>
              </div>
              <h1 className="mb-4 text-2xl font-bold font-heading">{titleToPlay}</h1>
              <PreviewPlayer 
                movie={playerMovie} 
                previewSeconds={movie.previewDuration}
                isUnlockedServer={isUnlockedServer} 
                initialProgress={initialProgress}
                nextEpisodeUrl={isSeries && currentEpNumber < movie.episodes.length ? `/watch/${movie.id}?ep=${currentEpNumber + 1}` : undefined}
              />

              <section className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md">
                <h2 className="font-bold text-lg text-white mb-2 font-heading">เรื่องย่อ</h2>
                <p className="text-cv-text-dim text-sm leading-relaxed">{movie.description}</p>
              </section>
            </div>
          </div>

          {/* Episode Sidebar for Series */}
          {isSeries && (
            <div className="lg:col-span-1 h-full">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sticky top-24 max-h-[calc(100vh-120px)] flex flex-col">
                <h2 className="text-xl font-bold text-white mb-4 font-heading flex items-center gap-2">
                  <Play className="w-5 h-5 text-cv-primary" /> ตอนทั้งหมด
                </h2>
                <div className="overflow-y-auto pr-2 space-y-2 flex-1 no-scrollbar">
                  {movie.episodes.map((episode) => {
                    const isActive = episode.epNumber === currentEpNumber;
                    return (
                      <Link 
                        key={episode.id} 
                        href={`/watch/${movie.id}?ep=${episode.epNumber}`}
                        className={`flex gap-3 p-2 rounded-xl transition-all ${isActive ? 'bg-cv-primary/20 border border-cv-primary/50' : 'hover:bg-white/10 border border-transparent'}`}
                      >
                        <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-black/50 border border-white/10">
                          <img src={movie.backdropUrl} alt={episode.title} className="w-full h-full object-cover opacity-70" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            {isActive ? <Play className="w-6 h-6 text-cv-primary fill-cv-primary" /> : <Play className="w-5 h-5 text-white/70" />}
                          </div>
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className={`text-xs font-bold ${isActive ? 'text-cv-primary' : 'text-cv-text-dim'}`}>EP {episode.epNumber}</span>
                          <span className={`text-sm font-medium line-clamp-2 ${isActive ? 'text-white' : 'text-cv-text-dim'}`}>{episode.title}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
