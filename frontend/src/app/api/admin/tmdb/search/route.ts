import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const tmdbApiKey = process.env.TMDB_API_KEY;
    if (!tmdbApiKey) {
      // Return a simulated response if API key is not set
      // This helps the user test the UI without needing an API key immediately
      return NextResponse.json({
        results: [
          {
            id: 1,
            title: "Simulated Movie (No API Key)",
            name: "Simulated Series (No API Key)",
            overview: "This is a simulated description because TMDB_API_KEY is not set in the .env file.",
            poster_path: null,
            backdrop_path: null,
            media_type: "movie",
            release_date: "2025-01-01",
            first_air_date: "2025-01-01"
          }
        ]
      });
    }

    const url = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&language=th-TH&query=${encodeURIComponent(query)}&page=1`;
    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("TMDB search error:", error);
    return NextResponse.json({ error: "Failed to fetch from TMDB" }, { status: 500 });
  }
}
