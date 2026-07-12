import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, imageUrl, currentPassword, newPassword } = await request.json();

    if (action === "UPDATE_AVATAR") {
      if (!imageUrl) {
        return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
      }

      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: { image: imageUrl },
      });

      return NextResponse.json({ success: true, user: updatedUser });
    }

    if (action === "UPDATE_PASSWORD") {
      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: "Missing password fields" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // If user registered with OAuth (Google, etc.), they might not have a password
      if (!user.password) {
        return NextResponse.json({ error: "บัญชีนี้ล็อกอินผ่านระบบอื่น ไม่สามารถเปลี่ยนรหัสผ่านได้" }, { status: 400 });
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword },
      });

      return NextResponse.json({ success: true, message: "เปลี่ยนรหัสผ่านสำเร็จ" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
