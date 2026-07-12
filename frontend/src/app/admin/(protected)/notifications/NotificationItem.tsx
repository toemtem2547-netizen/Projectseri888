"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

export function NotificationItem({ notification }: { notification: any }) {
  const [isRead, setIsRead] = useState(notification.isRead);
  const router = useRouter();

  const markAsRead = async () => {
    if (isRead) return;
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notification.id }),
      });
      setIsRead(true);
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      onClick={markAsRead}
      className={`p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors cursor-pointer ${
        !isRead ? "bg-cv-primary/5 hover:bg-cv-primary/10" : "hover:bg-white/5"
      }`}
    >
      <div>
        <h3 className={`font-semibold ${!isRead ? "text-white" : "text-cv-text-dim"}`}>
          {notification.title}
          {!isRead && <span className="ml-2 inline-block w-2 h-2 bg-cv-primary rounded-full shadow-[0_0_8px_rgba(234,179,8,0.8)]" />}
        </h3>
        <p className="text-sm text-cv-text-dim mt-1">{notification.message}</p>
        <p className="text-[10px] text-white/30 mt-2">
          {new Date(notification.createdAt).toLocaleString("th-TH")}
        </p>
      </div>
      
      {!isRead && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            markAsRead();
          }}
          className="self-start md:self-auto px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Check className="w-3 h-3" /> ทำเครื่องหมายว่าอ่านแล้ว
        </button>
      )}
    </div>
  );
}
