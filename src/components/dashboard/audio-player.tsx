"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Howl } from "howler";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Progress } from "@/components/ui";

const SEEK_STEP_SEC = 5;

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

  const handleSeekKey = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const howl = howlRef.current;
      if (!howl || duration <= 0) return;
      const delta =
        event.key === "ArrowRight" ? SEEK_STEP_SEC : event.key === "ArrowLeft" ? -SEEK_STEP_SEC : 0;
      if (delta === 0) return;
      event.preventDefault();
      const seekTo = Math.max(0, Math.min(duration, readSeek(howl) + delta));
      howl.seek(seekTo);
      setCurrentTime(seekTo);
    },
    [duration]
  );

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Аудіозапис дзвінка</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Запис недоступний</p>
        </CardContent>
      </Card>
    );
  }

  const progressPercent =
    duration > 0 ? Math.max(0, Math.min(100, (currentTime / duration) * 100)) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Аудіозапис дзвінка</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <Button
          type="button"
          size="icon"
          onClick={togglePlay}
          disabled={!isLoaded}
          aria-label={isPlaying ? "Пауза" : "Відтворити"}
        >
          {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        </Button>
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <div
          className="flex-1 cursor-pointer py-2"
          onClick={handleSeek}
          onKeyDown={handleSeekKey}
          role="slider"
          tabIndex={0}
          aria-label="Прогрес відтворення"
          aria-valuenow={Math.round(currentTime)}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
        >
          <Progress value={progressPercent} />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleMute}
          aria-label={isMuted ? "Увімкнути звук" : "Вимкнути звук"}
        >
          {isMuted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
        </Button>
      </CardContent>
    </Card>
  );
};
