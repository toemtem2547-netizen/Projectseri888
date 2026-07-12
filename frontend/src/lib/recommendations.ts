import { prisma } from "./db";
import { Movie } from "@prisma/client";

/**
 * Returns personalized movie recommendations for a user based on their watch history.
 * If the user has no history or is not logged in, returns globally popular movies.
 */
export async function getPersonalizedRecommendations(userId?: string | null, limit: number = 6): Promise<Movie[]> {
  try {
    // 1. If not logged in, return globally popular movies
    if (!userId) {
      return getFallbackRecommendations([], limit);
    }

    // 2. Fetch User's Watch History
    const history = await prisma.watchHistory.findMany({
      where: { userId },
      include: { movie: true },
      orderBy: { lastWatched: "desc" },
      take: 20, // look at the last 20 movies
    });

    const watchedMovieIds = history.map((h) => h.movieId);

    if (history.length === 0) {
      return getFallbackRecommendations([], limit);
    }

    // 3. Analyze Genres
    const genreScore: Record<string, number> = {};
    history.forEach((h) => {
      if (h.movie.genres) {
        const genres = h.movie.genres.split(",").map((g) => g.trim());
        genres.forEach((g) => {
          if (!genreScore[g]) genreScore[g] = 0;
          // Weighted score: movies watched longer or recently could have higher score, 
          // but for simplicity, 1 point per occurrence.
          genreScore[g] += 1;
        });
      }
    });

    // 4. Get Top 2 Genres
    const sortedGenres = Object.entries(genreScore)
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0]);
    
    const topGenres = sortedGenres.slice(0, 2);

    if (topGenres.length === 0) {
      return getFallbackRecommendations(watchedMovieIds, limit);
    }

    // 5. Fetch movies matching the top genres
    // Using Prisma OR to find any movie that contains the top genres
    const orConditions = topGenres.map(genre => ({
      genres: { contains: genre }
    }));

    const recommendedMovies = await prisma.movie.findMany({
      where: {
        id: { notIn: watchedMovieIds },
        OR: orConditions,
      },
      orderBy: [
        { rating: "desc" },
        { ratingCount: "desc" }
      ],
      take: limit,
    });

    // 6. Fill with fallback if we didn't get enough recommendations
    if (recommendedMovies.length < limit) {
      const remainingSlots = limit - recommendedMovies.length;
      const alreadySelectedIds = recommendedMovies.map(m => m.id);
      const excludeIds = [...watchedMovieIds, ...alreadySelectedIds];
      
      const fallbackMovies = await getFallbackRecommendations(excludeIds, remainingSlots);
      return [...recommendedMovies, ...fallbackMovies];
    }

    return recommendedMovies;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return getFallbackRecommendations([], limit);
  }
}

async function getFallbackRecommendations(excludeIds: string[], limit: number): Promise<Movie[]> {
  try {
    return await prisma.movie.findMany({
      where: excludeIds.length > 0 ? { id: { notIn: excludeIds } } : undefined,
      orderBy: [
        { rating: "desc" },
        { ratingCount: "desc" }
      ],
      take: limit,
    });
  } catch (error) {
    console.error("Error fetching fallback recommendations:", error);
    return [];
  }
}
