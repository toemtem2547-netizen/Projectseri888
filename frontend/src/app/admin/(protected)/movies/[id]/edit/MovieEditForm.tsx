"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MovieEditForm({ movie }: { movie: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: movie.type || "MOVIE",
    title: movie.title || "",
    tagline: movie.tagline || "",
    description: movie.description || "",
    posterUrl: movie.posterUrl || "",
    backdropUrl: movie.backdropUrl || "",
    trailerUrl: movie.trailerUrl || "",
    videoUrl: movie.videoUrl || "",
    genres: movie.genres || "",
    year: movie.year?.toString() || "",
    duration: movie.duration || "",
    previewDuration: movie.previewDuration?.toString() || "120",
    price24h: movie.price24h?.toString() || "",
    price7d: movie.price7d?.toString() || "",
    priceLifetime: movie.priceLifetime?.toString() || "",
    releaseDate: movie.releaseDate || "",
    isFeatured: movie.isFeatured || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/movies/${movie.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error("Failed to update movie");
      router.push("/admin/movies");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error updating movie");
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/movies" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold font-heading text-white">แก้ไขภาพยนตร์</h1>
          </div>
          {movie.type === 'SERIES' && (
            <Link href={`/admin/movies/${movie.id}/episodes`} className="px-4 py-2 bg-cv-accent text-white rounded-lg hover:bg-cv-accent/80 font-medium transition-colors">
              จัดการตอน (Episodes)
            </Link>
          )}
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-cv-text-dim mb-2">ประเภท (Type)</label>
              <select name="type" value={formData.type} onChange={handleChange as any} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-primary">
                <option value="MOVIE" className="bg-cv-deep text-white">ภาพยนตร์ (Movie)</option>
                <option value="SERIES" className="bg-cv-deep text-white">ซีรีส์ (Series)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-cv-text-dim mb-2">ชื่อเรื่อง</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-primary" />
            </div>
            <div>
              <label className="block text-sm text-cv-text-dim mb-2">คำโปรย (Tagline)</label>
              <input name="tagline" value={formData.tagline} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-primary" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-cv-text-dim mb-2">เรื่องย่อ</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-cv-text-dim mb-2">Poster URL</label>
              <input required name="posterUrl" value={formData.posterUrl} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-primary" />
            </div>
            <div>
              <label className="block text-sm text-cv-text-dim mb-2">Backdrop URL</label>
              <input required name="backdropUrl" value={formData.backdropUrl} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-primary" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-cv-text-dim mb-2">Video URL (วิดีโอตัวเต็ม)</label>
              <input required={formData.type === 'MOVIE'} name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-primary" placeholder="https://..." />
              {formData.type === 'SERIES' && (
                <p className="text-xs text-cv-primary/80 mt-1">*กรณีนำทุกตอนมารวมเป็นคลิปเดียว ให้ใส่ลิงก์ที่นี่ได้เลยโดยไม่ต้องไปสร้างตอน (Episodes)</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-cv-text-dim mb-2">Trailer URL (ตัวอย่างหนัง)</label>
              <input name="trailerUrl" value={formData.trailerUrl} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-primary" placeholder="https://..." />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">ราคาเช่าภาพยนตร์</h3>
            <div>
              <label className="block text-sm text-cv-text-dim mb-1">ราคาเช่า (บาท) - ระยะเวลา 3 วัน</label>
              <input required type="number" step="0.01" name="price24h" value={formData.price24h} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-primary" />
            </div>
            
            {/* Hiding 7d and lifetime as per new pricing strategy */}
            <input type="hidden" name="price7d" value={formData.price7d} />
            <input type="hidden" name="priceLifetime" value={formData.priceLifetime} />
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <input 
              type="checkbox" 
              name="isFeatured" 
              id="isFeatured"
              checked={formData.isFeatured} 
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} 
              className="w-5 h-5 accent-cv-primary" 
            />
            <label htmlFor="isFeatured" className="text-white font-medium cursor-pointer">ตั้งเป็นภาพยนตร์แนะนำ (Featured / Banner หน้าแรก)</label>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cv-primary to-cv-accent px-4 py-4 font-bold text-white transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            บันทึกการแก้ไข
          </button>
        </form>
      </div>
    </main>
  );
}
