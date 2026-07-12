"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";

export default function CategoryForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", iconName: "Film" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ name: "", iconName: "Film" });
        router.refresh();
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      alert("Error adding category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">เพิ่มหมวดหมู่ใหม่</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-cv-text-dim mb-2">ชื่อหมวดหมู่ (เช่น Action, ตลก)</label>
          <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-primary" />
        </div>
        <div>
          <label className="block text-sm text-cv-text-dim mb-2">ไอคอน (ชื่อจาก Lucide-React)</label>
          <input required value={formData.iconName} onChange={e => setFormData({ ...formData, iconName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-primary" />
          <p className="text-xs text-cv-text-dim mt-2">ตัวอย่าง: Film, Sword, Smile, Theater, Ghost, Rocket, Heart</p>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cv-primary to-cv-accent px-4 py-3 font-bold text-white transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          เพิ่มหมวดหมู่
        </button>
      </form>
    </div>
  );
}
