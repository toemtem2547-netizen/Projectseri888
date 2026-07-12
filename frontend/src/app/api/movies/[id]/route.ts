import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const movie = await prisma.movie.findUnique({
      where: { id },
    });
    if (!movie) return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch movie" }, { status: 500 });
  }
}

import { z } from "zod";

const movieSchema = z.object({
  type: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  posterUrl: z.string().url().or(z.literal("")),
  backdropUrl: z.string().url().or(z.literal("")),
  trailerUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  genres: z.string(),
  year: z.string().regex(/^\d{4}$/),
  duration: z.string(),
  previewDuration: z.string().optional(),
  price24h: z.string(),
  price7d: z.string(),
  priceLifetime: z.string(),
  releaseDate: z.string(),
  isFeatured: z.boolean().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const result = movieSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }
    const data = result.data;
    const movie = await prisma.movie.update({
      where: { id },
      data: {
        type: data.type,
        title: data.title,
        description: data.description,
        posterUrl: data.posterUrl,
        backdropUrl: data.backdropUrl,
        trailerUrl: data.trailerUrl,
        videoUrl: data.videoUrl,
        genres: data.genres,
        year: parseInt(data.year),
        duration: data.duration,
        previewDuration: parseInt(data.previewDuration || "80"),
        price24h: parseFloat(data.price24h),
        price7d: parseFloat(data.price7d),
        priceLifetime: parseFloat(data.priceLifetime),
        releaseDate: data.releaseDate,
        isFeatured: data.isFeatured,
      },
    });

    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update movie" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.movie.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 });
  }
}
