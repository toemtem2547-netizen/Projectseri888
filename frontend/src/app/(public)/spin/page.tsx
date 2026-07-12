import { Metadata } from "next";
import SpinWheelClient from "./SpinWheelClient";

export const metadata: Metadata = {
  title: "สุ่มหนัง (Spin Wheel) | พรีเมียม | CineVault",
  description: "เล่นวงล้อสุ่มหนังระดับพรีเมียม สุ่มหนังและซีรีส์ที่คุณชื่นชอบ",
};

export default function SpinPage() {
  return (
    <main className="min-h-screen w-full relative flex flex-col items-center justify-center overflow-hidden bg-[#080808]">
      
      {/* 
        ========================================
        AAA CINEMATIC BACKGROUND & LIGHTING
        ========================================
      */}
      
      {/* Deep vignette & HDR Base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#080808_90%)] z-10 pointer-events-none" />
      
      {/* Volumetric orange center glow (Static & Optimized) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] bg-[radial-gradient(circle_at_center,rgba(255,159,28,0.1)_0%,transparent_60%)] z-0 pointer-events-none" />

      {/* Intense core backlight behind wheel (Static & Optimized) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(255,213,74,0.15)_0%,transparent_60%)] z-0 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(255,77,79,0.15)_0%,transparent_60%)] z-0 pointer-events-none" />

      {/* Animated Embers & Golden Particles (Reduced count for performance) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#FFD54A] shadow-[0_0_10px_#FFD54A]"
            style={{
              width: Math.random() * 3 + 2 + 'px',
              height: Math.random() * 3 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.4 + 0.1,
              animation: `floatUp ${Math.random() * 15 + 10}s linear infinite`,
              animationDelay: `-${Math.random() * 20}s`
            }}
          />
        ))}
      </div>

      {/* 
        ========================================
        MAIN CONTENT
        ========================================
      */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto px-4 pt-28 pb-16 flex flex-col items-center min-h-screen">
        
        {/* Premium Glowing Header */}
        <div className="text-center mb-10 z-20 relative">
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-4">
            <span className="text-[#FFD54A] text-xl md:text-3xl drop-shadow-[0_0_15px_rgba(255,213,74,0.8)]">✦</span>
            <h1 
              className="text-4xl md:text-6xl font-black text-[#F5B041] tracking-wide py-2" 
              style={{ textShadow: "0 4px 20px rgba(245,176,65,0.3), 0 2px 5px rgba(0,0,0,0.8)" }}
            >
              ไม่รู้จะดูอะไรดี?
            </h1>
            <span className="text-[#FFD54A] text-xl md:text-3xl drop-shadow-[0_0_15px_rgba(255,213,74,0.8)]">✦</span>
          </div>
          <p className="text-[#E0E0E0] text-base md:text-xl font-medium tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            หมุนวงล้อเพื่อสุ่มหนัง/ซีรีส์ ที่ใช่สำหรับคุณ
          </p>
        </div>

        {/* Spin Wheel Client Component */}
        <SpinWheelClient />

      </div>

    </main>
  );
}
