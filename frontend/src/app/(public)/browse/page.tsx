"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  X,
  ChevronDown,
} from "lucide-react";
import MovieCard from "@/components/shared/MovieCard";
// Removed mock movies import
import { genres } from "@/lib/data/genres";
import { COUNTRIES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

type SortOption = "popularity" | "rating" | "newest" | "price";

function BrowseContent() {
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get("type");

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("ทุกประเทศ");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("popularity");
  const [layout, setLayout] = useState<"grid" | "cinematic">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (typeFilter) {
      result = result.filter((m) => m.type?.toLowerCase() === typeFilter.toLowerCase());
    }

    if (selectedGenres.length > 0) {
      result = result.filter((m) =>
        m.genres.some((g: string) =>
          selectedGenres.some((sg) => sg.toLowerCase() === g.toLowerCase())
        )
      );
    }
    if (selectedCountry !== "ทุกประเทศ") {
      result = result.filter((m) => m.country === selectedCountry);
    }
    if (minRating > 0) {
      result = result.filter((m) => m.rating >= minRating);
    }

    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        );
        break;
      case "price":
        result.sort((a, b) => (a.price24h || 0) - (b.price24h || 0));
        break;
      default:
        result.sort((a, b) => b.ratingCount - a.ratingCount);
    }
    return result;
  }, [selectedGenres, selectedCountry, minRating, sortBy, movies, typeFilter]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedCountry("ทุกประเทศ");
    setMinRating(0);
    setSortBy("popularity");
  };

  const activeFilterCount =
    selectedGenres.length +
    (selectedCountry !== "ทุกประเทศ" ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Page Header */}
      <div className="px-4 md:px-8 max-w-[1600px] mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-heading)]">
            สำรวจ
          </h1>
          <p className="text-cv-text-dim mt-2">
            ค้นหาหนังหรือซีรีส์เรื่องต่อไปที่คุณต้องการ
          </p>
        </motion.div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-[68px] z-30 px-4 md:px-8 mb-8">
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl p-4"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap flex-1">
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    showFilters || activeFilterCount > 0
                      ? "bg-cv-primary/20 text-cv-primary"
                      : "bg-white/5 text-cv-text-dim hover:text-white"
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  ตัวกรอง
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-cv-primary text-white text-xs flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Quick Genre Pills */}
                <div className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {genres.slice(0, 6).map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => toggleGenre(genre.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                        selectedGenres.includes(genre.name)
                          ? "bg-cv-primary text-white"
                          : "bg-white/5 text-cv-text-dim hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>

                {/* Active Filters */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 transition-all"
                  >
                    <X className="w-3 h-3" />
                    ล้างทั้งหมด
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none bg-white/5 text-sm text-cv-text-dim px-4 py-2.5 pr-8 rounded-xl outline-none cursor-pointer hover:bg-white/10 transition-all"
                  >
                    <option value="popularity" className="bg-cv-deep text-white">ยอดนิยม</option>
                    <option value="rating" className="bg-cv-deep text-white">คะแนนสูงสุด</option>
                    <option value="newest" className="bg-cv-deep text-white">ใหม่ล่าสุด</option>
                    <option value="price" className="bg-cv-deep text-white">ราคาต่ำสุด</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-cv-text-dim pointer-events-none" />
                </div>

                {/* Layout Toggle */}
                <div className="flex items-center bg-white/5 rounded-xl p-1">
                  <button
                    onClick={() => setLayout("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      layout === "grid"
                        ? "bg-cv-primary text-white"
                        : "text-cv-text-dim hover:text-white"
                    }`}
                    aria-label="มุมมองแบบตาราง"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLayout("cinematic")}
                    className={`p-2 rounded-lg transition-all ${
                      layout === "cinematic"
                        ? "bg-cv-primary text-white"
                        : "text-cv-text-dim hover:text-white"
                    }`}
                    aria-label="มุมมองภาพยนตร์"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Genre Filter */}
                    <div>
                      <p className="text-xs text-cv-text-dim uppercase tracking-wider mb-3">
                        ประเภท
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {genres.map((genre) => (
                          <button
                            key={genre.id}
                            onClick={() => toggleGenre(genre.name)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              selectedGenres.includes(genre.name)
                                ? "bg-cv-primary text-white"
                                : "bg-white/5 text-cv-text-dim hover:text-white"
                            }`}
                          >
                            {genre.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Country Filter */}
                    <div>
                      <p className="text-xs text-cv-text-dim uppercase tracking-wider mb-3">
                        ประเทศ
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {COUNTRIES.map((country) => (
                          <button
                            key={country}
                            onClick={() => setSelectedCountry(country)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              selectedCountry === country
                                ? "bg-cv-primary text-white"
                                : "bg-white/5 text-cv-text-dim hover:text-white"
                            }`}
                          >
                            {country}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <p className="text-xs text-cv-text-dim uppercase tracking-wider mb-3">
                        เรตติ้งขั้นต่ำ
                      </p>
                      <div className="flex items-center gap-2">
                        {[0, 3, 3.5, 4, 4.5].map((r) => (
                          <button
                            key={r}
                            onClick={() => setMinRating(r)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              minRating === r
                                ? "bg-cv-highlight text-black"
                                : "bg-white/5 text-cv-text-dim hover:text-white"
                            }`}
                          >
                            {r === 0 ? "ทั้งหมด" : `${r}+`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-cv-text-dim">
            <span className="text-white font-medium">
              {filteredMovies.length}
            </span>{" "}
            เรื่อง
          </p>
          {/* Active Filter Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            {selectedGenres.map((g) => (
              <Badge
                key={g}
                className="bg-cv-primary/10 text-cv-primary border-cv-primary/20 cursor-pointer hover:bg-cv-primary/20"
                onClick={() => toggleGenre(g)}
              >
                {g} <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className={`grid gap-5 md:gap-6 ${
            layout === "cinematic"
              ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          }`}
        >
          <AnimatePresence mode="popLayout">
            {filteredMovies.map((movie, i) => (
              <motion.div
                key={movie.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
              >
                <MovieCard
                  movie={movie}
                  index={i}
                  variant={layout === "cinematic" ? "large" : "default"}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredMovies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-cv-text-dim mb-2">ไม่พบผลลัพธ์</p>
            <p className="text-sm text-cv-text-dim">
              ลองปรับตัวกรองของคุณ
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 btn-gradient px-6 py-2.5 rounded-xl text-sm font-medium"
            >
              <span className="relative z-10">ล้างตัวกรอง</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">กำลังโหลด...</div>}>
      <BrowseContent />
    </Suspense>
  );
}
