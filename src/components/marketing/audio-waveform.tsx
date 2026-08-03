"use client";

import { useEffect, useRef, useState, useCallback, useId } from "react";
import type { RefObject } from "react";
import type { Howl } from "howler";
import { cn } from "@/lib/utils";

const BAR_COUNT = 40;

const BAR_HEIGHTS: readonly number[] = [
  0.85, 0.65, 0.35, 0.9, 0.55, 0.2, 0.75, 0.95, 0.6, 0.4, 0.88, 0.7, 0.3, 0.92, 0.5, 0.78, 0.45,
  0.62, 0.98, 0.38, 0.82, 0.28, 0.72, 0.55, 0.9, 0.42, 0.68, 0.85, 0.35, 0.58, 0.95, 0.48, 0.75,
  0.22, 0.88, 0.52, 0.65, 0.8, 0.3, 0.7,
];

interface AudioWaveformProps {
  howlRef: RefObject<Howl | null>;
  isActive: boolean;
  isPlaying: boolean;
  onSeek: (progress: number) => void;
}

export function AudioWaveform({ howlRef, isActive, isPlaying, onSeek }: AudioWaveformProps) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const isSeeking = useRef(false);
  const sliderId = useId();

  useEffect(() => {
    if (!isActive || !isPlaying) return;

    function tick(): void {
      const howl = howlRef.current;
      if (howl && !isSeeking.current) {
        const duration = howl.duration();
        if (duration > 0) {
          const seek = howl.seek();
          if (typeof seek === "number") {
            setProgress((seek / duration) * 100);
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isActive, isPlaying, howlRef]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setProgress(value);
      onSeek(value / 100);
    },
    [onSeek]
  );

  const handleSeekStart = useCallback(() => {
    isSeeking.current = true;
  }, []);

  const handleSeekEnd = useCallback(() => {
    isSeeking.current = false;
  }, []);

  const displayProgress = isActive ? progress : 0;

  return (
    <div className="relative flex h-10 flex-1 items-center">
      <div className="flex h-full w-full items-center gap-1" aria-hidden="true">
        {BAR_HEIGHTS.map((height, index) => {
          const threshold = ((index + 0.5) / BAR_COUNT) * 100;
          return (
            <div
              key={index}
              className={cn(
                "flex-1 rounded-full",
                threshold <= displayProgress ? "bg-primary" : "bg-black/20"
              )}
              style={{ height: `${height * 80}%` }}
            />
          );
        })}
      </div>

      <input
        id={sliderId}
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={displayProgress}
        onChange={handleChange}
        onPointerDown={handleSeekStart}
        onPointerUp={handleSeekEnd}
        aria-label="Прогрес аудіо"
        disabled={!isActive}
        className={cn(
          "absolute inset-0 h-full w-full opacity-0",
          isActive ? "cursor-pointer" : "pointer-events-none"
        )}
      />
    </div>
  );
}
