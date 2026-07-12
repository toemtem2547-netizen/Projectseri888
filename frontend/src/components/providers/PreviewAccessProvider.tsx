"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type PreviewAccessContextValue = {
  unlockedMovies: Record<string, boolean>;
  unlockMovie: (movieId: string, source?: "rent" | "subscribe") => void;
  resumeTime: Record<string, number>;
  setResumeTime: (movieId: string, value: number) => void;
};

const PreviewAccessContext = createContext<PreviewAccessContextValue | undefined>(undefined);

export function PreviewAccessProvider({ children }: { children: React.ReactNode }) {
  const [unlockedMovies, setUnlockedMovies] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(window.localStorage.getItem("cv-unlocked-movies") ?? "{}") as Record<string, boolean>;
    } catch {
      return {};
    }
  });

  const [resumeTime, setResumeTimeState] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(window.localStorage.getItem("cv-resume-time") ?? "{}") as Record<string, number>;
    } catch {
      return {};
    }
  });

  useEffect(() => {
    window.localStorage.setItem("cv-unlocked-movies", JSON.stringify(unlockedMovies));
  }, [unlockedMovies]);

  useEffect(() => {
    window.localStorage.setItem("cv-resume-time", JSON.stringify(resumeTime));
  }, [resumeTime]);

  const unlockMovie = (movieId: string) => {
    setUnlockedMovies((current) => ({ ...current, [movieId]: true }));
  };

  const setResumeTime = (movieId: string, value: number) => {
    setResumeTimeState((current) => ({ ...current, [movieId]: value }));
  };

  const value = useMemo(
    () => ({ unlockedMovies, unlockMovie, resumeTime, setResumeTime }),
    [resumeTime, unlockedMovies]
  );

  return <PreviewAccessContext.Provider value={value}>{children}</PreviewAccessContext.Provider>;
}

export function usePreviewAccess() {
  const context = useContext(PreviewAccessContext);
  if (!context) throw new Error("usePreviewAccess must be used inside PreviewAccessProvider");
  return context;
}
