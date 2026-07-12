import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real app, verify the slip first. Here we assume success instantly.
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days VIP

    const sub = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        planId: "VIP",
        status: "ACTIVE",
        expiresAt,
      }
    });

    return NextResponse.json(sub);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
