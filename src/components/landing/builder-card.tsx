"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { Arrow } from "@/components/landing/typography";
import { useAgentBuilder, type Voice } from "@/components/landing/use-agent-builder";
import { useNearViewport } from "@/components/landing/use-near-viewport";

const LiveCallPanel = dynamic(
  () => import("@/components/landing/live-call-panel").then((module) => module.LiveCallPanel),
  { ssr: false }
);

const VOICE_OPTIONS: readonly { value: Voice; label: string }[] = [
  { value: "female", label: "Жіночий" },
  { value: "male", label: "Чоловічий" },
];

const AGENT_NAME_MAX_LENGTH = 40;

export function BuilderCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const builder = useAgentBuilder(useNearViewport(cardRef));

  return (
    <div className="bcard" data-r="" ref={cardRef}>
      <div className="bcard-top">
        <b>Налаштування агента</b>
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="field">
        <label className="mono" htmlFor="agentName">
          Імʼя агента
        </label>
        <input
          id="agentName"
          value={builder.name}
          maxLength={AGENT_NAME_MAX_LENGTH}
          onChange={(event) => builder.changeName(event.target.value)}
        />
      </div>
      <div className="field">
        <span className="mono">Голос</span>
        <div className="seg" role="group" aria-label="Голос">
          {VOICE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(builder.voice === option.value && "on")}
              aria-pressed={builder.voice === option.value}
              onClick={() => builder.selectVoice(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="field">
        <label className="mono" htmlFor="agentPrompt">
          Вибрати сценарій
        </label>
        <textarea
          id="agentPrompt"
          rows={7}
          placeholder="Опишіть, що має робити агент під час дзвінка…"
          value={builder.prompt}
          data-lenis-prevent=""
          onChange={(event) => builder.changePrompt(event.target.value)}
        />
        <div className="scn" role="group" aria-label="Сценарій">
          {builder.presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={cn(preset.id === builder.selectedPreset.id && "on")}
              aria-pressed={preset.id === builder.selectedPreset.id}
              onClick={() => builder.selectPreset(preset.id)}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <p className="scn-desc">{builder.selectedPreset.description}</p>
      </div>
      {builder.session ? (
        <LiveCallPanel session={builder.session} agentName={builder.name} />
      ) : (
        <>
          <p className={cn("form-msg", builder.errorMessage && "err")} role="alert">
            {builder.errorMessage}
          </p>
          <button
            className="btn btn-blue"
            type="button"
            disabled={builder.isStarting || !builder.canStart}
            onClick={builder.start}
          >
            {builder.isStarting ? "Запускаємо…" : "Перевірити дзвінок"} <Arrow />
          </button>
        </>
      )}
    </div>
  );
}
