"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, GripVertical, Save } from "lucide-react";
import * as Icons from "lucide-react";

export default function CategoryList({ initialCategories }: { initialCategories: any[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories.sort((a, b) => (a.order || 0) - (b.order || 0)));
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [hasUnsavedOrder, setHasUnsavedOrder] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("ยืนยันการลบหมวดหมู่นี้?")) return;
    setDeletingId(id);
    
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("เกิดข้อผิดพลาดในการลบ");
      }
    } catch (error) {
      alert("Error deleting category");
    } finally {
      setDeletingId(null);
    }
  };

  const getIcon = (iconName: string) => {
    // @ts-ignore
    const IconComponent = Icons[iconName] || Icons.HelpCircle;
    return <IconComponent className="w-6 h-6 text-white" />;
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const items = [...categories];
    const draggedItem = items[draggedIdx];
    
    // Remove the item from old position
    items.splice(draggedIdx, 1);
    // Insert it into new position
    items.splice(index, 0, draggedItem);
    
    setDraggedIdx(index);
    setCategories(items);
    setHasUnsavedOrder(true);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const saveOrder = async () => {
    setIsSavingOrder(true);
    try {
      const itemsToUpdate = categories.map((cat, index) => ({ id: cat.id, order: index }));
      const res = await fetch("/api/admin/categories/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsToUpdate })
      });
      if (res.ok) {
        setHasUnsavedOrder(false);
        router.refresh();
      } else {
        alert("บันทึกการจัดเรียงไม่สำเร็จ");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSavingOrder(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">หมวดหมู่ปัจจุบัน ({categories.length})</h2>
        {hasUnsavedOrder && (
          <button 
            onClick={saveOrder} 
            disabled={isSavingOrder}
            className="px-4 py-2 bg-cv-primary text-white rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-cv-primary/80 transition-colors"
          >
            {isSavingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            บันทึกลำดับ
          </button>
        )}
      </div>
      
      {categories.length === 0 ? (
        <div className="text-center py-10 text-cv-text-dim">
          ยังไม่มีหมวดหมู่ในระบบ กรุณาเพิ่มหมวดหมู่ใหม่
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {categories.map((category, index) => (
            <div 
              key={category.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center justify-between p-4 rounded-xl bg-white/5 border ${draggedIdx === index ? 'border-cv-primary opacity-50' : 'border-white/10 hover:border-white/20'} transition-all cursor-move`}
            >
              <div className="flex items-center gap-4">
                <GripVertical className="w-5 h-5 text-white/20 hover:text-white/50" />
                <div className="w-12 h-12 rounded-xl bg-cv-primary/20 flex items-center justify-center pointer-events-none">
                  {getIcon(category.iconName)}
                </div>
                <div className="pointer-events-none">
                  <div className="font-semibold text-white">{category.name}</div>
                  <div className="text-xs text-cv-text-dim font-mono">{category.iconName}</div>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(category.id); }}
                disabled={deletingId === category.id}
                className="p-2 text-cv-text-dim hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
              >
                {deletingId === category.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
