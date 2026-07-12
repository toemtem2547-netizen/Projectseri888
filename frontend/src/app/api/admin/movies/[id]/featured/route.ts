import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isFeatured } = await request.json();
    const resolvedParams = await params;

    const movie = await prisma.movie.update({
      where: { id: resolvedParams.id },
      data: { isFeatured },
    });

    return NextResponse.json({ success: true, movie });
  } catch (error) {
    console.error("Toggle featured error:", error);
    return NextResponse.json(
      { error: "Failed to toggle featured status" },
      { status: 500 }
    );
  }
}
