import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

// Get user's active rentals
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

    let whereClause: any = { 
      userId: session.user.id,
      status: "ACTIVE",
    };

    if (movieId) {
      whereClause.movieId = movieId;
    }

    const rentals = await prisma.rental.findMany({
      where: whereClause,
      include: {
        movie: true,
      },
    });

    // Check expiration and update status if expired
    const now = new Date();
    const updatedRentals = await Promise.all(rentals.map(async (rental) => {
      if (rental.expiresAt && rental.expiresAt < now) {
        return await prisma.rental.update({
          where: { id: rental.id },
          data: { status: "EXPIRED" },
          include: { movie: true }
        });
      }
      return rental;
    }));

    return NextResponse.json(updatedRentals.filter(r => r.status === "ACTIVE"));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rentals" }, { status: 500 });
  }
}
