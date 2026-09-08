"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Howl } from "howler";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui";

interface AudioPlayerProps {
  src: string;
}

const formatTime = (seconds: number): string => {
  const safeSeconds = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  const totalSeconds = Math.floor(safeSeconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

const readSeek = (howl: Howl): number => {
  const position = howl.seek();

  return typeof position === "number" && Number.isFinite(position) ? position : 0;
};

export const AudioPlayer = ({ src }: AudioPlayerProps) => {
  const howlRef = useRef<Howl | null>(null);
  const rafRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    const howl = new Howl({
      src: [src],
      format: ["ogg", "mp3", "wav"],
      html5: true,
      preload: true,
    });

    howlRef.current = howl;

    const loop = () => {
      setCurrentTime(readSeek(howl));
      rafRef.current = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      stopRaf();
      rafRef.current = requestAnimationFrame(loop);
    };

    const handleLoad = () => {
      setDuration(howl.duration());
      setIsLoaded(true);
    };
    const handlePlay = () => {
      setIsPlaying(true);
      startLoop();
    };
    const handlePause = () => {
      setIsPlaying(false);
      stopRaf();
      setCurrentTime(readSeek(howl));
    };
    const handleStop = () => {
      setIsPlaying(false);
      stopRaf();
      setCurrentTime(0);
    };
    const handleEnd = () => {
      setIsPlaying(false);
      stopRaf();
      setCurrentTime(0);
    };
    const handleError = () => {
      setError(true);
      stopRaf();
    };

    howl.on("load", handleLoad);
    howl.on("play", handlePlay);
    howl.on("pause", handlePause);
    howl.on("stop", handleStop);
    howl.on("end", handleEnd);
    howl.on("loaderror", handleError);
    howl.on("playerror", handleError);

    return () => {
      stopRaf();
      howl.unload();
      howlRef.current = null;
    };
  }, [src, stopRaf]);

  const togglePlay = useCallback(() => {
    const howl = howlRef.current;
    if (!howl) return;
    if (howl.playing()) {
      howl.pause();
    } else {
      howl.play();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const howl = howlRef.current;
    if (!howl) return;
    setIsMuted((prev) => {
      const next = !prev;
      howl.mute(next);
      return next;
    });
  }, []);

  const handleSeek = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const howl = howlRef.current;
      if (!howl || duration <= 0) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      const seekTo = ratio * duration;

      howl.seek(seekTo);
      setCurrentTime(seekTo);
    },
    [duration]
  );

  if (error) {
    return (
      <div className="border-border bg-background rounded-2xl border p-5">
        <h2 className="mb-3 text-sm font-semibold">Аудіозапис дзвінка</h2>
        <p className="text-muted-foreground text-sm">Запис недоступний</p>
      </div>
    );
  }

  const progressPercent =
    duration > 0 ? Math.max(0, Math.min(100, (currentTime / duration) * 100)) : 0;

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
          {formatTime(currentTime)}
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
            className="bg-primary absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <span className="text-muted-foreground w-12 shrink-0 text-right font-mono text-xs">
          {formatTime(duration)}
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
};
