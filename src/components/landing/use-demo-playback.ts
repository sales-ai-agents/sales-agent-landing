"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEMO_SCENARIOS } from "@/components/landing/demo-scenarios";
import { trackEvent } from "@/lib/analytics";

const NO_TRACK_LOADED = -1;

export interface DemoPlayback {
  readonly index: number;
  readonly playing: boolean;
  readonly progress: number;
  readonly duration: number | null;
  readonly failed: boolean;
  readonly toggle: () => void;
  readonly select: (index: number) => void;
  readonly seek: (ratio: number) => void;
}

export function useDemoPlayback(): DemoPlayback {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadedIndexRef = useRef(NO_TRACK_LOADED);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = (): void => {
      const audio = audioRef.current;
      if (audio && audio.duration > 0) setProgress(audio.currentTime / audio.duration);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  useEffect(
    () => () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    },
    []
  );

  const getAudio = useCallback((): HTMLAudioElement => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio();
    audio.preload = "metadata";
    audio.addEventListener("loadedmetadata", () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : null);
    });
    audio.addEventListener("play", () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));
    audio.addEventListener("ended", () => {
      setPlaying(false);
      setProgress(1);
    });
    audio.addEventListener("error", () => {
      setFailed(true);
      setPlaying(false);
    });
    audioRef.current = audio;
    return audio;
  }, []);

  const start = useCallback(
    (scenarioIndex: number): void => {
      const { id, audioSrc } = DEMO_SCENARIOS[scenarioIndex];
      const audio = getAudio();
      if (loadedIndexRef.current !== scenarioIndex) {
        audio.src = audioSrc;
        loadedIndexRef.current = scenarioIndex;
        setProgress(0);
        setDuration(null);
        trackEvent("demo_audio_play", { demo_id: id });
      }
      setFailed(false);
      audio.play().catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFailed(true);
      });
    },
    [getAudio]
  );

  const toggle = useCallback((): void => {
    const audio = audioRef.current;
    if (audio && playing) {
      audio.pause();
      return;
    }
    if (audio && progress >= 1) {
      audio.currentTime = 0;
      setProgress(0);
    }
    start(index);
  }, [index, playing, progress, start]);

  const select = useCallback(
    (nextIndex: number): void => {
      const audio = audioRef.current;
      setIndex(nextIndex);
      if (audio && loadedIndexRef.current === nextIndex) {
        audio.currentTime = 0;
        setProgress(0);
      }
      start(nextIndex);
    },
    [start]
  );

  const seek = useCallback((ratio: number): void => {
    const audio = audioRef.current;
    if (!audio || !(audio.duration > 0)) return;
    audio.currentTime = ratio * audio.duration;
    setProgress(ratio);
  }, []);

  return { index, playing, progress, duration, failed, toggle, select, seek };
}
