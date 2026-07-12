"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  Menu,
  X,
  Film,
  ChevronDown,
  Bell,
  Bookmark,
  LogOut,
  Sparkles,
} from "lucide-react";
import { NAV_LINKS, APP_NAME } from "@/lib/constants";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "next-auth/react";

export default function Header({ session, siteName, logoUrl }: { session: any, siteName?: string | null, logoUrl?: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/notifications")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setNotifications(data);
        })
        .catch(() => {});
    }
  }, [session]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id?: string) => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id ? { id } : {})
      });
      setNotifications(prev => prev.map(n => id ? (n.id === id ? { ...n, isRead: true } : n) : { ...n, isRead: true }));
    } catch(e) {}
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const timeoutId = setTimeout(() => {
        fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) setSearchResults(data);
          })
          .catch(() => {});
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-strong py-3"
            : "bg-gradient-to-b from-cv-deep/90 to-transparent py-5"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <img src={logoUrl || "/logo.png"} alt={siteName || APP_NAME} className="h-12 w-auto object-contain rounded-lg drop-shadow-md" />
            </div>
            <span className="text-2xl font-black font-number bg-gradient-to-r from-white via-yellow-100 to-yellow-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm uppercase">
              {siteName || APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className={`px-5 py-2.5 text-base font-medium transition-colors rounded-xl hover:bg-white/5 relative group ${pathname === link.href ? "text-white font-bold" : "text-cv-text-dim hover:text-white"}`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ${pathname === link.href ? "w-8 bg-cv-primary" : "w-0 bg-gradient-to-r from-cv-primary to-cv-accent group-hover:w-8"}`} />
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-xl hover:bg-white/5 text-cv-text-dim hover:text-white transition-all"
              aria-label="ค้นหา"
            >
              <Search className="w-6 h-6" />
            </button>

            {/* Bookmarks (Only if logged in) */}
            {session && (
              <Link
                href="/watchlist"
                className="p-2.5 rounded-xl hover:bg-white/5 text-cv-text-dim hover:text-white transition-all hidden sm:flex"
                aria-label="หนังที่อยากดู"
                title="หนังที่อยากดู"
              >
                <Bookmark className="w-6 h-6" />
              </Link>
            )}

            {/* Admin Dashboard (Only for ADMIN role) */}
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/5 transition-all text-cv-text-dim hover:text-white"
                title="แดชบอร์ดผู้ดูแล"
              >
                <div className="h-10 px-3 rounded-xl bg-cv-primary/10 flex items-center justify-center">
                  <span className="text-cv-primary font-bold text-sm tracking-widest">ADMIN</span>
                </div>
              </Link>
            )}

            {/* Subscribe VIP Button */}
            <Link
              href="/pricing"
              className="hidden sm:flex items-center gap-1.5 h-10 px-4 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-sm shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>สมัคร VIP</span>
            </Link>

            {/* Notifications (Only if logged in) */}
            {session && (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (unreadCount > 0 && showNotifications) markAsRead(); // Mark all as read when closing
                  }}
                  className="p-2.5 rounded-xl hover:bg-white/5 text-cv-text-dim hover:text-white transition-all relative"
                  aria-label="การแจ้งเตือน"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  )}
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 glass-strong border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h3 className="font-bold text-white">การแจ้งเตือน</h3>
                        {unreadCount > 0 && (
                          <button onClick={() => markAsRead()} className="text-xs text-cv-primary hover:text-cv-accent transition-colors">
                            อ่านทั้งหมด
                          </button>
                        )}
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-sm text-cv-text-dim">
                            ไม่มีการแจ้งเตือนใหม่
                          </div>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} onClick={() => { if(!n.isRead) markAsRead(n.id); }} className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${!n.isRead ? 'bg-cv-primary/5' : ''}`}>
                              <h4 className={`text-sm ${!n.isRead ? 'text-white font-semibold' : 'text-cv-text-dim'}`}>{n.title}</h4>
                              <p className="text-xs text-cv-text-dim mt-1">{n.message}</p>
                              <span className="text-[10px] text-white/30 mt-2 block">{new Date(n.createdAt).toLocaleDateString()}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Profile or Login */}
            {session ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cv-primary to-cv-secondary flex items-center justify-center overflow-hidden border border-white/10">
                    {session.user.image ? (
                      <img src={session.user.image} alt={session.user.name || "Profile"} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span className="text-base font-medium text-white max-w-[150px] truncate">{session.user.name || session.user.email?.split('@')[0]}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2.5 rounded-xl hover:bg-white/5 text-cv-text-dim hover:text-red-400 transition-all"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex px-4 py-2 rounded-xl btn-gradient font-medium text-sm text-white hover:scale-105 transition-all"
              >
                เข้าสู่ระบบ
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger
                className="md:hidden p-2.5 rounded-xl hover:bg-white/5 text-cv-text-dim hover:text-white transition-all"
                aria-label="เมนู"
              >
                <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-cv-surface border-cv-border w-[300px]"
              >
                <div className="flex flex-col gap-1 mt-8">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-3 rounded-xl transition-all text-lg ${pathname === link.href ? "bg-cv-primary/10 text-cv-primary font-bold border border-cv-primary/20" : "text-cv-text-dim hover:text-white hover:bg-white/5"}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="h-px bg-cv-border my-4" />
                  {session ? (
                    <>
                      <Link
                        href="/profile"
                        className="px-4 py-3 text-cv-text-dim hover:text-white hover:bg-white/5 rounded-xl transition-all text-lg"
                      >
                        โปรไฟล์ของฉัน
                      </Link>
                      {session?.user?.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          className="px-4 py-3 text-cv-text-dim hover:text-white hover:bg-white/5 rounded-xl transition-all text-lg"
                        >
                          แดชบอร์ดผู้ดูแล
                        </Link>
                      )}
                      <Link
                        href="/watchlist"
                        className="px-4 py-3 text-cv-text-dim hover:text-white hover:bg-white/5 rounded-xl transition-all text-lg"
                      >
                        หนังที่อยากดู (Watchlist)
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="px-4 py-3 text-left text-cv-text-dim hover:text-red-400 hover:bg-white/5 rounded-xl transition-all text-lg w-full"
                      >
                        ออกจากระบบ
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="px-4 py-3 text-cv-primary hover:text-cv-accent hover:bg-white/5 rounded-xl transition-all text-lg font-medium"
                    >
                      เข้าสู่ระบบ
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-cv-deep/90 backdrop-blur-2xl flex items-start justify-center pt-[15vh]"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -30, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-4xl px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-strong rounded-2xl p-2">
                <div className="flex items-center gap-3 px-4">
                  <Search className="w-5 h-5 text-cv-primary" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาหนัง ซีรีส์ หรือศิลปิน..."
                    className="flex-1 bg-transparent text-lg py-4 outline-none text-white placeholder:text-cv-text-dim"
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/5 text-cv-text-dim hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Live Suggestions */}
              {searchQuery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-strong rounded-2xl mt-3 p-4"
                >
                  <p className="text-xs text-cv-text-dim uppercase tracking-wider mb-3">
                    คำแนะนำ
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {searchResults.map((movie) => (
                      <Link
                        key={movie.id}
                        href={`/movie/${movie.id}`}
                        className="flex items-center gap-5 p-3 rounded-2xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5"
                        onClick={() => setSearchOpen(false)}
                      >
                        <div className="relative w-16 h-24 sm:w-20 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                          <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col flex-1 py-1">
                          <span className="text-base sm:text-lg font-bold text-white group-hover:text-cv-primary transition-colors line-clamp-2 leading-tight">
                            {movie.title}
                          </span>
                          <span className="text-sm text-cv-text-dim mt-2 flex items-center gap-2">
                            <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{movie.year}</span>
                            <span className="truncate">{movie.genres?.split(',')[0]}</span>
                          </span>
                        </div>
                        {movie.type === "SERIES" && (
                          <span className="text-[10px] font-bold bg-cv-primary/20 text-cv-primary border border-cv-primary/30 px-3 py-1 rounded-full ml-auto shrink-0">SERIES</span>
                        )}
                      </Link>
                    ))}
                  </div>
                  {searchResults.length === 0 && searchQuery.length > 1 && (
                     <div className="px-3 py-2 text-sm text-cv-text-dim">ไม่พบผลลัพธ์ที่ค้นหา</div>
                  )}
                  {searchQuery.length > 0 && (
                    <Link
                      href={`/search?q=${searchQuery}`}
                      className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl bg-cv-primary/10 hover:bg-cv-primary/20 text-cv-primary transition-colors"
                      onClick={() => setSearchOpen(false)}
                    >
                      <Search className="w-4 h-4" />
                      <span>
                        ค้นหา “{searchQuery}”
                      </span>
                    </Link>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
