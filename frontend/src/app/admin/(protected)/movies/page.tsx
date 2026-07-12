import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import MovieActions from "./MovieActions";
import FallbackImage from "@/components/ui/FallbackImage";
import MovieFilter from "./MovieFilter";

export default async function AdminMoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string }>;
}) {
  const { search, type } = await searchParams;

  const movies = await prisma.movie.findMany({
    where: {
      ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
      ...(type && type !== "ALL" ? { type: type } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 md:pr-44">
          <div>
            <h1 className="text-3xl font-bold font-heading text-white">จัดการภาพยนตร์</h1>
          </div>
          <Link href="/admin/movies/create" className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-gradient text-white font-medium hover:scale-105 transition-transform">
            <Plus className="w-5 h-5" />
            <span>เพิ่มภาพยนตร์</span>
          </Link>
        </div>

        <MovieFilter />

        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-cv-text-dim text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">ชื่อเรื่อง</th>
                  <th className="p-4 font-medium">หมวดหมู่</th>
                  <th className="p-4 font-medium">ปี</th>
                  <th className="p-4 font-medium">ราคาเช่า (บาท)</th>
                  <th className="p-4 font-medium text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {movies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 relative rounded-md overflow-hidden flex-shrink-0">
                          <FallbackImage src={movie.posterUrl} alt={movie.title} fill sizes="40px" className="object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-cv-primary transition-colors">{movie.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-cv-text-dim">{movie.genres}</td>
                    <td className="p-4 text-cv-text-dim">{movie.year}</td>
                    <td className="p-4 text-cv-text-dim">฿{movie.price24h}</td>
                    <td className="p-4">
                      <MovieActions movieId={movie.id} isFeatured={movie.isFeatured} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col divide-y divide-white/5">
            {movies.map((movie) => (
              <div key={movie.id} className="p-4 flex flex-col gap-3 hover:bg-white/5 transition-colors">
                <div className="flex gap-4">
                  <div className="w-16 h-24 relative rounded-md overflow-hidden flex-shrink-0 shadow-md">
                    <FallbackImage src={movie.posterUrl} alt={movie.title} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h3 className="font-bold text-white text-base truncate">{movie.title}</h3>
                    <p className="text-xs text-cv-text-dim mt-1 truncate">{movie.genres}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-white/5 text-cv-text-dim border border-white/10 px-2 py-0.5 rounded text-xs">{movie.year}</span>
                      <span className="text-cv-accent font-bold text-sm bg-cv-accent/10 px-2 py-0.5 rounded border border-cv-accent/20">฿{movie.price24h}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-1 pt-3 border-t border-white/5 flex justify-end">
                  <MovieActions movieId={movie.id} isFeatured={movie.isFeatured} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
