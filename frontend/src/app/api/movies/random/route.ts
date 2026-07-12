import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // We fetch a list of up to 50 movies to keep performance reasonable
    // In Prisma, getting random rows efficiently usually requires raw SQL or fetching IDs and shuffling.
    // For a small app, fetching the latest/all movies and picking random is fast enough.
    const movies = await prisma.movie.findMany({
      take: 100,
      select: {
        id: true,
        title: true,
        posterUrl: true,
        backdropUrl: true,
        genres: true,
        type: true
      }
    });

    if (movies.length === 0) {
      return NextResponse.json({ error: "No movies found" }, { status: 404 });
    }

    // Shuffle array using Fisher-Yates
    const shuffled = [...movies];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Pick 8 random movies
    const randomMovies = shuffled.slice(0, Math.min(8, shuffled.length));

    // Ensure we have exactly 8 elements for a balanced wheel by duplicating if necessary
    const wheelMovies = [];
    if (randomMovies.length > 0) {
      while (wheelMovies.length < 8) {
        for (const m of randomMovies) {
          if (wheelMovies.length < 8) wheelMovies.push(m);
        }
      }
    }

    return NextResponse.json(wheelMovies);
  } catch (error) {
    console.error("Error fetching random movies:", error);
    return NextResponse.json({ error: "Failed to fetch random movies" }, { status: 500 });
  }
}
