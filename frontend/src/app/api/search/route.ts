import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q) {
      return NextResponse.json([]);
    }

    const movies = await prisma.movie.findMany({
      where: {
        title: {
          contains: q,
        }
      },
      take: 5,
    });

    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
