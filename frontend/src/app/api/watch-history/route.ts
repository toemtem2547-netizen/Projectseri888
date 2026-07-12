import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const history = await prisma.watchHistory.findMany({
      where: { userId: session.user.id },
      include: { movie: true },
      orderBy: { lastWatched: "desc" },
      take: 10
    });

    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch watch history" }, { status: 500 });
  }
}

import { z } from "zod";

const historySchema = z.object({
  movieId: z.string().min(1, "Movie ID is required"),
  progress: z.number().min(0),
  completed: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = historySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const { movieId, progress, completed } = result.data;

    const existing = await prisma.watchHistory.findUnique({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId: movieId,
        }
      }
    });

    if (existing) {
      const updated = await prisma.watchHistory.update({
        where: { id: existing.id },
        data: { 
          progress: Math.floor(progress), 
          completed: completed || false,
          lastWatched: new Date()
        }
      });
      return NextResponse.json({ success: true, history: updated });
    } else {
      const created = await prisma.watchHistory.create({
        data: {
          userId: session.user.id,
          movieId: movieId,
          progress: Math.floor(progress),
          completed: completed || false,
        }
      });
      return NextResponse.json({ success: true, history: created });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update watch history" }, { status: 500 });
  }
}
