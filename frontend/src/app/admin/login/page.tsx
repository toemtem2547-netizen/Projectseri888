"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Film, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cv-deep flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="aurora-orb aurora-orb-1" />
      <div className="aurora-orb aurora-orb-2" />
      <div className="absolute inset-0 bg-gradient-to-br from-cv-deep/80 to-cv-surface/90 backdrop-blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cv-primary to-cv-secondary flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cv-primary/30 transition-all">
            <Film className="w-6 h-6 text-cv-deep" />
          </div>
          <span className="text-3xl font-bold font-[family-name:var(--font-heading)] gradient-text">
            SERIX888
          </span>
        </Link>

        <div className="glass-card p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cv-primary via-cv-secondary to-cv-accent" />
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-heading)] mb-2">
              ผู้ดูแลระบบ
            </h1>
            <p className="text-sm text-cv-text-dim">
              ลงชื่อเข้าใช้เพื่อจัดการระบบ SERIX888
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-cv-text-dim mb-2">
                อีเมล
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cv-text-dim" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/20 border border-cv-border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cv-primary focus:ring-1 focus:ring-cv-primary transition-all"
                  placeholder="admin@series888.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cv-text-dim mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cv-text-dim" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-cv-border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cv-primary focus:ring-1 focus:ring-cv-primary transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gradient py-3.5 rounded-xl flex items-center justify-center gap-2 group mt-8"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-cv-deep" />
              ) : (
                <>
                  <span className="text-cv-deep font-bold">เข้าสู่ระบบ</span>
                  <ArrowRight className="w-5 h-5 text-cv-deep group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
