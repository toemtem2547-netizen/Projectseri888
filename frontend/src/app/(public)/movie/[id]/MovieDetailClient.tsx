"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Play,
  Star,
  Clock,
  Calendar,
  Globe,
  Heart,
  Share2,
  ChevronRight,
  Check,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MovieCard from "@/components/shared/MovieCard";
import ContentCarousel from "@/components/shared/ContentCarousel";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckoutModal } from "@/components/shared/CheckoutModal";

export default function MovieDetailClient({
  movie,
  similar,
  isWatchlisted: initialWatchlisted = false,
  hasAccess = false,
  currentUser,
}: {
  movie: any;
  similar: any[];
  isWatchlisted?: boolean;
  hasAccess?: boolean;
  currentUser?: any;
}) {
  const router = useRouter();
  const [isWatchlisted, setIsWatchlisted] = useState(initialWatchlisted);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const submitReview = async () => {
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/movies/${movie.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
      });
      if (res.status === 401) { router.push("/login"); return; }
      if (res.status === 403) { alert("คุณต้องเช่าหรือซื้อภาพยนตร์เรื่องนี้ก่อนจึงจะสามารถรีวิวได้"); return; }
      if (res.ok) {
        alert("ขอบคุณสำหรับรีวิวของคุณ!");
        setReviewComment("");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการส่งรีวิว");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรีวิวนี้?")) return;
    try {
      const res = await fetch(`/api/movies/${movie.id}/reviews?reviewId=${reviewId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("เกิดข้อผิดพลาดในการลบรีวิว");
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const toggleWatchlist = async () => {
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie.id }),
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setIsWatchlisted(data.added);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("คัดลอกลิงก์สำเร็จแล้ว!");
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsSharing(false), 2000);
    }
  };

  const openTrailer = () => {
    if (movie.trailerUrl) {
      setIsTrailerOpen(true);
    } else {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " trailer")}`, "_blank");
    }
  };
  const rentalOptions = [
    {
      type: "rent",
      label: "เช่า 3 วัน",
      price: movie.price24h,
      duration: "3 วันเต็ม",
      features: [
        "ความคมชัด 4K HDR",
        "ชมได้ทุกอุปกรณ์",
        "เข้าถึงได้ 72 ชั่วโมง",
        "ดาวน์โหลดออฟไลน์ได้"
      ],
      color: "from-cv-primary/20 to-cv-primary/5",
      borderColor: "border-cv-primary/20",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ═══════════ CINEMATIC BACKDROP ═══════════ */}
      <section className="relative h-[70vh] min-h-[500px]">
        <Image
          src={movie.backdropUrl}
          alt={movie.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cv-deep via-cv-deep/70 to-cv-deep/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-cv-deep/90 via-cv-deep/40 to-transparent" />
        <div className="aurora-orb aurora-orb-1 opacity-10" />

        {/* Content */}
        <div className="absolute inset-0 flex items-end pb-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 w-full flex flex-col md:flex-row gap-8 items-end">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:block flex-shrink-0"
            >
              <div className="relative w-[220px] lg:w-[260px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10">
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 768px) 220px, 260px"
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-3">
                {movie.genres?.split(", ").map((genre: string) => (
                  <Badge
                    key={genre}
                    className="bg-white/10 text-white border-white/10 text-xs backdrop-blur-sm"
                  >
                    {genre}
                  </Badge>
                ))}
                {movie.isNew && (
                  <Badge className="bg-cv-accent text-white border-0 text-xs">
                    ใหม่
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-[family-name:var(--font-heading)] mb-3">
                {movie.title}
              </h1>

              <p className="text-lg text-cv-text-dim italic mb-4">
                &ldquo;{movie.tagline || movie.title}&rdquo;
              </p>

              <div className="flex items-center gap-5 text-sm text-cv-text-dim mb-6 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-cv-highlight" fill="#F59E0B" />
                  <span className="text-white font-semibold text-lg">
                    {movie.rating || "4.5"}
                  </span>
                  <span className="text-xs">
                    ({movie.ratingCount?.toLocaleString() || "1,000"})
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {movie.year}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {movie.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" /> {movie.language || "English"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/watch/${movie.id}`)}
                  className="btn-gradient px-8 py-3.5 rounded-xl flex items-center gap-2 font-semibold"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Play className="w-5 h-5" fill="white" />
                    {hasAccess ? "ดูภาพยนตร์" : "ทดลองดูฟรี"}
                  </span>
                </motion.button>
                {!hasAccess && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCheckout(true)}
                    className="glass px-8 py-3.5 rounded-xl text-white font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    เช่า ฿{movie.price24h}
                  </motion.button>
                )}
                <button onClick={toggleWatchlist} className={`p-3.5 rounded-xl glass hover:bg-white/10 transition-all ${isWatchlisted ? "text-red-500" : "text-cv-text-dim hover:text-red-400"}`}>
                  <Heart className="w-5 h-5" fill={isWatchlisted ? "currentColor" : "none"} />
                </button>
                <button onClick={handleShare} className="p-3.5 rounded-xl glass hover:bg-white/10 transition-all text-cv-text-dim hover:text-white">
                  {isSharing ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ DETAILS SECTION ═══════════ */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
                เรื่องย่อ
              </h2>
              <p className="text-cv-text-dim leading-relaxed text-base">
                {movie.description}
              </p>
            </motion.div>

            <Separator className="bg-white/5" />

            {/* Director & Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { label: "ผู้กำกับ", value: movie.director || "Unknown" },
                { label: "ประเทศ", value: movie.country || "United States" },
                { label: "ภาษา", value: movie.language || "English" },
                { label: "วันที่ออกฉาย", value: movie.releaseDate },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-cv-text-dim uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="text-white font-medium text-sm">
                    {item.value}
                  </p>
                </div>
              ))}
            </motion.div>

            <Separator className="bg-white/5" />

            {/* Cast */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
                นักแสดง
              </h2>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {movie.cast?.split(", ").map((member: string, i: number) => (
                  <motion.div
                    key={member}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex-shrink-0 text-center group"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cv-primary/30 to-cv-secondary/30 mb-3 flex items-center justify-center text-2xl font-bold text-white/30 ring-2 ring-white/5 group-hover:ring-cv-primary/30 transition-all">
                      {member.charAt(0)}
                    </div>
                    <p className="text-sm font-medium text-white">
                      {member}
                    </p>
                    <p className="text-xs text-cv-text-dim">นักแสดง</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Episodes List (If Series) */}
            {movie.type === 'SERIES' && movie.episodes?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <h2 className="text-xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
                  ตอนทั้งหมด (Episodes)
                </h2>
                <div className="space-y-3">
                  {movie.episodes.map((ep: any) => (
                    <div key={ep.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
                      <div className="flex items-center gap-4 mb-3 sm:mb-0">
                        <div className="w-12 h-12 rounded-lg bg-cv-primary/20 flex items-center justify-center text-cv-primary font-bold">
                          {ep.epNumber}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{ep.title}</h3>
                          <p className="text-sm text-cv-text-dim flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> {ep.duration}</p>
                        </div>
                      </div>
                      <button onClick={() => {
                        // For simplicity in UI, we navigate directly or show checkout
                        // If they have access, navigate. Otherwise, show checkout
                        // For now we'll just push with ?ep= 
                        router.push(`/watch/${movie.id}?ep=${ep.epNumber}`);
                      }} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" /> เล่นตอนนี้
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <h2 className="text-xl font-bold text-white mb-6 font-[family-name:var(--font-heading)]">
                รีวิวจากผู้ชม ({movie.reviews?.length || 0})
              </h2>

              {/* Add Review Form */}
              <div className="glass-card p-5 rounded-xl mb-6 border border-white/10">
                <h3 className="text-white font-medium mb-3">เขียนรีวิวของคุณ</h3>
                <div className="flex items-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setReviewRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-cv-highlight text-cv-highlight' : 'text-white/20'}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="เขียนความคิดเห็นของคุณเกี่ยวกับภาพยนตร์เรื่องนี้..."
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-cv-primary mb-3 resize-none h-24"
                />
                <button
                  onClick={submitReview}
                  disabled={isSubmittingReview}
                  className="px-6 py-2 bg-cv-primary hover:bg-cv-primary/80 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                >
                  {isSubmittingReview ? "กำลังส่ง..." : "ส่งรีวิว"}
                </button>
              </div>

              {movie.reviews?.length > 0 ? (
                <div className="space-y-4">
                  {movie.reviews.map((review: any) => (
                    <div key={review.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-white font-medium">
                          <div className="w-8 h-8 rounded-full bg-cv-primary/30 flex items-center justify-center text-xs font-bold text-white">
                            {review.user?.name?.charAt(0) || "U"}
                          </div>
                          {review.user?.name || "ผู้ใช้งาน"}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center text-cv-highlight">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-white/20'}`} />
                            ))}
                          </div>
                          {(currentUser?.role === 'ADMIN' || currentUser?.id === review.userId) && (
                            <button
                              onClick={() => deleteReview(review.id)}
                              className="text-cv-text-dim hover:text-red-500 transition-colors"
                              title="ลบรีวิว"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-cv-text-dim text-sm mt-2">{review.comment}</p>
                      <p className="text-xs text-white/30 mt-3">{new Date(review.createdAt).toLocaleDateString("th-TH")}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-cv-text-dim text-sm">ยังไม่มีรีวิวสำหรับเรื่องนี้</p>
              )}
            </motion.div>
          </div>

          {/* Rental Options Sidebar */}
          {!hasAccess && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">
                ตัวเลือกการชม
              </h2>
              {rentalOptions.map((option, i) => (
                <motion.div
                  key={option.type}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div onClick={() => setShowCheckout(true)}>
                    <div
                      className={`glass-card p-5 bg-gradient-to-br ${option.color} cursor-pointer relative overflow-hidden group`}
                    >
                      {option.popular && (
                        <div className="absolute top-0 right-0 bg-cv-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> คุ้มที่สุด
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {option.label}
                          </h3>
                          <p className="text-xs text-cv-text-dim">
                            {option.duration}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-white">
                            ฿{option.price}
                          </span>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {option.features.map((feat) => (
                          <li
                            key={feat}
                            className="flex items-center gap-2 text-sm text-cv-text-dim"
                          >
                            <Check className="w-3.5 h-3.5 text-cv-accent flex-shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 text-center">
                        <span className="text-sm font-medium text-cv-primary group-hover:text-cv-accent transition-colors flex items-center justify-center gap-1">
                          เลือก <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ SIMILAR CONTENT ═══════════ */}
      {similar && similar.length > 0 && (
        <section className="py-12">
          <ContentCarousel
            title="คุณอาจชอบ"
            subtitle="จากผลงานเรื่องนี้"
          >
            {similar.map((m: any, i: number) => (
              <div
                key={m.id}
                className="flex-shrink-0 w-[180px] md:w-[200px]"
              >
                <MovieCard movie={m} index={i} />
              </div>
            ))}
          </ContentCarousel>
        </section>
      )}

      {/* Trailer Modal */}
      <Dialog open={isTrailerOpen} onOpenChange={setIsTrailerOpen}>
        <DialogContent className="max-w-5xl w-[95vw] md:w-auto p-0 bg-black/90 border-white/10 overflow-hidden flex items-center justify-center shadow-2xl">
          {isTrailerOpen && movie.trailerUrl && (
            (movie.trailerUrl.includes('youtube.com') || movie.trailerUrl.includes('youtu.be') || movie.trailerUrl.includes('vidara.to') || movie.trailerUrl.includes('yandex.com') || movie.trailerUrl.includes('disk.yandex.com') || movie.trailerUrl.includes('player.php')) ? (
              <div className={movie.type === 'SERIES' ? "aspect-[9/16] w-full min-w-[300px] md:min-w-[400px] max-w-[450px]" : "aspect-video w-full min-w-[300px] md:min-w-[800px] min-h-[200px] md:min-h-[450px]"}>
                <iframe
                  src={movie.trailerUrl.includes('vidara.to/v/') ? movie.trailerUrl.replace('/v/', '/e/') : (movie.trailerUrl.includes('youtube.com') || movie.trailerUrl.includes('youtu.be') ? `https://www.youtube.com/embed/${movie.trailerUrl.split("v=")[1]?.split("&")[0] || movie.trailerUrl.split("/").pop()}?autoplay=1` : movie.trailerUrl)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <video
                src={movie.trailerUrl}
                controls
                autoPlay
                className={movie.type === 'SERIES' ? "w-full max-w-[450px] aspect-[9/16] object-contain rounded-xl" : "w-full md:w-auto max-w-full max-h-[85vh] object-contain rounded-xl"}
              />
            )
          )}
        </DialogContent>
      </Dialog>

      {showCheckout && (
        <CheckoutModal
          movie={movie}
          onSuccess={() => router.push(`/watch/${movie.id}`)}
          onCancel={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}
