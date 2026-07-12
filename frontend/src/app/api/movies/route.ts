import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const genre = searchParams.get("genre");
    
    let whereClause = {};
    if (query) {
      whereClause = {
        title: {
          contains: query,
        }
      };
    } else if (genre) {
      whereClause = {
        genres: {
          contains: genre,
        }
      };
    }

    const movies = await prisma.movie.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
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

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = movieSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }
    const data = result.data;
    
    const movie = await prisma.movie.create({
      data: {
        type: data.type || "MOVIE",
        title: data.title,
        description: data.description,
        posterUrl: data.posterUrl,
        backdropUrl: data.backdropUrl,
        trailerUrl: data.trailerUrl,
        videoUrl: data.videoUrl,
        genres: data.genres,
        year: parseInt(data.year),
        duration: data.duration,
        previewDuration: parseInt(data.previewDuration || "120"),
        price24h: parseFloat(data.price24h),
        price7d: parseFloat(data.price7d),
        priceLifetime: parseFloat(data.priceLifetime),
        releaseDate: data.releaseDate,
        isFeatured: data.isFeatured || false,
      },
    });

    // Notify all users about the new movie
    try {
      const users = await prisma.user.findMany({ select: { id: true } });
      if (users.length > 0) {
        await prisma.notification.createMany({
          data: users.map((u) => ({
            userId: u.id,
            title: "🎬 คอนเทนต์ใหม่เข้าแล้ว!",
            message: `เรื่อง "${movie.title}" เปิดให้รับชมแล้ววันนี้ ห้ามพลาด!`,
          })),
        });
      }
    } catch (e) {
      console.error("Failed to send new movie notifications", e);
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create movie" }, { status: 500 });
  }
}
