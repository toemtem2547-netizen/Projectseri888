import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Total Revenue (Successful payments)
    const successfulPayments = await prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
    });
    const totalRevenue = successfulPayments._sum.amount || 0;

    // 2. Active VIP Subscribers
    const now = new Date();
    const activeSubscribers = await prisma.subscription.count({
      where: {
        status: "ACTIVE",
        expiresAt: { gt: now },
      },
    });

    // 3. Total Users
    const totalUsers = await prisma.user.count({
      where: { role: "USER" },
    });

    // 4. Total Views (from WatchHistory)
    const totalViews = await prisma.watchHistory.count();

    // 5. Recent Payments
    const recentPayments = await prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    // 6. Popular Movies
    const popularMoviesRaw = await prisma.watchHistory.groupBy({
      by: ['movieId'],
      _count: { movieId: true },
      orderBy: { _count: { movieId: 'desc' } },
      take: 5,
    });

    // Fetch movie details for popular movies
    const popularMovieIds = popularMoviesRaw.map(pm => pm.movieId);
    const movies = await prisma.movie.findMany({
      where: { id: { in: popularMovieIds } },
      select: { id: true, title: true, type: true, posterUrl: true },
    });

    const popularMovies = popularMoviesRaw.map(pm => ({
      movie: movies.find(m => m.id === pm.movieId),
      views: pm._count.movieId,
    })).filter(pm => pm.movie); // filter out if movie was deleted

    // 7. Monthly Revenue for chart (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const paymentsLast6Months = await prisma.payment.findMany({
      where: {
        status: "SUCCESS",
        createdAt: { gte: sixMonthsAgo },
      },
      select: { amount: true, createdAt: true },
    });

    // Group by month
    const monthlyDataMap = new Map();
    const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    
    // Initialize last 6 months with 0
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = monthNames[d.getMonth()];
      monthlyDataMap.set(label, 0);
    }

    paymentsLast6Months.forEach(p => {
      const label = monthNames[p.createdAt.getMonth()];
      if (monthlyDataMap.has(label)) {
        monthlyDataMap.set(label, monthlyDataMap.get(label) + p.amount);
      }
    });

    const revenueChart = Array.from(monthlyDataMap, ([month, revenue]) => ({ month, revenue }));

    return NextResponse.json({
      totalRevenue,
      activeSubscribers,
      totalUsers,
      totalViews,
      recentPayments,
      popularMovies,
      revenueChart,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
