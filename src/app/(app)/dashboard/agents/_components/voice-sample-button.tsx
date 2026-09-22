"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Play, Square } from "lucide-react";
import { Howl } from "howler";

import { useAudioAnalyser } from "@/app/(app)/_lib/hooks/use-audio-analyser";
import { apiUrl } from "@/lib/api-config";
import type { Voice } from "@dashboard/types";
import { AnimatedVoiceOrb } from "./animated-voice-orb";

interface VoiceSampleButtonProps {
  voice: Voice;
}

type PlaybackState = "idle" | "loading" | "playing" | "paused" | "error";

const resolveSampleSrc = (voice: Voice): string => apiUrl.voiceSample(voice.key);

const VoiceSampleButton = ({ voice }: VoiceSampleButtonProps) => {
  return <VoiceSampleButtonContent key={voice.key} voice={voice} />;
};

const VoiceSampleButtonContent = ({ voice }: VoiceSampleButtonProps) => {
  const howlRef = useRef<Howl | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");

  const analyser = useAudioAnalyser();

  const destroyHowl = useCallback((): void => {
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
      howlRef.current = null;
    }

    analyser.disconnect();
  }, [analyser]);

  useEffect(() => {
    return () => {
      destroyHowl();
    };
  }, [destroyHowl]);

  const handlePlaybackError = useCallback((): void => {
    destroyHowl();
    setPlaybackState("error");
  }, [destroyHowl]);

  const handleOrbClose = useCallback((): void => {
    if (!howlRef.current) return;

    howlRef.current.stop();
    setPlaybackState("idle");
  }, []);

  const createHowl = useCallback((): Howl => {
    const howl = new Howl({
      src: [resolveSampleSrc(voice)],
      format: ["ogg", "mp3", "wav"],
      html5: true,
      preload: true,

      onload: () => {
        setPlaybackState("paused");
      },

      onplay: () => {
        setPlaybackState("playing");
        analyser.connect(howl);
      },

      onpause: () => {
        setPlaybackState("paused");
      },

      onstop: () => {
        setPlaybackState("idle");
        analyser.disconnect();
      },

      onend: () => {
        setPlaybackState("idle");
        analyser.disconnect();
        howlRef.current = null;
        howl.unload();
      },

      onloaderror: handlePlaybackError,
      onplayerror: handlePlaybackError,
    });

    return howl;
  }, [voice, analyser, handlePlaybackError]);

  const handleToggle = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>): void => {
      event.stopPropagation();

      if (playbackState === "error") {
        return;
      }

      if (playbackState === "playing" && howlRef.current) {
        howlRef.current.stop();
        return;
      }

      if (playbackState === "paused" && howlRef.current) {
        howlRef.current.play();
        return;
      }

      setPlaybackState("loading");

      const howl = createHowl();

      howlRef.current = howl;
      howl.play();
    },
    [playbackState, createHowl]
  );

  if (playbackState === "error") {
    return null;
  }

  const isPlaying = playbackState === "playing";
  const isLoading = playbackState === "loading";
  const isOrbVisible = isPlaying || isLoading;

  const renderButtonIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-3.5 w-3.5 animate-spin" />;
    }

    if (isPlaying) {
      return <Square className="h-3 w-3 fill-current" />;
    }

    return <Play className="h-3 w-3 fill-current" />;
  };

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        aria-label={isPlaying ? `Зупинити голос ${voice.name}` : `Прослухати голос ${voice.name}`}
        className="bg-muted text-muted-foreground hover:bg-muted/70 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {renderButtonIcon()}
      </button>

      <AnimatedVoiceOrb
        isVisible={isOrbVisible}
        isPlaying={isPlaying}
        isLoading={isLoading}
        voiceName={voice.name}
        analyser={analyser}
        onClose={handleOrbClose}
      />
    </>
  );
};

export { VoiceSampleButton };
