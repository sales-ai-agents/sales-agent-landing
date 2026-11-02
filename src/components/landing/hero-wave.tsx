"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { HERO_TRANSCRIPT, type Speaker } from "@/components/landing/data";
import {
  createWaveState,
  drawWave,
  resizeWave,
  type WaveState,
} from "@/components/landing/wave-canvas";

const LINE_PAUSE_MS = 2300;
const AGENT_ENERGY = 0.85;
const CLIENT_ENERGY = 0.35;

const isReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useWaveCanvas(
  stageRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  stateRef: React.RefObject<WaveState>
): void {
  useEffect(() => {
    const state = stateRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!stage || !canvas || !context) return;
    let running = false;
    let frame = 0;

    const size = (): void => resizeWave(canvas, context, state);
    const loop = (time: number): void => {
      if (!running) return;
      drawWave(context, state, time);
      frame = requestAnimationFrame(loop);
    };
    const onMove = (event: PointerEvent): void => {
      state.targetPointerX = event.clientX - canvas.getBoundingClientRect().left;
      state.targetBoost = 1;
    };
    const onLeave = (): void => {
      state.targetBoost = 0;
    };
    const observer = new IntersectionObserver(([entry]) => {
      const wasRunning = running;
      running = entry.isIntersecting;
      if (running && !wasRunning) frame = requestAnimationFrame(loop);
    });

    size();
    window.addEventListener("resize", size);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    if (isReducedMotion()) drawWave(context, state, 0);
    else observer.observe(stage);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", size);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [stageRef, canvasRef, stateRef]);
}

function useTypedTranscript(stateRef: React.RefObject<WaveState>) {
  const [speaker, setSpeaker] = useState<Speaker>("agent");
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const reduce = isReducedMotion();
    let lineIndex = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const typeLine = (): void => {
      const line = HERO_TRANSCRIPT[lineIndex++ % HERO_TRANSCRIPT.length];
      let length = 0;
      setSpeaker(line.speaker);
      stateRef.current.targetEnergy = line.speaker === "client" ? CLIENT_ENERGY : AGENT_ENERGY;
      const step = (): void => {
        length += 1;
        setTyped(line.text.slice(0, length));
        const finished = length >= line.text.length;
        timer = setTimeout(
          finished ? typeLine : step,
          finished ? LINE_PAUSE_MS : reduce ? 0 : 24 + Math.random() * 28
        );
      };
      step();
    };

    timer = setTimeout(typeLine, 0);
    return () => clearTimeout(timer);
  }, [stateRef]);

  return { speaker, typed };
}

export function HeroWave() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<WaveState>(createWaveState());
  const { speaker, typed } = useTypedTranscript(stateRef);
  useWaveCanvas(stageRef, canvasRef, stateRef);

  return (
    <div className="wave-stage" aria-hidden="true" ref={stageRef}>
      <canvas id="wave" ref={canvasRef} />
      <div className="transcript">
        <span className={cn("who", speaker === "client" && "c")} id="tWho">
          {speaker === "client" ? "Клієнт" : "Агент"}
        </span>
        <span className="txt">
          <span id="tTxt">{typed}</span>
          <span className="caret" />
        </span>
      </div>
    </div>
  );
}
