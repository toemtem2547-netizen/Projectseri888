import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const watchlist = await prisma.watchlist.findMany({
      where: { userId: session.user.id },
      include: { movie: true },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(watchlist);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 });
  }
}

import { z } from "zod";

const watchlistSchema = z.object({
  movieId: z.string().min(1, "Movie ID is required"),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = watchlistSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const { movieId } = result.data;

    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId: movieId,
        }
      }
    });

    if (existing) {
      await prisma.watchlist.delete({
        where: { id: existing.id }
      });
      return NextResponse.json({ success: true, added: false });
    } else {
      await prisma.watchlist.create({
        data: {
          userId: session.user.id,
          movieId: movieId,
        }
      });
      return NextResponse.json({ success: true, added: true });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update watchlist" }, { status: 500 });
  }
}
