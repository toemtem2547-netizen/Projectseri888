"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Film, AlertCircle } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function LoginPage() {
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
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cv-deep flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-cv-deep via-cv-deep/80 to-cv-deep/30" />
      
      <div className="w-full max-w-md relative z-10 glass-card p-8 rounded-3xl border border-white/10 shadow-2xl shadow-black/50">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-6">
            <div className="relative h-14 w-auto flex items-center justify-center">
              <img src="/logo.png" alt={APP_NAME} className="h-full w-auto object-contain drop-shadow-lg" />
            </div>
            <span className="text-2xl font-bold font-heading text-white">{APP_NAME}</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">เข้าสู่ระบบ</h1>
          <p className="text-cv-text-dim text-sm text-center">เข้าถึงภาพยนตร์ระดับพรีเมียมได้ทันที</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cv-text-dim mb-1">อีเมล</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-cv-primary/50 transition-all"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cv-text-dim mb-1">รหัสผ่าน</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-cv-primary/50 transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-gradient py-3.5 rounded-xl font-semibold text-white shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 mt-2"
          >
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-cv-text-dim">
          ยังไม่มีบัญชีใช่ไหม?{" "}
          <Link href="/register" className="text-cv-primary hover:text-white transition-colors font-medium">
            สมัครสมาชิกฟรี
          </Link>
        </p>
      </div>
    </main>
  );
}
