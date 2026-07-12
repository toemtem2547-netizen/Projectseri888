"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, Key, Shield, History, Loader2, Play } from "lucide-react";
import Link from "next/link";

interface UserActionsProps {
  userId: string;
  currentRole: string;
}

export function UserActions({ userId, currentRole }: UserActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: string) => {
    if (!confirm(`ยืนยันการทำรายการ: ${action}?`)) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        alert("ทำรายการสำเร็จ");
        router.refresh();
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      alert("Error processing request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const newPassword = prompt("กรอกรหัสผ่านใหม่ที่ต้องการตั้งให้ผู้ใช้งาน:");
    if (!newPassword) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RESET_PASSWORD", newPassword }),
      });
      if (res.ok) {
        alert("รีเซ็ตรหัสผ่านสำเร็จ");
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      alert("Error resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/admin/users/${userId}`} className="p-2 bg-cv-primary/10 hover:bg-cv-primary/20 text-cv-primary rounded-lg transition-colors" title="ประวัติการเช่า">
        <History className="w-4 h-4" />
      </Link>
      <button 
        onClick={handleResetPassword}
        disabled={isLoading}
        className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50"
        title="รีเซ็ตรหัสผ่าน"
      >
        <Key className="w-4 h-4" />
      </button>
      {currentRole !== "ADMIN" && (
        <button 
          onClick={() => handleAction("MAKE_ADMIN")}
          disabled={isLoading}
          className="p-2 bg-cv-accent/10 hover:bg-cv-accent/20 text-cv-accent rounded-lg transition-colors disabled:opacity-50"
          title="ตั้งเป็นแอดมิน"
        >
          <Shield className="w-4 h-4" />
        </button>
      )}
      {currentRole === "BANNED" ? (
        <button 
          onClick={() => handleAction("UNBAN")}
          disabled={isLoading}
          className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors disabled:opacity-50"
          title="ปลดแบน"
        >
          <Play className="w-4 h-4" />
        </button>
      ) : (
        <button 
          onClick={() => handleAction("BAN")}
          disabled={isLoading}
          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors disabled:opacity-50"
          title="ระงับบัญชี (Ban)"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}
