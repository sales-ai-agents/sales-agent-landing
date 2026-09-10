"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Howl } from "howler";
import { Play, Pause, Loader2 } from "lucide-react";

import { apiUrl } from "@/lib/api-config";
import type { Voice } from "@dashboard/types";

interface VoiceSampleButtonProps {
  voice: Voice;
}

const resolveSampleSrc = (voice: Voice): string => apiUrl.voiceSample(voice.key);

export const VoiceSampleButton = ({ voice }: VoiceSampleButtonProps) => {
  const howlRef = useRef<Howl | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    return () => {
      howlRef.current?.unload();
      howlRef.current = null;
    };
  }, []);

  const toggle = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (hasError) return;

      const existing = howlRef.current;
      if (existing) {
        if (existing.playing()) existing.pause();
        else existing.play();
        return;
      }

      setIsLoading(true);
      const howl = new Howl({
        src: [resolveSampleSrc(voice)],
        format: ["ogg", "mp3", "wav"],
        html5: true,
        preload: true,
        onload: () => setIsLoading(false),
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
        onend: () => setIsPlaying(false),
        onloaderror: () => {
          setHasError(true);
          setIsLoading(false);
        },
        onplayerror: () => {
          setHasError(true);
          setIsLoading(false);
        },
      });

      howlRef.current = howl;
      howl.play();
    },
    [voice, hasError]
  );

  if (hasError) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isLoading}
      aria-label={isPlaying ? `Пауза — ${voice.name}` : `Прослухати голос ${voice.name}`}
      className="bg-muted text-muted-foreground hover:bg-muted/80 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : isPlaying ? (
        <Pause className="h-3 w-3" />
      ) : (
        <Play className="h-3 w-3" />
      )}
    </button>
  );
};
