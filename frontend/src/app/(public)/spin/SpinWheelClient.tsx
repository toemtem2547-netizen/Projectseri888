"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Sparkles, Loader2, X, RefreshCw, Film, Zap, Heart, MousePointer2, Popcorn, Music } from "lucide-react";
import Link from "next/link";

// Clean, vibrant colors matching the reference exactly
const SLICE_COLORS = [
  ["#22C55E", "#16A34A"], // Green
  ["#F59E0B", "#D97706"], // Yellow/Orange
  ["#6366F1", "#4F46E5"], // Indigo
  ["#EC4899", "#DB2777"], // Pink
  ["#06B6D4", "#0891B2"], // Cyan
  ["#EF4444", "#DC2626"], // Red
  ["#8B5CF6", "#7C3AED"], // Purple
  ["#3B82F6", "#2563EB"], // Blue
];

const ICONS = ["🎬", "🍿", "⭐", "🔥", "💎", "🎭", "🎪", "🎯"];

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function createSlicePath(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", x, y, 
    "L", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y, 
    "Z"
  ].join(" ");
}

export default function SpinWheelClient() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<any | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/movies/random");
      const data = await res.json();
      if (Array.isArray(data)) setMovies(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMovies(); }, []);

  const handleSpin = () => {
    if (isSpinning || movies.length === 0) return;
    
    setIsSpinning(true);
    setShowWinnerModal(false);
    setWinner(null);

    const winnerIndex = Math.floor(Math.random() * movies.length);
    const sliceAngle = 360 / movies.length;
    
    // SVG pointer is at the TOP (270 degrees)
    // Slices start at 0 degrees (Right)
    const sliceCenterAngle = (winnerIndex * sliceAngle) + (sliceAngle / 2);
    const currentModulo = rotation % 360;
    const currentSlicePos = (sliceCenterAngle + currentModulo) % 360;
    
    // Calculate how many degrees we need to rotate to bring this slice to 270 degrees
    let delta = 270 - currentSlicePos;
    if (delta <= 0) delta += 360;
    
    const extraSpins = Math.floor(Math.random() * 5) + 6; 
    
    // Add small random offset to make it look realistic, but keep it within the slice
    const randomOffset = (Math.random() * (sliceAngle * 0.7)) - (sliceAngle * 0.35);
    
    const finalRotation = rotation + (extraSpins * 360) + delta + randomOffset;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(movies[winnerIndex]);
      setShowWinnerModal(true);
    }, 7000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-[#FFD54A]">
        <Loader2 className="w-16 h-16 animate-spin mb-4" />
        <p className="text-[#F8F8F8] font-bold">กำลังเตรียมระบบ...</p>
      </div>
    );
  }

  if (movies.length === 0) return null;

  const numSlices = movies.length;
  const sliceAngle = 360 / numSlices;
  const numBulbs = 24;

  return (
    <div className="flex flex-col items-center w-full pb-16">
      
      {/* 
        ==================================================
        DESKTOP LAYOUT (Clean, balanced sizes)
        ==================================================
      */}
      <div className="flex flex-col xl:flex-row items-center justify-center gap-10 xl:gap-20 w-full mt-4">
        
        {/* LEFT PANEL */}
        <div className="hidden xl:flex flex-col gap-6 w-[320px]">
          {/* Card 1 */}
          <div className="group rounded-[20px] bg-gradient-to-br from-white/10 to-transparent p-[1px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer">
            <div className="h-full w-full bg-[#111111]/80 backdrop-blur-xl rounded-[19px] p-5 flex items-center gap-4 transition-colors group-hover:bg-[#1a1a1a]/90">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#222] to-[#111] border border-white/5 flex items-center justify-center shadow-inner group-hover:border-[#FFD54A]/50 transition-colors">
                <Film className="w-6 h-6 text-[#FFD54A]" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[#FFD54A] font-bold text-base">หนังและซีรีส์คุณภาพ</h3>
                <p className="text-[#A0A0A0] text-xs mt-1">คัดสรรมาแล้วสำหรับคุณ</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group rounded-[20px] bg-gradient-to-br from-white/10 to-transparent p-[1px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer">
            <div className="h-full w-full bg-[#111111]/80 backdrop-blur-xl rounded-[19px] p-5 flex items-center gap-4 transition-colors group-hover:bg-[#1a1a1a]/90">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#222] to-[#111] border border-white/5 flex items-center justify-center shadow-inner group-hover:border-[#FF9F1C]/50 transition-colors">
                <Zap className="w-6 h-6 text-[#FF9F1C]" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[#FF9F1C] font-bold text-base">สุ่มเร็ว ไม่ต้องรอ</h3>
                <p className="text-[#A0A0A0] text-xs mt-1">เพียงคลิกเดียวเท่านั้น</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group rounded-[20px] bg-gradient-to-br from-white/10 to-transparent p-[1px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer">
            <div className="h-full w-full bg-[#111111]/80 backdrop-blur-xl rounded-[19px] p-5 flex items-center gap-4 transition-colors group-hover:bg-[#1a1a1a]/90">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#222] to-[#111] border border-white/5 flex items-center justify-center shadow-inner group-hover:border-[#FF4D4F]/50 transition-colors">
                <Heart className="w-6 h-6 text-[#FF4D4F]" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[#FF4D4F] font-bold text-base">เจอเรื่องที่ใช่</h3>
                <p className="text-[#A0A0A0] text-xs mt-1">สนุกไม่รู้จบทุกแนว</p>
              </div>
            </div>
          </div>
        </div>

        {/* 
          ==================================================
          CENTER: THE WHEEL (Scaled down to match reference)
          ==================================================
        */}
        <div className="relative w-[340px] h-[340px] md:w-[440px] md:h-[440px] xl:w-[480px] xl:h-[480px] flex-shrink-0 z-30">
          
          {/* Volumetric Glow Behind Wheel */}
          <div className="absolute inset-[-40px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,159,28,0.3)_0%,transparent_60%)] blur-[20px] z-0 pointer-events-none" />

          {/* Super Premium Bright Gold Outer Frame */}
          <div className="absolute inset-[-18px] md:inset-[-24px] rounded-full bg-[conic-gradient(from_0deg,#FFD700,#FFF8DC,#B8860B,#FFD700,#FFF8DC,#B8860B,#FFD700)] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(255,215,0,0.3),inset_0_4px_10px_rgba(255,255,255,0.9),inset_0_-4px_10px_rgba(0,0,0,0.8)] flex items-center justify-center p-[6px] md:p-[8px] z-10">
            
            {/* Inner Dark Track with Casino Lights Track */}
            <div className="w-full h-full rounded-full bg-[#111] shadow-[inset_0_10px_20px_rgba(0,0,0,1)] border-2 border-[#222] relative flex items-center justify-center">
              
              {/* Inner Bright Gold Rim touching the wheel */}
              <div className="absolute inset-[10px] md:inset-[14px] rounded-full border-[4px] md:border-[6px] border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.5),inset_0_0_20px_rgba(0,0,0,0.8)] pointer-events-none" />
            </div>
          </div>

          {/* Casino LED Bulbs on the outer frame */}
          {Array.from({ length: numBulbs }).map((_, i) => {
            const angle = i * (360 / numBulbs);
            return (
              <div 
                key={`bulb-${i}`}
                className="absolute top-1/2 left-1/2 w-[12px] h-[12px] md:w-[16px] md:h-[16px] rounded-full z-20"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${184}px) md:translateY(-${238}px) xl:translateY(-${258}px)`,
                }}
              >
                <div 
                  className={`w-full h-full rounded-full border-[2px] border-[#333] ${isSpinning ? 'opacity-100' : 'animate-[pulse_1.5s_infinite]'} ${
                    i % 2 === 0 
                      ? 'bg-[#FFF8DC] shadow-[0_0_15px_#FFD700,inset_0_0_6px_#fff]' 
                      : 'bg-[#FF4D4F] shadow-[0_0_15px_#FF0000,inset_0_0_6px_#fff]'
                  }`} 
                  style={{ animationDelay: `${i * 0.1}s`, willChange: 'opacity' }} 
                />
              </div>
            );
          })}

          {/* Pointer (Red Jewel Arrow) */}
          <div className="absolute -top-[30px] md:-top-[40px] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]">
            <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-[conic-gradient(from_0deg,#FFD700,#FFF8DC,#B8860B,#FFD700)] p-[4px] shadow-[0_5px_15px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.9)] z-20">
              {/* Ruby Center */}
              <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_30%_30%,#FF6B6B_0%,#DC2626_50%,#7F1D1D_100%)] shadow-[inset_0_-4px_8px_rgba(0,0,0,0.8),inset_0_4px_8px_rgba(255,255,255,0.6)] border border-[#FFD700]/50 relative overflow-hidden">
                <div className="absolute top-[10%] left-[20%] w-[30%] h-[20%] bg-white/60 rounded-full blur-[1px] transform -rotate-12" />
              </div>
            </div>
            {/* Arrow */}
            <div className="relative z-10 -mt-3 md:-mt-4">
              <div className="w-0 h-0 border-l-[14px] md:border-l-[18px] border-l-transparent border-r-[14px] md:border-r-[18px] border-r-transparent border-t-[28px] md:border-t-[36px] border-t-[#FFD700] filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" />
            </div>
          </div>

          {/* The Wheel SVG (Vibrant & Glossy) */}
          <motion.div 
            className="relative w-full h-full rounded-full z-20 overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] will-change-transform"
            animate={{ rotate: rotation }}
            transition={isSpinning ? { duration: 7, ease: [0.1, 0.85, 0.15, 1] } : { duration: 0 }}
          >
            {/* Glossy Overlay Dome */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_50%_10%,rgba(255,255,255,0.4)_0%,transparent_50%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-30 mix-blend-overlay" />
            
            <svg viewBox="0 0 1000 1000" className="w-full h-full">
              <defs>
                {/* Ultra-Vibrant gradients for slices */}
                {movies.map((_, i) => (
                  <radialGradient key={`grad-${i}`} id={`grad-${i}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={SLICE_COLORS[i % SLICE_COLORS.length][0]} />
                    <stop offset="100%" stopColor={SLICE_COLORS[i % SLICE_COLORS.length][1]} />
                  </radialGradient>
                ))}
                
                {/* Brilliant gold separator */}
                <linearGradient id="goldSeparator" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF8DC" />
                  <stop offset="50%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
              </defs>

              <g>
                {movies.map((_, i) => (
                  <path 
                    key={`slice-${i}`}
                    d={createSlicePath(500, 500, 500, i * sliceAngle, (i + 1) * sliceAngle)}
                    fill={`url(#grad-${i})`}
                    stroke="url(#goldSeparator)"
                    strokeWidth="8"
                  />
                ))}
              </g>

              {/* Text & Icons Overlay (Clean & Readable) */}
              {movies.map((movie, i) => {
                const angle = (i * sliceAngle) + (sliceAngle / 2);
                return (
                  <g 
                    key={`text-${i}`}
                    transform={`translate(500, 500) rotate(${angle - 90}) translate(220, 0)`}
                  >
                    {/* Background Icon Watermark */}
                    <text 
                      x="30" y="25" 
                      fill="rgba(255,255,255,0.15)" 
                      fontSize="70" 
                      textAnchor="middle"
                    >
                      {ICONS[i % ICONS.length]}
                    </text>
                    
                    {/* Movie Title */}
                    <text 
                      x="0" y="10" 
                      fill="#FFFFFF" 
                      fontSize="28" 
                      fontWeight="bold" 
                      textAnchor="middle" 
                      alignmentBaseline="middle"
                      letterSpacing="2"
                      style={{ 
                        textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
                      }}
                    >
                      {movie.title.length > 18 ? movie.title.substring(0, 18) + "..." : movie.title}
                    </text>
                  </g>
                );
              })}
            </svg>
          </motion.div>

          {/* Center SPIN Button (Luxury Dark & Deep Gold) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full flex flex-col items-center justify-center transition-all group outline-none ${
                isSpinning 
                  ? "cursor-not-allowed scale-95 opacity-80" 
                  : "hover:scale-105 active:scale-95 cursor-pointer drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
              }`}
            >
              {/* Thick Glossy Intense Gold Outer Rim */}
              <div 
                className={`absolute inset-0 rounded-full p-[5px] md:p-[7px] ${
                  isSpinning 
                    ? 'bg-[#444]' 
                    : 'bg-[linear-gradient(to_bottom,#FFE14A_0%,#F59E0B_30%,#92400E_50%,#F59E0B_70%,#FFE14A_100%)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.6)]'
                }`} 
              >
                {/* Inner Dark Body with soft warm edge glow */}
                <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_center,#222_0%,#050505_100%)] shadow-[inset_0_0_20px_rgba(245,158,11,0.25),inset_0_2px_5px_rgba(0,0,0,1)] flex items-center justify-center relative overflow-hidden">
                  
                  {/* SPIN Text in Rich Gold */}
                  <span 
                    className={`text-xl md:text-2xl font-black z-10 tracking-widest ${
                      isSpinning ? 'text-[#555]' : 'text-transparent bg-clip-text bg-gradient-to-b from-[#FFE14A] via-[#F59E0B] to-[#D97706] filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                    }`} 
                  >
                    SPIN
                  </span>

                  {/* Soft glare over the dark button */}
                  {!isSpinning && (
                    <div className="absolute top-0 left-[10%] right-[10%] h-[40%] bg-gradient-to-b from-white/10 to-transparent rounded-full pointer-events-none blur-[1px]" />
                  )}
                </div>
              </div>
            </button>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="hidden xl:flex flex-col gap-6 w-[320px]">
          <div className="h-full w-full bg-[#111111]/80 backdrop-blur-xl rounded-[24px] p-8 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-center">
            
            <h2 className="text-[#FFD54A] font-bold text-xl mb-8 text-center">วิธีใช้งาน</h2>
            
            <div className="flex flex-col gap-8">
              {/* Step 1 */}
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#222] to-[#111] border border-white/5 flex items-center justify-center shadow-inner">
                    <MousePointer2 className="w-5 h-5 text-[#FF4D4F]" />
                  </div>
                  <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-[#FF4D4F] text-white text-xs font-bold flex items-center justify-center border-2 border-[#111]">1</div>
                </div>
                <div>
                  <h4 className="text-[#F8F8F8] font-bold text-base">คลิกปุ่ม SPIN</h4>
                  <p className="text-[#A0A0A0] text-xs mt-1">เพื่อหมุนวงล้อแห่งโชคชะตา</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#222] to-[#111] border border-white/5 flex items-center justify-center shadow-inner">
                    <Loader2 className="w-5 h-5 text-[#FFD54A]" />
                  </div>
                  <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-[#FFD54A] text-[#111] text-xs font-bold flex items-center justify-center border-2 border-[#111]">2</div>
                </div>
                <div>
                  <h4 className="text-[#F8F8F8] font-bold text-base">รอระบบทำงาน</h4>
                  <p className="text-[#A0A0A0] text-xs mt-1">AI จะสุ่มหนังที่เหมาะกับคุณ</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#222] to-[#111] border border-white/5 flex items-center justify-center shadow-inner">
                    <Popcorn className="w-5 h-5 text-[#FF9F1C]" />
                  </div>
                  <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-[#FF9F1C] text-[#111] text-xs font-bold flex items-center justify-center border-2 border-[#111]">3</div>
                </div>
                <div>
                  <h4 className="text-[#F8F8F8] font-bold text-base">เพลิดเพลินได้เลย</h4>
                  <p className="text-[#A0A0A0] text-xs mt-1">รับชมหนังคุณภาพพรีเมียม</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 
        ==================================================
        BOTTOM CONTROLS (Clean CTA)
        ==================================================
      */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mt-16 w-full max-w-[1000px] justify-between px-6 z-20">
        
        {/* Left: Sound toggle */}
        <div className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
          <div className="w-12 h-12 rounded-full border border-white/10 bg-[#1a1a1a] flex items-center justify-center shadow-inner">
            <Music className="w-4 h-4 text-[#F8F8F8]" />
          </div>
          <div>
            <p className="text-[#F8F8F8] text-sm font-bold">เปิดเสียง</p>
            <p className="text-[#A0A0A0] text-xs mt-1">เพิ่มอรรถรสระดับโรงภาพยนตร์</p>
          </div>
        </div>

        {/* Center: Main CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="group relative px-10 py-4 rounded-full font-bold text-lg text-white transition-all overflow-hidden disabled:opacity-50 hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(239,68,68,0.5)] border border-white/20 outline-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#EF4444] via-[#F97316] to-[#EF4444] bg-[length:200%_auto] group-hover:animate-[gradientMove_2s_linear_infinite]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.2)_0%,transparent_50%,rgba(0,0,0,0.2)_100%)] pointer-events-none" />
            
            <div className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>หมุนวงล้อเลย!</span>
            </div>
          </button>

          <button
            onClick={fetchMovies}
            disabled={isSpinning}
            className="px-6 py-4 rounded-full bg-[#111111]/90 backdrop-blur-xl border border-white/10 text-[#F8F8F8] hover:bg-white/10 transition-all disabled:opacity-50 flex items-center gap-2 font-bold text-sm outline-none"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">รีเซ็ตวงล้อ</span>
          </button>
        </div>

        <div className="hidden sm:block w-[150px]"></div>

      </div>

      {/* 
        ==================================================
        WINNER MODAL (Clean Glassmorphism)
        ==================================================
      */}
      <AnimatePresence>
        {showWinnerModal && winner && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080808]/80"
            onClick={() => setShowWinnerModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg overflow-hidden rounded-[32px] bg-[#111111] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center p-8 text-center"
            >
              <button 
                onClick={() => setShowWinnerModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#F8F8F8] transition-colors border border-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl md:text-2xl font-bold text-[#FFD54A] mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                ภาพยนตร์ที่คุณคู่ควร
              </h2>

              <div className="relative w-56 aspect-[2/3] rounded-[16px] overflow-hidden shadow-2xl mb-8 ring-4 ring-[#FFD54A]/20">
                <img 
                  src={winner.posterUrl} 
                  alt={winner.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{winner.title}</h3>
              {winner.genres && (
                <p className="text-sm text-[#FF9F1C] font-semibold mb-8">
                  {Array.isArray(winner.genres) ? winner.genres.join(', ') : winner.genres}
                </p>
              )}

              <Link 
                href={`/movie/${winner.id}`}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FFD54A] to-[#FF9F1C] text-black font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(255,159,28,0.3)]"
              >
                <Play className="w-6 h-6 fill-black" />
                <span>รับชมทันที</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes floatUp {
          0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
