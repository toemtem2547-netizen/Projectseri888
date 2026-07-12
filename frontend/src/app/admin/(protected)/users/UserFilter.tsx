"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useTransition } from "react";

export default function UserFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentRole = searchParams.get("role") || "ALL";

  const updateFilters = (search: string, role: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (search) params.set("search", search);
    else params.delete("search");
    
    if (role && role !== "ALL") params.set("role", role);
    else params.delete("role");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-cv-text-dim" />
        </div>
        <input
          type="text"
          placeholder="ค้นหาชื่อหรืออีเมล..."
          defaultValue={currentSearch}
          onChange={(e) => updateFilters(e.target.value, currentRole)}
          className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-cv-text-dim focus:outline-none focus:border-cv-primary focus:ring-1 focus:ring-cv-primary sm:text-sm"
        />
      </div>
      <div className="sm:w-48">
        <select
          value={currentRole}
          onChange={(e) => updateFilters(currentSearch, e.target.value)}
          className="block w-full px-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white focus:outline-none focus:border-cv-primary focus:ring-1 focus:ring-cv-primary sm:text-sm"
        >
          <option value="ALL" className="bg-cv-deep text-white">ทุกบทบาท</option>
          <option value="USER" className="bg-cv-deep text-white">ผู้ใช้งาน (USER)</option>
          <option value="ADMIN" className="bg-cv-deep text-white">ผู้ดูแลระบบ (ADMIN)</option>
          <option value="BANNED" className="bg-cv-deep text-white">ระงับบัญชี (BANNED)</option>
        </select>
      </div>
      {isPending && <div className="text-cv-text-dim flex items-center text-sm">กำลังโหลด...</div>}
    </div>
  );
}
