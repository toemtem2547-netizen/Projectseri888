"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Film, Users, Wallet, BarChart3, Settings, Ticket, LogOut, FolderOpen, Clock, Menu, Bell } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const ADMIN_LINKS = [
  { name: "แดชบอร์ด", href: "/admin", icon: LayoutDashboard },
  { name: "ภาพยนตร์", href: "/admin/movies", icon: Film },
  { name: "ผู้ใช้งาน", href: "/admin/users", icon: Users },
  { name: "การชำระเงิน", href: "/admin/payments", icon: Wallet },
  { name: "คูปองส่วนลด", href: "/admin/coupons", icon: Ticket },
  { name: "การเช่า & VIP", href: "/admin/rentals", icon: Clock },
  { name: "หมวดหมู่", href: "/admin/categories", icon: FolderOpen },
  { name: "สถิติ", href: "/admin/analytics", icon: BarChart3 },
  { name: "การตั้งค่า", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ siteName, logoUrl }: { siteName?: string | null, logoUrl?: string | null } = {}) {
  const pathname = usePathname();
  const displayLogo = logoUrl || "/logo.png";
  const displayName = siteName || "SERIX888";

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-cv-deep border-b border-white/10 z-40 flex items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="relative">
            <img src={displayLogo} alt={displayName} className="h-8 w-auto object-contain rounded-lg" />
          </div>
          <span className="text-xl font-bold font-heading text-white">{displayName}</span>
        </Link>
        <Sheet>
          <SheetTrigger className="p-2 -mr-2 text-cv-text-dim hover:text-white transition-colors">
            <Menu className="w-6 h-6" />
          </SheetTrigger>
          <SheetContent side="left" className="bg-cv-deep border-r-white/10 p-0 w-64 flex flex-col">
            <div className="p-6 flex items-center gap-2 border-b border-white/5">
              <span className="text-xl font-bold font-heading text-white">เมนูผู้ดูแล</span>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
              {ADMIN_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? "bg-cv-primary/10 text-cv-primary font-medium" 
                        : "text-cv-text-dim hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-white/5">
              <Link href="/" className="flex items-center gap-3 px-4 py-3 text-cv-text-dim hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <LogOut className="w-5 h-5" />
                กลับหน้าหลัก
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="w-64 h-screen fixed left-0 top-0 border-r border-cv-border bg-cv-deep z-40 hidden md:flex flex-col">
      <Link href="/admin" className="p-6 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="relative">
          <img src={displayLogo} alt={displayName} className="h-8 w-auto object-contain rounded-lg" />
        </div>
        <span className="text-xl font-bold font-heading text-white">{displayName}</span>
      </Link>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {ADMIN_LINKS.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-cv-primary/10 text-cv-primary font-medium" 
                  : "text-cv-text-dim hover:text-white hover:bg-white/5"
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-cv-border">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-cv-text-dim hover:text-white hover:bg-white/5 rounded-xl transition-all">
          <LogOut className="w-5 h-5" />
          กลับหน้าหลัก
        </Link>
      </div>
      </div>
    </>
  );
}
