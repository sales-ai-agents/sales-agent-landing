"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { cn } from "@/lib/utils";
import { HERO_TRANSCRIPT, type Speaker } from "@/components/landing/data";
import { prefersReducedMotion } from "@/components/landing/motion/shared";
import {
  createWaveState,
  drawWave,
  resizeWave,
  type WaveState,
} from "@/components/landing/wave-canvas";

const LINE_PAUSE_MS = 2300;
const TYPING_BASE_MS = 24;
const TYPING_JITTER_MS = 28;
const AGENT_ENERGY = 0.85;
const CLIENT_ENERGY = 0.35;

function useWaveCanvas(
  stageRef: RefObject<HTMLDivElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  stateRef: RefObject<WaveState>
): void {
  useEffect(() => {
    const state = stateRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!stage || !canvas || !context) return;
    const reduce = prefersReducedMotion();
    let running = false;
    let frame = 0;

    const loop = (time: number): void => {
      if (!running) return;
      drawWave(context, state, time);
      frame = requestAnimationFrame(loop);
    };
    const onResize = (): void => {
      resizeWave(canvas, context, state);
      if (reduce) drawWave(context, state, 0);
    };
    const onMove = (event: PointerEvent): void => {
      state.targetPointerX = event.clientX - canvas.getBoundingClientRect().left;
      state.targetBoost = 1;
    };
    const onLeave = (): void => {
      state.targetBoost = 0;
    };
    const visibility = new IntersectionObserver(([entry]) => {
      const wasRunning = running;
      running = entry.isIntersecting;
      if (running && !wasRunning) frame = requestAnimationFrame(loop);
    });
    const resize = new ResizeObserver(onResize);

    resize.observe(stage);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    if (!reduce) visibility.observe(stage);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      visibility.disconnect();
      resize.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [stageRef, canvasRef, stateRef]);
}

function useTypedTranscript(
  stageRef: RefObject<HTMLDivElement | null>,
  textRef: RefObject<HTMLSpanElement | null>,
  stateRef: RefObject<WaveState>
): Speaker {
  const [speaker, setSpeaker] = useState<Speaker>(HERO_TRANSCRIPT[0].speaker);

  useEffect(() => {
    const stage = stageRef.current;
    const textNode = textRef.current;
    if (!stage || !textNode) return;
    const reduce = prefersReducedMotion();
    let lineIndex = 0;
    let typedLength = 0;
    let visible = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const startLine = (speakerName: Speaker): void => {
      setSpeaker(speakerName);
      stateRef.current.targetEnergy = speakerName === "client" ? CLIENT_ENERGY : AGENT_ENERGY;
    };

    const tick = (): void => {
      if (!visible) return;
      const line = HERO_TRANSCRIPT[lineIndex];
      if (typedLength === 0) startLine(line.speaker);
      typedLength = reduce ? line.text.length : typedLength + 1;
      textNode.textContent = line.text.slice(0, typedLength);
      if (typedLength < line.text.length) {
        timer = setTimeout(tick, TYPING_BASE_MS + Math.random() * TYPING_JITTER_MS);
        return;
      }
      lineIndex = (lineIndex + 1) % HERO_TRANSCRIPT.length;
      typedLength = 0;
      timer = setTimeout(tick, LINE_PAUSE_MS);
    };

    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      clearTimeout(timer);
      if (visible && !wasVisible) timer = setTimeout(tick, 0);
    });
    observer.observe(stage);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [stageRef, textRef, stateRef]);

  return speaker;
}

export function HeroWave() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const stateRef = useRef<WaveState>(createWaveState());
  const speaker = useTypedTranscript(stageRef, textRef, stateRef);
  useWaveCanvas(stageRef, canvasRef, stateRef);

  return (
    <div className="wave-stage" aria-hidden="true" ref={stageRef}>
      <canvas className="wave" ref={canvasRef} />
      <div className="transcript">
        <span className={cn("who", speaker === "client" && "c")}>
          {speaker === "client" ? "Клієнт" : "Агент"}
        </span>
        <span className="txt">
          <span ref={textRef} />
          <span className="caret" />
        </span>
      </div>
    </div>
  );
}
