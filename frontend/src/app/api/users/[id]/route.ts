import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { hash } from "bcryptjs";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { action, newPassword } = await req.json();
    const { id: userId } = await context.params;

    if (action === "BAN") {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "BANNED" },
      });
      return NextResponse.json({ success: true });
    }

    if (action === "UNBAN") {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "USER" },
      });
      return NextResponse.json({ success: true });
    }

    if (action === "MAKE_ADMIN") {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "ADMIN" },
      });
      return NextResponse.json({ success: true });
    }

    if (action === "RESET_PASSWORD" && newPassword) {
      const hashedPassword = await hash(newPassword, 12);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
      return NextResponse.json({ success: true });
    }

    return new NextResponse("Invalid action", { status: 400 });
  } catch (error) {
    console.error("[USER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
