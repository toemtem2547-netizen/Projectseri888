import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

import { z } from "zod";

const paymentSchema = z.object({
  movieId: z.string().optional().nullable(),
  plan: z.enum(["3d", "VIP_1_MONTH", "VIP_3_MONTH", "VIP_6_MONTH", "VIP_1_YEAR"]),
  amount: z.union([z.string(), z.number()]),
  method: z.string().min(1),
  slipUrl: z.string().optional(),
  couponCode: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = paymentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const { movieId, plan, amount, method, slipUrl, couponCode } = result.data;

    // Process payment (Simulated)
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const isImmediate = method.toLowerCase() !== "promptpay";
    const initialStatus = isImmediate ? "SUCCESS" : "PENDING";

    // Create Payment Record
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount: parseFloat(amount as string),
        method,
        status: initialStatus,
        transactionId,
        rentalPlan: plan,
        movieId,
        slipUrl: slipUrl || null,
      },
    });

    if (couponCode) {
      await prisma.coupon.update({
        where: { code: couponCode },
        data: { usedCount: { increment: 1 } },
      }).catch(e => console.error("Failed to increment coupon count", e));
    }

    // Notify admins
    try {
      const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map((admin) => ({
            userId: admin.id,
            title: isImmediate ? "💰 มีการชำระเงินใหม่ (สำเร็จ)" : "🧾 มีแจ้งโอนเงินใหม่",
            message: isImmediate 
              ? `มียอดชำระเงิน ${amount} บาท เข้ามาในระบบแบบอัตโนมัติ`
              : `มีผู้ใช้อัปโหลดสลิปแจ้งโอนเงินยอด ${amount} บาท กรุณาตรวจสอบและอนุมัติ`,
            type: "ADMIN"
          }))
        });
      }
    } catch (e) {
      console.error("Failed to notify admins", e);
    }

    // If it requires manual slip verification, return early
    if (!isImmediate) {
      return NextResponse.json({ success: true, payment, pending: true });
    }

    // Calculate expiration
    let expiresAt = null;
    const now = new Date();
    if (plan === "3d") {
      expiresAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    }

    if (plan.startsWith("VIP_")) {
      const now = new Date();
      const expiresAt = new Date(now);
      if (plan === "VIP_1_MONTH") {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      } else if (plan === "VIP_3_MONTH") {
        expiresAt.setMonth(expiresAt.getMonth() + 3);
      } else if (plan === "VIP_6_MONTH") {
        expiresAt.setMonth(expiresAt.getMonth() + 6);
      } else if (plan === "VIP_1_YEAR") {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      }

      const existingSub = await prisma.subscription.findFirst({
        where: { userId: session.user.id }
      });

      let subscription;
      if (existingSub) {
        subscription = await prisma.subscription.update({
          where: { id: existingSub.id },
          data: { planId: plan, status: "ACTIVE", expiresAt }
        });
      } else {
        subscription = await prisma.subscription.create({
          data: {
            userId: session.user.id,
            planId: plan,
            status: "ACTIVE",
            expiresAt
          }
        });
      }
      return NextResponse.json({ success: true, payment, subscription });
    }

    // Create or Update Rental Record
    const existingRental = await prisma.rental.findFirst({
      where: {
        userId: session.user.id,
        movieId: movieId as string,
      }
    });

    let rental;
    if (existingRental) {
      rental = await prisma.rental.update({
        where: { id: existingRental.id },
        data: { plan, status: "ACTIVE", expiresAt }
      });
    } else {
      rental = await prisma.rental.create({
        data: {
          userId: session.user.id,
          movieId: movieId as string,
          plan,
          expiresAt,
          status: "ACTIVE",
        }
      });
    }

    return NextResponse.json({ success: true, payment, rental });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}
