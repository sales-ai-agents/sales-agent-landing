"use client";

import { useState, useRef, useEffect } from "react";
import { Howl } from "howler";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/utils";

interface AudioPlayerProps {
  src: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
  const howlRef = useRef<Howl | null>(null);
  const rafRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    function tick() {
      const howl = howlRef.current;
      if (!howl || !howl.playing()) return;
      setCurrentTime(howl.seek());
      rafRef.current = requestAnimationFrame(tick);
    }

    const howl = new Howl({
      src: [src],
      html5: true,
      preload: true,
      onload: () => {
        setDuration(howl.duration());
        setIsLoaded(true);
      },
      onplay: () => {
        setIsPlaying(true);
        tick();
      },
      onpause: () => setIsPlaying(false),
      onstop: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      },
      onend: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      },
      onloaderror: () => setError(true),
      onplayerror: () => setError(true),
    });

    howlRef.current = howl;

    return () => {
      cancelAnimationFrame(rafRef.current);
      howl.unload();
    };
  }, [src]);

  function togglePlay(): void {
    const howl = howlRef.current;
    if (!howl) return;

    if (isPlaying) {
      howl.pause();
    } else {
      howl.play();
    }
  }

  function toggleMute(): void {
    const howl = howlRef.current;
    if (!howl) return;

    const next = !isMuted;
    howl.mute(next);
    setIsMuted(next);
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>): void {
    const howl = howlRef.current;
    if (!howl || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const seekTo = pct * duration;

    howl.seek(seekTo);
    setCurrentTime(seekTo);
  }

  if (error) {
    return (
      <div className="border-border bg-background rounded-2xl border p-5">
        <h2 className="mb-3 text-sm font-semibold">Аудіозапис дзвінка</h2>
        <p className="text-muted-foreground text-sm">Запис недоступний</p>
      </div>
    );
  }

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="border-border bg-background rounded-2xl border p-5">
      <h2 className="mb-3 text-sm font-semibold">Аудіозапис дзвінка</h2>
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          className="h-10 w-10 shrink-0 rounded-full"
          onClick={togglePlay}
          disabled={!isLoaded}
          aria-label={isPlaying ? "Пауза" : "Відтворити"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <span className="text-muted-foreground w-12 shrink-0 font-mono text-xs">
          {formatDuration(Math.round(currentTime))}
        </span>

        <div
          className="bg-muted relative h-2 flex-1 cursor-pointer rounded-full"
          onClick={handleSeek}
          role="slider"
          aria-label="Прогрес відтворення"
          aria-valuenow={Math.round(currentTime)}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
        >
          <div
            className="bg-primary absolute inset-y-0 left-0 rounded-full transition-[width] duration-100"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <span className="text-muted-foreground w-12 shrink-0 text-right font-mono text-xs">
          {formatDuration(Math.round(duration))}
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={toggleMute}
          aria-label={isMuted ? "Увімкнути звук" : "Вимкнути звук"}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
