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

    const { id } = await params;
    const { action } = await request.json();

    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (action === "APPROVE") {
      // 1. Update Payment Status
      await prisma.payment.update({
        where: { id },
        data: { status: "SUCCESS" },
      });

      // 2. Activate Rental if movieId and rentalPlan exist
      if (payment.movieId && payment.rentalPlan) {
        let expiresAt = null;
        const now = new Date();
        if (payment.rentalPlan === "3d") {
          expiresAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        }

        const existingRental = await prisma.rental.findFirst({
          where: { userId: payment.userId, movieId: payment.movieId }
        });

        if (existingRental) {
          await prisma.rental.update({
            where: { id: existingRental.id },
            data: {
              plan: payment.rentalPlan,
              status: "ACTIVE",
              expiresAt,
            }
          });
        } else {
          await prisma.rental.create({
            data: {
              userId: payment.userId,
              movieId: payment.movieId,
              plan: payment.rentalPlan,
              expiresAt,
              status: "ACTIVE",
            }
          });
        }
      } else if (!payment.movieId && payment.rentalPlan?.startsWith("VIP_")) {
        const now = new Date();
        const expiresAt = new Date(now);
        if (payment.rentalPlan === "VIP_1_MONTH") {
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        } else if (payment.rentalPlan === "VIP_3_MONTH") {
          expiresAt.setMonth(expiresAt.getMonth() + 3);
        } else if (payment.rentalPlan === "VIP_6_MONTH") {
          expiresAt.setMonth(expiresAt.getMonth() + 6);
        } else if (payment.rentalPlan === "VIP_1_YEAR") {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }

        const existingSub = await prisma.subscription.findFirst({
          where: { userId: payment.userId }
        });

        if (existingSub) {
          await prisma.subscription.update({
            where: { id: existingSub.id },
            data: { planId: payment.rentalPlan, status: "ACTIVE", expiresAt }
          });
        } else {
          await prisma.subscription.create({
            data: {
              userId: payment.userId,
              planId: payment.rentalPlan,
              status: "ACTIVE",
              expiresAt
            }
          });
        }
      }

      // Add Notification
      await prisma.notification.create({
        data: {
          userId: payment.userId,
          title: "✅ ชำระเงินสำเร็จ!",
          message: payment.rentalPlan?.startsWith("VIP") 
            ? "การสมัคร VIP ของคุณได้รับการอนุมัติแล้ว ขอให้สนุกกับการรับชมครับ!" 
            : "สลิปโอนเงินของคุณได้รับการอนุมัติแล้ว สามารถรับชมภาพยนตร์ได้ทันที",
        }
      });
    } else if (action === "REJECT") {
      await prisma.payment.update({
        where: { id },
        data: { status: "FAILED" },
      });

      // Add Notification
      await prisma.notification.create({
        data: {
          userId: payment.userId,
          title: "❌ การชำระเงินไม่สำเร็จ",
          message: "สลิปโอนเงินของคุณถูกปฏิเสธ กรุณาตรวจสอบและทำการชำระเงินใหม่อีกครั้ง",
        }
      });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
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
    await prisma.payment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete payment:", error);
    return NextResponse.json({ error: "Failed to delete payment" }, { status: 500 });
  }
}
