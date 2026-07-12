"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EpisodeManagerClient({ movie, episodes }: { movie: any, episodes: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    epNumber: (episodes.length + 1).toString(),
    title: "",
    videoUrl: "",
    duration: "45m",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/movies/${movie.id}/episodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ ...formData, epNumber: (episodes.length + 2).toString(), title: "", videoUrl: "" });
        router.refresh();
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      alert("Error adding episode");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (epId: string) => {
    if (!confirm("ยืนยันการลบตอนนี้?")) return;
    try {
      const res = await fetch(`/api/movies/${movie.id}/episodes/${epId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (e) {}
  };

  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/admin/movies/${movie.id}/edit`} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold font-heading text-white">จัดการตอน - {movie.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 glass-card rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-bold text-white mb-6">เพิ่มตอนใหม่</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-cv-text-dim mb-2">ตอนที่ (EP)</label>
                <input required type="number" value={formData.epNumber} onChange={e => setFormData({ ...formData, epNumber: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-primary" />
              </div>
              <div>
                <label className="block text-sm text-cv-text-dim mb-2">ชื่อตอน</label>
                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-primary" />
              </div>
              <div>
                <label className="block text-sm text-cv-text-dim mb-2">Video URL</label>
                <input required value={formData.videoUrl} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-primary" />
              </div>
              <div>
                <label className="block text-sm text-cv-text-dim mb-2">ความยาว (เช่น 45m)</label>
                <input required value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-primary" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cv-primary to-cv-accent px-4 py-3 font-bold text-white transition hover:scale-[1.02] disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />} เพิ่มตอน
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">รายการตอน ({episodes.length})</h2>
            <div className="space-y-3">
              {episodes.map(ep => (
                <div key={ep.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                  <div>
                    <div className="font-bold text-white">EP {ep.epNumber}: {ep.title}</div>
                    <div className="text-xs text-cv-text-dim mt-1">{ep.duration}</div>
                  </div>
                  <button onClick={() => handleDelete(ep.id)} className="p-2 text-cv-text-dim hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {episodes.length === 0 && (
                <p className="text-center text-cv-text-dim py-8">ยังไม่มีตอนในระบบ</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
