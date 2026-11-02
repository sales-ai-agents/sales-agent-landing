"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, RefObject } from "react";
import { cn } from "@/lib/utils";
import { DEMO_SCENARIOS } from "@/components/landing/data";
import { DemoEngine, type ChatMessage } from "@/components/landing/demo-engine";
import { CheckIcon, PauseIcon, PlayIcon } from "@/components/landing/icons";

const BAR_COUNT = 72;
const AUTOPLAY_THRESHOLD = 0.45;
const FLIP_DURATION_MS = 420;
const FLIP_EASING = "cubic-bezier(.2,.7,.1,1)";

const BAR_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, index) => {
  const height = 18 + Math.abs(Math.sin(index * 0.9) * 50 + Math.sin(index * 0.37) * 30);
  return Math.round(Math.min(100, height) * 100) / 100;
});

const formatClock = (seconds: number): string =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

function useChatFlip(
  chatRef: RefObject<HTMLDivElement | null>,
  messages: readonly ChatMessage[]
): void {
  const positions = useRef(new Map<string, number>());

  useLayoutEffect(() => {
    const chat = chatRef.current;
    if (!chat) return;
    const origin = chat.getBoundingClientRect().top;
    const next = new Map<string, number>();
    for (const child of Array.from(chat.children) as HTMLElement[]) {
      const key = child.dataset.key ?? "";
      const top = child.getBoundingClientRect().top - origin;
      const previous = positions.current.get(key);
      if (previous !== undefined && Math.abs(previous - top) > 0.5) {
        child.animate([{ transform: `translateY(${previous - top}px)` }, { transform: "none" }], {
          duration: FLIP_DURATION_MS,
          easing: FLIP_EASING,
        });
      }
      next.set(key, top);
    }
    positions.current = next;
  }, [chatRef, messages]);
}

function useAutoplay(playerRef: RefObject<HTMLDivElement | null>, engine: DemoEngine): void {
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    let autoplayed = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        engine.setInView(entry.isIntersecting);
        if (!entry.isIntersecting || autoplayed) return;
        autoplayed = true;
        engine.play();
      },
      { threshold: AUTOPLAY_THRESHOLD }
    );
    observer.observe(player);
    return () => {
      observer.disconnect();
      engine.dispose();
    };
  }, [playerRef, engine]);
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const side = message.speaker === "agent" ? "a" : "c";
  if (message.typing) {
    return (
      <div className={cn("msg typing", side)} data-key={message.id}>
        <i />
        <i />
        <i />
      </div>
    );
  }
  return (
    <div className={cn("msg", side)} data-key={message.id}>
      <small>{message.speaker === "agent" ? "ШІ-агент" : "Клієнт"}</small>
      {message.text}
    </div>
  );
}

export function DemoPlayer() {
  const [engine] = useState(() => new DemoEngine());
  const snapshot = useSyncExternalStore(
    engine.subscribe,
    engine.getSnapshot,
    engine.getServerSnapshot
  );
  const playerRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const { index, playing, progress, done, messages } = snapshot;
  const scenario = DEMO_SCENARIOS[index];
  const filledBars = Math.floor(progress * BAR_COUNT);

  useAutoplay(playerRef, engine);
  useChatFlip(chatRef, messages);

  return (
    <>
      <div className="demo-tabs" id="demoTabs" data-r="">
        {DEMO_SCENARIOS.map((item, tabIndex) => (
          <button
            key={item.title}
            type="button"
            className={cn("demo-tab", tabIndex === index && "on")}
            style={{ "--prog": tabIndex === index ? progress : 0 } as CSSProperties}
            aria-pressed={tabIndex === index}
            onClick={() => engine.select(tabIndex)}
          >
            <span className="mono">0{tabIndex + 1}</span>
            <b className="t2">{item.title}</b>
          </button>
        ))}
      </div>

      <div className="player" id="player" data-r="" ref={playerRef}>
        <div className="player-top">
          <button
            type="button"
            className="play"
            id="playBtn"
            aria-label={playing ? "Пауза" : "Відтворити"}
            onClick={engine.toggle}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <div className="t">
            <b id="pTitle">{scenario.title}</b>
            <span className="mono" id="pTag">
              {scenario.tag} · демо-діалог
            </span>
          </div>
        </div>
        <div className="pwave" id="pWave" aria-hidden="true">
          {BAR_HEIGHTS.map((height, barIndex) => (
            <i
              key={barIndex}
              className={barIndex < filledBars ? "p" : undefined}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="ptime mono">
          <span id="pCur">{formatClock(progress * scenario.durationSeconds)}</span>
          <span id="pDur">{formatClock(scenario.durationSeconds)}</span>
        </div>
        <div className="chat" id="chat" ref={chatRef} aria-live="polite">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
        </div>
        <div className={cn("result", done && "done")} id="pResult">
          <span className="r">
            <i>
              <CheckIcon />
            </i>
            <span id="pResTxt">Результат: {scenario.result}</span>
          </span>
          <span className="mono">→ CRM</span>
        </div>
      </div>
    </>
  );
}
