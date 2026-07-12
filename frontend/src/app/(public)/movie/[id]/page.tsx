import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import MovieDetailClient from "./MovieDetailClient";
import { auth } from "@/auth";

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  let movie = null;
  try {
    movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        reviews: {
          include: { user: true },
          orderBy: { createdAt: 'desc' }
        },
        episodes: {
          orderBy: { epNumber: 'asc' }
        }
      }
    });
  } catch (error) {
    console.error("Failed to fetch movie from database:", error);
  }

  if (!movie) {
    return notFound();
  }

  let isWatchlisted = false;
  let hasAccess = false;
  
  if (session?.user?.id) {
    const watchlistItem = await prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId: id,
        }
      }
    });
    isWatchlisted = !!watchlistItem;
    
    const activeRental = await prisma.rental.findFirst({
      where: { userId: session.user.id, movieId: id, status: "ACTIVE" }
    });
    const activeSub = await prisma.subscription.findFirst({
      where: { userId: session.user.id, status: "ACTIVE" }
    });
    if (activeRental || activeSub) {
      hasAccess = true;
    }
  }

  let similar: any[] = [];
  try {
    const mainGenre = movie.genres.split(',')[0].trim();
    similar = await prisma.movie.findMany({
      where: {
        id: { not: id },
        genres: { contains: mainGenre }
      },
      take: 6
    });
    // If not enough similar by genre, just grab some latest movies
    if (similar.length < 4) {
      const existingIds = [id, ...similar.map(m => m.id)];
      const more = await prisma.movie.findMany({
        where: { id: { notIn: existingIds } },
        orderBy: { createdAt: 'desc' },
        take: 6 - similar.length
      });
      similar = [...similar, ...more];
    }
  } catch (error) {
    console.error("Failed to fetch similar movies from database:", error);
  }

  return <MovieDetailClient movie={movie} similar={similar} isWatchlisted={isWatchlisted} hasAccess={hasAccess} currentUser={session?.user} />;
}
