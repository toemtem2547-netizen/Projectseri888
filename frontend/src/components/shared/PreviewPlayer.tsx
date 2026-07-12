"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Clock3, Play, X } from "lucide-react";
import { PREVIEW_DURATION } from "@/lib/constants";
import { usePreviewAccess } from "@/components/providers/PreviewAccessProvider";
import { PaywallModal } from "@/components/shared/PaywallModal";
import { CheckoutModal } from "@/components/shared/CheckoutModal";
import { usePreviewTimer } from "@/hooks/usePreviewTimer";
import type { Movie } from "@/types";
import { useRouter } from "next/navigation";

interface PreviewPlayerProps {
  movie: Movie;
  previewSeconds?: number;
  isUnlockedServer?: boolean;
  initialProgress?: number;
  nextEpisodeUrl?: string;
  isVertical?: boolean;
}

const FALLBACK_VIDEO = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function PreviewPlayer({ movie, previewSeconds = PREVIEW_DURATION, isUnlockedServer = false, initialProgress = 0, nextEpisodeUrl, isVertical }: PreviewPlayerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState<"movie" | "vip" | false>(false);
  const [pausedAt, setPausedAt] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  const [autoVertical, setAutoVertical] = useState(false);
  const { unlockedMovies, unlockMovie, resumeTime, setResumeTime } = usePreviewAccess();
  
  // Ref for tracking the last time we synced to avoid spamming the API
  const lastSyncedTimeRef = useRef(-1);
  
  const isUnlocked = isUnlockedServer || Boolean(unlockedMovies[movie.id]);

  const isIframe = useMemo(() => {
    const url = movie.videoUrl || "";
    if (url.match(/\.(mp4|m3u8|webm)$/i)) return false;
    return url.includes('/e/') || url.includes('/v/') || url.includes('/embed/') || url.includes('iframe') || url.includes('youtube.com/') || url.includes('vimeo.com/') || url.includes('vidara.to') || url.includes('yandex.com') || url.includes('disk.yandex.com') || url.includes('player.php');
  }, [movie.videoUrl]);

  const { remainingTime, progressPercent } = usePreviewTimer({
    previewDuration: previewSeconds,
    currentTime,
    isUnlocked,
  });

  // Timer simulation for Iframe
  useEffect(() => {
    if (!isIframe) return;
    if (hasStarted && !isUnlocked && !showPaywall && !checkoutMode && currentTime < previewSeconds) {
      setIsPlaying(true);
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          const nextTime = prev + 1;
          if (nextTime >= previewSeconds) {
            setShowPaywall(true);
            setIsPlaying(false);
            clearInterval(interval);
          }
          return nextTime;
        });
      }, 1000);
      return () => {
        clearInterval(interval);
        setIsPlaying(false);
      };
    } else if (currentTime >= previewSeconds) {
      setIsPlaying(false);
    } else {
      setIsPlaying(false);
    }
  }, [isIframe, hasStarted, isUnlocked, previewSeconds, showPaywall, checkoutMode, currentTime]);

  // Video Events
  useEffect(() => {
    if (isIframe) return;
    const video = videoRef.current;
    if (!video) return;

    const syncTime = () => {
      const nextTime = video.currentTime || 0;
      setCurrentTime(nextTime);
      setResumeTime(movie.id, nextTime);

      // Sync to backend every 10 seconds
      if (Math.abs(nextTime - lastSyncedTimeRef.current) > 10) {
        lastSyncedTimeRef.current = nextTime;
        saveHistoryToDB(nextTime);
      }

      if (!isUnlocked && nextTime >= previewSeconds) {
        if (!video.paused) {
          setTimeout(() => {
            const currentVideo = videoRef.current;
            if (currentVideo && !currentVideo.paused) {
              currentVideo.pause();
              setPausedAt(nextTime);
              setShowPaywall(true);
              setIsPlaying(false);
            }
          }, 50);
        }
      }
      
      // Show next episode button in the last 15 seconds if it's unlocked and nextEpisodeUrl exists
      if (isUnlocked && nextEpisodeUrl && video.duration && nextTime >= video.duration - 15) {
        setShowNextEpisode(true);
      } else {
        setShowNextEpisode(false);
      }
    };

    const handlePlay = () => {
      setHasStarted(true);
      setIsPlaying(true);
      if (!isUnlocked) {
        const nextTime = video.currentTime || 0;
        if (nextTime >= previewSeconds) {
          video.currentTime = previewSeconds;
          // Use setTimeout to allow the play() promise to resolve before pausing
          setTimeout(() => {
            video.pause();
            setPausedAt(previewSeconds);
            setShowPaywall(true);
            setIsPlaying(false);
          }, 50);
        }
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      const current = video.currentTime || 0;
      setResumeTime(movie.id, current);
      saveHistoryToDB(current); // Sync when paused
    };

    const handleSeeking = () => {
      if (!isUnlocked && video.currentTime > previewSeconds) {
        video.currentTime = previewSeconds;
        setCurrentTime(previewSeconds);
      }
    };

    video.addEventListener("timeupdate", syncTime);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("seeked", syncTime);

    return () => {
      video.removeEventListener("timeupdate", syncTime);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("seeking", handleSeeking);
      video.removeEventListener("seeked", syncTime);
    };
  }, [isIframe, isUnlocked, movie.id, previewSeconds, setResumeTime, nextEpisodeUrl]);

  // Function to save history to API
  const saveHistoryToDB = async (progress: number) => {
    try {
      await fetch("/api/watch-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: movie.id,
          progress: progress,
          completed: false,
        }),
      });
    } catch (error) {
      console.error("Failed to save history", error);
    }
  };

  useEffect(() => {
    if (isIframe) return;
    const video = videoRef.current;
    if (!video) return;

    // Prioritize initialProgress from DB, fallback to localStorage
    const savedTime = initialProgress > 0 ? initialProgress : (resumeTime[movie.id] ?? 0);
    
    // Only seek if we have a saved time and we haven't started playing yet
    if (savedTime > 0 && !hasStarted) {
      // If locked, don't seek past preview limit
      if (!isUnlocked && savedTime >= previewSeconds) {
        video.currentTime = previewSeconds;
        setCurrentTime(previewSeconds);
      } else {
        video.currentTime = savedTime;
        setCurrentTime(savedTime);
      }
    }
  }, [isIframe, movie.id, previewSeconds, resumeTime, initialProgress, isUnlocked, hasStarted]);

  const handleUnlock = () => {
    unlockMovie(movie.id);
    setShowPaywall(false);
    setCheckoutMode(false);
    setPausedAt(currentTime);
    if (!isIframe) {
      const video = videoRef.current;
      if (video) {
        video.currentTime = Math.min(currentTime, previewSeconds);
        video.play().catch(() => undefined);
      }
    }
  };

  const statusLabel = useMemo(() => {
    if (!hasStarted) return "พร้อมดูตัวอย่าง";
    if (isUnlocked) return "ดูได้เต็มเรื่องแล้ว";
    return `เหลือเวลา ${remainingTime} วินาที`;
  }, [hasStarted, isUnlocked, remainingTime]);

  const isSeriesState = isVertical ?? (movie.type === 'SERIES' || autoVertical);

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    if (video.videoHeight > video.videoWidth) {
      setAutoVertical(true);
    }
  };

  const cleanIframeUrl = useMemo(() => {
    let url = movie.videoUrl || "";
    if (url.includes('vidara.to/v/')) {
      url = url.replace('vidara.to/v/', 'vidara.to/e/');
    }
    return url;
  }, [movie.videoUrl]);

  return (
    <div className="mx-auto w-full max-w-[1440px] flex flex-col gap-4">
      {/* Video Container */}
      <div className={`relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-black/80 shadow-[0_30px_120px_rgba(15,23,42,0.7)] ${isSeriesState ? 'max-w-[450px] mx-auto aspect-[9/16]' : 'aspect-video'}`}>
      {isIframe ? (
        (!isUnlocked && currentTime >= previewSeconds) ? (
          <div className="w-full h-full bg-black flex flex-col items-center justify-center relative">
            <img src={movie.backdropUrl || movie.posterUrl} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="locked" />
            <div className="z-10 flex flex-col items-center gap-3">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-md">
                <Clock3 className="w-8 h-8 text-cv-primary" />
              </div>
              <p className="text-white text-lg font-medium">หมดเวลาดูตัวอย่างแล้ว</p>
              <button onClick={() => setShowPaywall(true)} className="mt-2 px-6 py-2 bg-cv-primary text-white rounded-full font-bold hover:bg-cv-primary/80 transition-colors">
                ปลดล็อกเพื่อดูต่อ
              </button>
            </div>
          </div>
        ) : (
          <iframe
            src={cleanIframeUrl || undefined}
            className="w-full h-full bg-black border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )
      ) : (
        <video
          ref={videoRef}
          src={movie.videoUrl || FALLBACK_VIDEO}
          poster={movie.posterUrl}
          className="w-full h-full bg-black object-contain"
          autoPlay
          controls
          muted
          playsInline
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            if (!isUnlocked) setShowPaywall(true);
            else if (nextEpisodeUrl) router.push(nextEpisodeUrl);
          }}
        />
      )}

      {/* Next Episode Button overlay (Kept inside video) */}
      {showNextEpisode && nextEpisodeUrl && (
        <div className="absolute bottom-24 right-4 z-20 animate-in fade-in slide-in-from-right-4 duration-500">
          <button 
            onClick={() => router.push(nextEpisodeUrl)}
            className="flex items-center gap-2 bg-cv-primary hover:bg-cv-primary/90 text-white px-5 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all hover:scale-105"
          >
            ตอนถัดไป <Play className="w-4 h-4 fill-white" />
          </button>
        </div>
      )}

      {!isUnlocked && showPaywall && !checkoutMode && (
        <PaywallModal
          movie={movie}
          onRent={() => setCheckoutMode("movie")}
          onSubscribe={() => setCheckoutMode("vip")}
          onTrailer={() => {
            const url = movie.trailerUrl ?? `https://www.youtube.com/results?search_query=${encodeURIComponent(`${movie.title} trailer`)}`;
            window.open(url, "_blank", "noopener,noreferrer");
          }}
          onBack={() => setShowPaywall(false)}
        />
      )}

      {checkoutMode && (
        <CheckoutModal 
          movie={movie}
          mode={checkoutMode}
          onSuccess={handleUnlock} 
          onCancel={() => setCheckoutMode(false)} 
        />
      )}


      {!hasStarted && !showPaywall && !checkoutMode && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-t from-cv-deep via-cv-deep/40 to-transparent backdrop-blur-sm transition-all duration-300">
          <button 
            onClick={() => {
              setHasStarted(true);
              if (!isIframe) {
                const video = videoRef.current;
                if (video) {
                  video.muted = false; // Unmute automatically when user clicks play
                  video.play().catch(() => undefined);
                }
              }
            }} 
            className="flex items-center gap-3 rounded-full border border-white/10 bg-white/20 hover:bg-white/30 hover:scale-105 px-6 py-4 text-base font-semibold text-white backdrop-blur shadow-xl transition-all"
          >
            <Play className="h-5 w-5 fill-white" />
            เริ่มดู
          </button>
        </div>
      )}
      </div>

      {/* External Status Bar (Replaces overlapping UI) */}
      <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => router.push(`/movie/${movie.id}`)}
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/20 hover:scale-105 transition-all"
            title="ออกจากตัวอย่าง"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col">
            <span className="text-sm text-cv-text-dim">สถานะ</span>
            <div className="flex items-center gap-2 text-cv-accent font-medium">
              <Clock3 className="h-4 w-4" />
              <span>{statusLabel}</span>
            </div>
          </div>
        </div>

        {!isUnlocked && (
          <div className="w-full flex-1 md:max-w-md">
            <div className="mb-2 flex items-center justify-between text-xs text-cv-text-dim">
              <span>เวลาตัวอย่างคงเหลือ</span>
              <span>{remainingTime} วินาที</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-cv-primary to-cv-accent transition-all duration-1000 ease-linear" style={{ width: `${Math.max(2, progressPercent)}%` }} />
            </div>
          </div>
        )}

        <div className="hidden md:flex rounded-full bg-white/10 px-4 py-2 text-sm text-white">
          {isPlaying ? "▶ กำลังเล่น" : "⏸ หยุดชั่วคราว"}
        </div>
      </div>
    </div>
  );
}
