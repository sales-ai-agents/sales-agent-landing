"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { CSSProperties, RefObject } from "react";
import { cn } from "@/lib/utils";
import { useLandingCopy } from "@/components/landing/copy/provider";
import { DEMO_SCENARIOS } from "@/components/landing/demo-scenarios";
import type { ClientCopy } from "@/components/landing/copy/client-types";
import { buildChatMessages, type ChatMessage } from "@/components/landing/demo-chat";
import { CheckIcon, PauseIcon, PlayIcon } from "@/components/landing/icons";
import { useDemoPlayback } from "@/components/landing/use-demo-playback";

const BAR_COUNT = 72;
const STICK_THRESHOLD_PX = 80;
const SEEK_STEPS = 1000;
const UNKNOWN_TIME = "–:––";

const BAR_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, index) => {
  const height = 18 + Math.abs(Math.sin(index * 0.9) * 50 + Math.sin(index * 0.37) * 30);
  return Math.round(Math.min(100, height) * 100) / 100;
});

type Speakers = ClientCopy["speakers"];

const formatClock = (seconds: number): string =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

function useStickToBottom(
  chatRef: RefObject<HTMLDivElement | null>,
  scenarioIndex: number,
  lastMessageId: string | undefined
): void {
  const isStuckRef = useRef(true);
  const scenarioRef = useRef(scenarioIndex);

  useEffect(() => {
    const chat = chatRef.current;
    if (!chat) return;
    const onScroll = (): void => {
      const distance = chat.scrollHeight - chat.scrollTop - chat.clientHeight;
      isStuckRef.current = distance <= STICK_THRESHOLD_PX;
    };
    chat.addEventListener("scroll", onScroll, { passive: true });
    return () => chat.removeEventListener("scroll", onScroll);
  }, [chatRef]);

  useLayoutEffect(() => {
    const chat = chatRef.current;
    if (!chat) return;
    if (scenarioRef.current !== scenarioIndex) {
      scenarioRef.current = scenarioIndex;
      isStuckRef.current = true;
    }
    if (isStuckRef.current) chat.scrollTop = chat.scrollHeight;
  }, [chatRef, scenarioIndex, lastMessageId]);
}

function ChatBubble({ message, speakers }: { message: ChatMessage; speakers: Speakers }) {
  const side = message.speaker === "agent" ? "a" : "c";
  if (message.typing) {
    return (
      <div className={cn("msg typing", side)}>
        <i />
        <i />
        <i />
      </div>
    );
  }
  return (
    <div className={cn("msg", side)}>
      <small>{speakers[message.speaker]}</small>
      {message.text}
    </div>
  );
}

export function DemoPlayer() {
  const { copy } = useLandingCopy();
  const text = copy.demoPlayer;
  const { index, playing, progress, duration, failed, toggle, select, seek } = useDemoPlayback();
  const chatRef = useRef<HTMLDivElement>(null);
  const scenario = DEMO_SCENARIOS[index];
  const scenarioText = text.scenarios[scenario.id];
  const currentTime = duration === null ? 0 : progress * duration;
  const messages = buildChatMessages({
    scenario,
    scenarioIndex: index,
    currentTime,
    playing,
  });
  const filledBars = Math.floor(progress * BAR_COUNT);
  const isDone = progress >= 1 && !playing;

  useStickToBottom(chatRef, index, messages.at(-1)?.id);

  return (
    <>
      <div className="demo-tabs" data-r="">
        {DEMO_SCENARIOS.map((item, tabIndex) => (
          <button
            key={item.id}
            type="button"
            className={cn("demo-tab", tabIndex === index && "on")}
            style={{ "--prog": tabIndex === index ? progress : 0 } as CSSProperties}
            aria-pressed={tabIndex === index}
            onClick={() => select(tabIndex)}
          >
            <span className="mono">0{tabIndex + 1}</span>
            <b className="t2">{text.scenarios[item.id].title}</b>
          </button>
        ))}
      </div>

      <div className="player" data-r="">
        <div className="player-top">
          <button
            type="button"
            className="play"
            aria-label={playing ? text.pause : text.play}
            onClick={toggle}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <div className="t">
            <b>{scenarioText.title}</b>
            <span className="mono">
              {scenarioText.tag} · {text.recording}
            </span>
          </div>
        </div>
        <div className="pwave">
          {BAR_HEIGHTS.map((height, barIndex) => (
            <i
              key={barIndex}
              className={barIndex < filledBars ? "p" : undefined}
              style={{ height: `${height}%` }}
            />
          ))}
          <input
            className="pseek"
            type="range"
            min={0}
            max={SEEK_STEPS}
            value={Math.round(progress * SEEK_STEPS)}
            disabled={duration === null}
            aria-label={text.seek}
            onChange={(event) => seek(Number(event.target.value) / SEEK_STEPS)}
          />
        </div>
        <div className="ptime mono">
          <span>{duration === null ? UNKNOWN_TIME : formatClock(currentTime)}</span>
          <span>{duration === null ? UNKNOWN_TIME : formatClock(duration)}</span>
        </div>
        {failed ? (
          <p className="player-error" role="alert">
            {text.failed}
          </p>
        ) : null}
        <div
          className="chat"
          ref={chatRef}
          role="region"
          aria-label={text.transcript}
          tabIndex={0}
          data-lenis-prevent=""
        >
          {messages.length === 0 ? (
            <p className="chat-hint">{text.hint}</p>
          ) : (
            messages.map((message) => (
              <ChatBubble key={message.id} message={message} speakers={copy.speakers} />
            ))
          )}
        </div>
        <div className={cn("result", isDone && "done")}>
          <span className="r">
            <i>
              <CheckIcon />
            </i>
            <span>
              {text.result}: {scenarioText.result}
            </span>
          </span>
          <span className="mono">→ CRM</span>
        </div>
      </div>
    </>
  );
}
