import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { epNumber, title, videoUrl, duration } = body;
    
    const ep = await prisma.episode.create({
      data: {
        movieId: id,
        epNumber: parseInt(epNumber),
        title,
        videoUrl,
        duration,
      },
    });

    return NextResponse.json(ep);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create episode" }, { status: 500 });
  }
}
