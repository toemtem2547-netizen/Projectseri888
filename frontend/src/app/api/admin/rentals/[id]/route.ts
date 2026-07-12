import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const body = await request.json();
    const { action } = body;

    const rental = await prisma.rental.findUnique({ where: { id } });
    if (!rental) {
      return NextResponse.json({ error: "Rental not found" }, { status: 404 });
    }

    if (action === "extend") {
      // Add 7 days from current expiresAt or from now if it was already expired/null
      const baseDate = (rental.expiresAt && new Date(rental.expiresAt) > new Date()) 
        ? new Date(rental.expiresAt) 
        : new Date();
        
      baseDate.setDate(baseDate.getDate() + 7);

      await prisma.rental.update({
        where: { id },
        data: {
          expiresAt: baseDate,
          status: "ACTIVE"
        }
      });
      return NextResponse.json({ success: true, message: "Extended 7 days" });
      
    } else if (action === "revoke") {
      // Set to expired immediately (yesterday)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      await prisma.rental.update({
        where: { id },
        data: {
          expiresAt: yesterday,
          status: "EXPIRED"
        }
      });
      return NextResponse.json({ success: true, message: "Revoked" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Rental update error:", error);
    return NextResponse.json({ error: "Failed to update rental" }, { status: 500 });
  }
}
