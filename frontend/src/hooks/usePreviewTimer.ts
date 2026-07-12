"use client";

import { useEffect, useMemo, useState } from "react";

interface UsePreviewTimerProps {
  previewDuration: number;
  currentTime: number;
  isUnlocked: boolean;
}

export function usePreviewTimer({ previewDuration, currentTime, isUnlocked }: UsePreviewTimerProps) {
  const [remainingTime, setRemainingTime] = useState(previewDuration);

  useEffect(() => {
    if (isUnlocked) {
      setRemainingTime(0);
      return;
    }

    const next = Math.max(0, Math.ceil(previewDuration - currentTime));
    setRemainingTime(next);
  }, [currentTime, isUnlocked, previewDuration]);

  const progressPercent = useMemo(() => {
    if (previewDuration <= 0) return 0;
    return Math.min(100, (currentTime / previewDuration) * 100);
  }, [currentTime, previewDuration]);

  return { remainingTime, progressPercent };
}
