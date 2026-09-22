"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import type { AudioAnalyserControls } from "@/app/(app)/_lib/hooks/use-audio-analyser";

const ORB_SIZE = 200;
const FILTER_ID = "orb-cloud-filter";

const SPRING_CONFIG = { stiffness: 140, damping: 22, mass: 0.6 } as const;

interface AnimatedVoiceOrbProps {
  isVisible: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  voiceName: string;
  analyser: AudioAnalyserControls;
  onClose: () => void;
}

const useAmplitude = (isPlaying: boolean, analyser: AudioAnalyserControls) => {
  const raw = useMotionValue(0);
  const amplitude = useSpring(raw, SPRING_CONFIG);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const stop = (): void => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    if (!isPlaying) {
      stop();
      raw.set(0);
      return stop;
    }

    const tick = (): void => {
      raw.set(Math.sqrt(analyser.getAmplitude()));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return stop;
  }, [isPlaying, analyser, raw]);

  return amplitude;
};

const useCloudAnimation = (isVisible: boolean, amplitude: ReturnType<typeof useSpring>) => {
  const fxRef = useRef(0.012);
  const fyRef = useRef(0.008);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    const turbulence = document.getElementById(`${FILTER_ID}-turbulence`);
    if (!turbulence) return;

    let last: number | null = null;

    const tick = (now: number): void => {
      const dt = last === null ? 0.016 : Math.min((now - last) / 1000, 0.1);
      last = now;

      // Base drift is always active; amplitude adds reactive energy on top
      const level = amplitude.get();
      const speedX = 0.0004 + level * 0.0022;
      const speedY = 0.0003 + level * 0.0015;

      fxRef.current += dt * speedX;
      fyRef.current += dt * speedY;

      turbulence.setAttribute(
        "baseFrequency",
        `${fxRef.current.toFixed(5)} ${fyRef.current.toFixed(5)}`
      );

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return (): void => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      last = null;
    };
  }, [isVisible, amplitude]);
};

interface RippleProps {
  delay: number;
  isPlaying: boolean;
}

const Ripple = ({ delay, isPlaying }: RippleProps) => (
  <motion.span
    className="border-primary/30 absolute inset-0 rounded-full border"
    initial={{ scale: 1, opacity: 0 }}
    animate={
      isPlaying
        ? {
            scale: [1, 2],
            opacity: [0.5, 0],
            transition: { duration: 2.5, delay, repeat: Infinity, ease: "easeOut" },
          }
        : { scale: 1, opacity: 0 }
    }
  />
);

export const AnimatedVoiceOrb = ({
  isVisible,
  isPlaying,
  isLoading,
  voiceName,
  analyser,
  onClose,
}: AnimatedVoiceOrbProps): React.ReactElement | null => {
  const amplitude = useAmplitude(isPlaying, analyser);
  useCloudAnimation(isVisible, amplitude);

  const coreScale = useTransform(amplitude, [0, 1], [1, 1.08]);
  const glowScale = useTransform(amplitude, [0, 1], [1.05, 1.5]);
  const glowOpacity = useTransform(amplitude, [0, 0.05, 1], [0.3, 0.5, 0.75]);

  const statusLabel = isLoading ? "Завантаження..." : isPlaying ? voiceName : "Пауза";

  const overlay = (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* SVG filter definition — display:none, referenced by CSS filter */}
          <svg
            aria-hidden="true"
            style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
          >
            <defs>
              <filter id={FILTER_ID} x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence
                  id={`${FILTER_ID}-turbulence`}
                  type="fractalNoise"
                  baseFrequency="0.012 0.008"
                  numOctaves="6"
                  result="noise"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 1
                          0 0 0 0 1
                          0 0 0 0 1
                          0 0 0 2.8 -0.9"
                  in="noise"
                  result="clouds"
                />
                <feComposite in="clouds" in2="SourceGraphic" operator="in" />
              </filter>
            </defs>
          </svg>

          <motion.div
            key="orb-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            key="orb-panel"
            role="dialog"
            aria-label={`Відтворення голосу ${voiceName}`}
            aria-modal="true"
            aria-live="polite"
            initial={{ opacity: 0, scale: 0.6, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed bottom-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-5"
          >
            <div
              className="relative flex items-center justify-center"
              style={{ width: ORB_SIZE, height: ORB_SIZE }}
            >
              <Ripple isPlaying={isPlaying} delay={0} />
              <Ripple isPlaying={isPlaying} delay={1} />
              <Ripple isPlaying={isPlaying} delay={2} />

              {/* Soft ambient glow */}
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 rounded-full blur-3xl"
                style={{
                  scale: glowScale,
                  opacity: glowOpacity,
                  background:
                    "radial-gradient(circle, rgba(160,210,255,0.7) 0%, rgba(0,91,255,0.35) 55%, transparent 80%)",
                }}
              />

              {/* Idle breathing wrapper */}
              <motion.div
                className="absolute inset-[10%] overflow-hidden rounded-full"
                animate={
                  !isPlaying && !isLoading
                    ? {
                        scale: [1, 1.025, 1],
                        transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                      }
                    : {}
                }
              >
                <motion.div className="relative h-full w-full" style={{ scale: coreScale }}>
                  {/* Base — milky pale-blue sky */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: [
                        // Bright hazy center (the 'light source' behind the clouds)
                        "radial-gradient(ellipse 60% 55% at 48% 42%, rgba(255,255,255,0.95) 0%, rgba(220,238,255,0.7) 40%, transparent 70%)",
                        // Lower blue gradient for depth
                        "radial-gradient(ellipse 100% 100% at 50% 50%, #deeeff 0%, #b8d8ff 35%, #7ab8ff 62%, #4090ee 80%, #005bff 100%)",
                      ].join(", "),
                    }}
                  />

                  {/* Cloud layer — SVG feTurbulence filter over a white rect */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full"
                    style={{
                      filter: `url(#${FILTER_ID})`,
                      background: "rgba(255,255,255,0.9)",
                      mixBlendMode: "screen",
                      opacity: 0.65,
                    }}
                  />

                  {/* Soft vignette — darkens edges for spherical depth */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, rgba(0,60,180,0.35) 78%, rgba(0,30,120,0.65) 100%)",
                    }}
                  />

                  {/* Specular highlight */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "radial-gradient(ellipse 30% 20% at 35% 28%, rgba(255,255,255,0.6) 0%, transparent 100%)",
                    }}
                  />
                </motion.div>
              </motion.div>

              {isLoading && (
                <motion.div
                  className="absolute inset-[6%] rounded-full border-2 border-transparent border-t-blue-300/70"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>

            <p className="text-sm font-medium text-white drop-shadow-md">{statusLabel}</p>
            <p className="text-xs text-white/50">Натисніть поза орбом, щоб закрити</p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (typeof window === "undefined") return null;
  return createPortal(overlay, document.body);
};
