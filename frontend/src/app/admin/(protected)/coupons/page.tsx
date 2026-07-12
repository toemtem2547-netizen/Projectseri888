"use client";

import { useState, useEffect } from "react";
import { Plus, Tag, Trash2, CheckCircle2, XCircle, Power, Loader2 } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discountAmount: "",
    maxUses: "",
  });

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/coupons");
      const data = await res.json();
      setCoupons(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ code: "", discountAmount: "", maxUses: "" });
        setShowCreate(false);
        fetchCoupons();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create coupon");
      }
    } catch (e) {
      alert("Error creating coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/coupons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      fetchCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบคูปองนี้ใช่หรือไม่?")) return;
    try {
      await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      fetchCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 md:pr-44">
          <div>
            <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-heading)]">จัดการคูปองส่วนลด</h1>
            <p className="text-cv-text-dim mt-2">สร้างและจัดการโค้ดส่วนลดสำหรับลูกค้า</p>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 bg-cv-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-cv-primary/80 transition btn-gradient"
          >
            <Plus className="w-5 h-5" />
            <span>สร้างคูปองใหม่</span>
          </button>
        </div>

      {showCreate && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 max-w-2xl">
          <h2 className="text-xl font-bold text-white mb-4">สร้างคูปองใหม่</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-cv-text-dim mb-1">โค้ดส่วนลด</label>
                <input
                  required
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="เช่น NEWYEAR2026"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white uppercase focus:border-cv-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-cv-text-dim mb-1">ส่วนลด (บาท)</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={formData.discountAmount}
                  onChange={e => setFormData({ ...formData, discountAmount: e.target.value })}
                  placeholder="เช่น 50"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-cv-primary outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-cv-text-dim mb-1">จำกัดจำนวนครั้งที่ใช้ได้ (เว้นว่างไว้ถ้าไม่จำกัด)</label>
              <input
                type="number"
                min="1"
                value={formData.maxUses}
                onChange={e => setFormData({ ...formData, maxUses: e.target.value })}
                placeholder="เช่น 100"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-cv-primary outline-none"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cv-primary text-white disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
                บันทึกคูปอง
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center text-cv-text-dim">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-8 text-center text-cv-text-dim">ยังไม่มีคูปองส่วนลดในระบบ</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 text-cv-text-dim uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">โค้ด</th>
                  <th className="px-6 py-4 font-medium">ส่วนลด</th>
                  <th className="px-6 py-4 font-medium">การใช้งาน</th>
                  <th className="px-6 py-4 font-medium">สถานะ</th>
                  <th className="px-6 py-4 font-medium text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white text-base">
                      {coupon.code}
                    </td>
                    <td className="px-6 py-4 text-cv-accent font-semibold">
                      ฿{coupon.discountAmount}
                    </td>
                    <td className="px-6 py-4 text-cv-text-dim">
                      <span className="text-white">{coupon.usedCount}</span> / {coupon.maxUses || "ไม่จำกัด"}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ใช้งานได้
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
                          <XCircle className="w-3.5 h-3.5" /> ถูกระงับ
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleActive(coupon.id, coupon.isActive)}
                          className={`p-2 rounded-lg transition-colors ${coupon.isActive ? "bg-white/5 hover:bg-orange-500/20 text-orange-400" : "bg-white/5 hover:bg-green-500/20 text-green-400"}`}
                          title={coupon.isActive ? "ระงับการใช้งาน" : "เปิดการใช้งาน"}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </main>
  );
}
