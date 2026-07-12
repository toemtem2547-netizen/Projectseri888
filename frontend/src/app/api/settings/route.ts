import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    let settings = await prisma.systemSetting.findUnique({ where: { id: "1" } });
    if (!settings) {
      settings = await prisma.systemSetting.create({
        data: {
          id: "1",
          siteName: "SERIX888",
          seoTitle: "SERIX888 - Premium Movies",
          seoDescription: "Watch premium movies online."
        }
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const settings = await prisma.systemSetting.upsert({
      where: { id: "1" },
      update: {
        siteName: data.siteName,
        logoUrl: data.logoUrl,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        paymentAccountNo: data.paymentAccountNo,
        paymentAccountName: data.paymentAccountName,
      },
      create: {
        id: "1",
        siteName: data.siteName || "SERIX888",
        logoUrl: data.logoUrl,
        seoTitle: data.seoTitle || "SERIX888 - Premium Movies",
        seoDescription: data.seoDescription || "Watch premium movies online.",
        paymentAccountNo: data.paymentAccountNo,
        paymentAccountName: data.paymentAccountName,
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
