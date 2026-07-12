"use client";

import { useState, useRef } from "react";
import { User, LogOut, Camera, Loader2, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ProfileEditor({ user }: { user: any }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      const { url } = await uploadRes.json();

      const updateRes = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_AVATAR", imageUrl: url }),
      });

      if (updateRes.ok) {
        toast.success("อัปเดตรูปโปรไฟล์สำเร็จ");
        router.refresh();
      } else {
        toast.error("อัปเดตรูปโปรไฟล์ไม่สำเร็จ");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("รหัสผ่านใหม่ไม่ตรงกัน");
      toast.error("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      toast.error("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_PASSWORD",
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess(data.message);
        toast.success(data.message || "เปลี่ยนรหัสผ่านสำเร็จ");
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
          setPasswordSuccess("");
        }, 2000);
      } else {
        setPasswordError(data.error || "เกิดข้อผิดพลาด");
        toast.error(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      setPasswordError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
      toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <>
      <div className="glass-card p-6 rounded-3xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Background Blur Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-cv-primary/10 to-transparent pointer-events-none" />
        
        <div className="relative mb-4 group">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/10 bg-cv-background flex items-center justify-center relative">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-cv-primary animate-spin" />
            ) : user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-cv-text-dim" />
            )}
            
            {/* Hover overlay for upload */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center"
            >
              <Camera className="w-6 h-6 text-white mb-1" />
              <span className="text-[10px] text-white font-medium">เปลี่ยนรูป</span>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
        
        <h2 className="text-xl font-bold text-white mb-1 relative z-10">{user.name || "ผู้ใช้งาน"}</h2>
        <p className="text-sm text-cv-text-dim mb-6 relative z-10">{user.email}</p>
        
        <div className="w-full space-y-3 relative z-10">
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <KeyRound className="w-4 h-4" /> เปลี่ยนรหัสผ่าน
          </button>
          
          <Link href="/api/auth/signout" className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
            <LogOut className="w-4 h-4" /> ออกจากระบบ
          </Link>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)} />
          <div className="relative bg-cv-background border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">เปลี่ยนรหัสผ่าน</h3>
            
            {passwordError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {passwordError}
              </div>
            )}
            
            {passwordSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm text-cv-text-dim mb-1">รหัสผ่านปัจจุบัน</label>
                <input 
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-cv-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-cv-text-dim mb-1">รหัสผ่านใหม่</label>
                <input 
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-cv-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-cv-text-dim mb-1">ยืนยันรหัสผ่านใหม่</label>
                <input 
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-cv-primary outline-none"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 py-2.5 rounded-xl bg-cv-primary text-white font-medium flex items-center justify-center disabled:opacity-50"
                >
                  {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : "บันทึก"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
