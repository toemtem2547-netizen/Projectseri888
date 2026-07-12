"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Image as ImageIcon, CreditCard, LayoutTemplate } from "lucide-react";

export default function AdminSettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    siteName: "",
    logoUrl: "",
    seoTitle: "",
    seoDescription: "",
    paymentAccountNo: "",
    paymentAccountName: ""
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        setFormData({
          siteName: data.siteName || "",
          logoUrl: data.logoUrl || "",
          seoTitle: data.seoTitle || "",
          seoDescription: data.seoDescription || "",
          paymentAccountNo: data.paymentAccountNo || "",
          paymentAccountName: data.paymentAccountName || ""
        });
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("บันทึกการตั้งค่าสำเร็จ");
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (e) {
      alert("Error saving settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-cv-primary" /></div>;
  }

  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading text-white">การตั้งค่าระบบ</h1>
          <p className="text-cv-text-dim mt-1">จัดการข้อมูลเว็บไซต์ โลโก้ และบัญชีรับเงิน</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* General Settings */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <LayoutTemplate className="w-5 h-5 text-cv-primary" />
              <h2 className="text-xl font-bold text-white">ข้อมูลทั่วไป</h2>
            </div>
            
            <div>
              <label className="block text-sm text-cv-text-dim mb-2">ชื่อเว็บไซต์ (Site Name)</label>
              <input required name="siteName" value={formData.siteName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-primary" />
            </div>
            
            <div>
              <label className="block text-sm text-cv-text-dim mb-2">URL โลโก้</label>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <input name="logoUrl" value={formData.logoUrl} onChange={handleChange} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-primary" />
                </div>
                {formData.logoUrl && (
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center p-1">
                    <img src={formData.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-bold text-white">บัญชีรับเงิน (พร้อมเพย์/ธนาคาร)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-cv-text-dim mb-2">เลขบัญชี / พร้อมเพย์</label>
                <input name="paymentAccountNo" value={formData.paymentAccountNo} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm text-cv-text-dim mb-2">ชื่อบัญชี</label>
                <input name="paymentAccountName" value={formData.paymentAccountName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500" />
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="w-5 h-5 text-cv-accent" />
              <h2 className="text-xl font-bold text-white">SEO & Metadata</h2>
            </div>
            
            <div>
              <label className="block text-sm text-cv-text-dim mb-2">SEO Title</label>
              <input required name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-accent" />
            </div>
            
            <div>
              <label className="block text-sm text-cv-text-dim mb-2">SEO Description</label>
              <textarea required name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cv-accent" />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cv-primary to-cv-accent px-4 py-4 font-bold text-white transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            บันทึกการตั้งค่าทั้งหมด
          </button>
        </form>
      </div>
    </main>
  );
}
