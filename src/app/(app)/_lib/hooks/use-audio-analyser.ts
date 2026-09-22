"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Howl } from "howler";

export interface AudioAnalyserControls {
  connect: (howl: Howl) => void;
  disconnect: () => void;
  getAmplitude: () => number;
}

interface SourceEntry {
  context: AudioContext;
  source: MediaElementAudioSourceNode;
}

const EMPTY_BUFFER = new Uint8Array(0) as Uint8Array<ArrayBuffer>;

const sourceCache = new WeakMap<HTMLMediaElement, SourceEntry>();

export const useAudioAnalyser = (): AudioAnalyserControls => {
  const analyserRef = useRef<AnalyserNode | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<Uint8Array<ArrayBuffer>>(EMPTY_BUFFER);

  useEffect(() => {
    return () => {
      analyserRef.current?.disconnect();
      analyserRef.current = null;
      contextRef.current = null;
      bufferRef.current = EMPTY_BUFFER;
    };
  }, []);

  return useMemo<AudioAnalyserControls>(
    () => ({
      connect(howl: Howl) {
        const audioEl = (
          howl as Howl & {
            _sounds?: Array<{
              _node?: HTMLMediaElement;
            }>;
          }
        )._sounds?.[0]?._node;

        if (!(audioEl instanceof HTMLMediaElement)) {
          return;
        }

        let entry = sourceCache.get(audioEl);

        if (!entry) {
          const context = new AudioContext();
          const source = context.createMediaElementSource(audioEl);

          entry = {
            context,
            source,
          };

          sourceCache.set(audioEl, entry);
        }

        analyserRef.current?.disconnect();

        const analyser = entry.context.createAnalyser();

        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;

        entry.source.connect(analyser);
        analyser.connect(entry.context.destination);

        analyserRef.current = analyser;
        contextRef.current = entry.context;

        bufferRef.current = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;

        if (entry.context.state === "suspended") {
          entry.context.resume().catch(() => undefined);
        }
      },

      disconnect() {
        analyserRef.current?.disconnect();

        analyserRef.current = null;
        bufferRef.current = EMPTY_BUFFER;
      },

      getAmplitude() {
        const analyser = analyserRef.current;
        const buffer = bufferRef.current;

        if (!analyser || buffer.length === 0) {
          return 0;
        }

        analyser.getByteFrequencyData(buffer);

        let sum = 0;

        for (let i = 0; i < buffer.length; i++) {
          sum += buffer[i];
        }

        return sum / (255 * buffer.length);
      },
    }),
    []
  );
};
