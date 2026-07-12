"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminMovieCreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "MOVIE",
    title: "",
    tagline: "",
    description: "",
    posterUrl: "https://picsum.photos/seed/movie/400/600",
    backdropUrl: "https://picsum.photos/seed/bg/1920/1080",
    trailerUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    genres: "Action, Sci-Fi",
    year: "2025",
    duration: "120",
    previewDuration: "90",
    price24h: "15",
    price7d: "0",
    priceLifetime: "0",
    releaseDate: "2025-01-01",
    isFeatured: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error("Failed to create movie");
      toast.success("เพิ่มภาพยนตร์สำเร็จ");
      router.push("/admin/movies");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการเพิ่มภาพยนตร์");
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/movies" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold font-heading text-white">เพิ่มภาพยนตร์ใหม่</h1>
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
            
            <input type="hidden" name="price7d" value={formData.price7d} />
            <input type="hidden" name="priceLifetime" value={formData.priceLifetime} />
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl border border-cv-primary/30 bg-cv-primary/5">
            <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 accent-cv-primary" />
            <label htmlFor="isFeatured" className="text-white font-medium cursor-pointer">แสดงเป็นภาพยนตร์แนะนำ (Featured Movie) บนแบนเนอร์หน้าแรก</label>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cv-primary to-cv-accent px-4 py-4 font-bold text-white transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            บันทึกข้อมูล
          </button>
        </form>
      </div>
    </main>
  );
}
