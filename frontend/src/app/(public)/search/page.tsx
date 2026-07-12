import { prisma } from "@/lib/db";
import { MovieGridSection } from "@/components/shared/MovieGridSection";
import { Search } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; genre?: string }>;
}) {
  const { q, genre } = await searchParams;
  const query = q || "";
  const selectedGenre = genre || "";

  let movies: any[] = [];
  try {
    let whereClause: any = {};
    if (query) {
      whereClause.title = { contains: query };
    } else if (selectedGenre) {
      whereClause.genres = { contains: selectedGenre };
    }
    
    movies = await prisma.movie.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to search database:", error);
  }

  return (
    <main className="min-h-screen bg-cv-deep px-4 py-8 md:px-8 text-white pt-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <div className="p-4 rounded-full bg-cv-primary/20 text-cv-primary">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-heading">ผลการค้นหา</h1>
            <p className="text-cv-text-dim mt-1">
              {query ? `ค้นหา: "${query}"` : selectedGenre ? `หมวดหมู่: ${selectedGenre}` : "ภาพยนตร์ทั้งหมด"}
              {" "} ({movies.length} เรื่อง)
            </p>
          </div>
        </div>

        {movies.length > 0 ? (
          <MovieGridSection title="" subtitle="" items={movies} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-cv-text-dim">
            <Search className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-2xl font-semibold text-white mb-2">ไม่พบภาพยนตร์ที่ค้นหา</h2>
            <p>ลองค้นหาด้วยคำอื่น หรือเลือกดูหมวดหมู่อื่นแทน</p>
          </div>
        )}
      </div>
    </main>
  );
}
