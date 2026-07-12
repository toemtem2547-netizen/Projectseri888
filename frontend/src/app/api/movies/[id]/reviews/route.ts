import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: movieId } = await context.params;
    const body = await request.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const { rating, comment } = result.data;

    // Check if user actually bought/rented it to review (Optional, but let's allow anyone who is logged in to review for now, or just renters)
    // To make it strict:
    const rental = await prisma.rental.findFirst({
      where: { userId: session.user.id, movieId }
    });
    
    if (!rental) {
      return NextResponse.json({ error: "You must rent or buy this movie to review it." }, { status: 403 });
    }

    const review = await prisma.review.upsert({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId: movieId,
        }
      },
      update: {
        rating,
        comment,
      },
      create: {
        userId: session.user.id,
        movieId,
        rating,
        comment,
      }
    });

    // Update movie rating average
    const allReviews = await prisma.review.findMany({ where: { movieId } });
    const avg = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    
    await prisma.movie.update({
      where: { id: movieId },
      data: {
        rating: Math.round(avg * 10) / 10,
        ratingCount: allReviews.length
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: movieId } = await context.params;
    const url = new URL(request.url);
    const reviewId = url.searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    // Verify ownership or admin role
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.review.delete({
      where: { id: reviewId }
    });

    // Update movie rating average
    const allReviews = await prisma.review.findMany({ where: { movieId } });
    const avg = allReviews.length > 0 ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length : 0;
    
    await prisma.movie.update({
      where: { id: movieId },
      data: {
        rating: Math.round(avg * 10) / 10,
        ratingCount: allReviews.length
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
