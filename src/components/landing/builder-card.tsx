"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useLandingCopy } from "@/components/landing/copy/provider";
import { Arrow } from "@/components/landing/typography";
import { useAgentBuilder, type Voice } from "@/components/landing/use-agent-builder";
import { useNearViewport } from "@/components/landing/use-near-viewport";

const LiveCallPanel = dynamic(
  () => import("@/components/landing/live-call-panel").then((module) => module.LiveCallPanel),
  { ssr: false }
);

const VOICES: readonly Voice[] = ["female", "male"];

const AGENT_NAME_MAX_LENGTH = 40;

export function BuilderCard() {
  const { copy } = useLandingCopy();
  const card = copy.builderCard;
  const cardRef = useRef<HTMLDivElement>(null);
  const builder = useAgentBuilder(useNearViewport(cardRef));

  return (
    <div className="bcard" data-r="" ref={cardRef}>
      <div className="bcard-top">
        <b>{card.title}</b>
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="field">
        <label className="mono" htmlFor="agentName">
          {card.nameLabel}
        </label>
        <input
          id="agentName"
          value={builder.name}
          maxLength={AGENT_NAME_MAX_LENGTH}
          onChange={(event) => builder.changeName(event.target.value)}
        />
      </div>
      <div className="field">
        <span className="mono">{card.voiceLabel}</span>
        <div className="seg" role="group" aria-label={card.voiceLabel}>
          {VOICES.map((voice) => (
            <button
              key={voice}
              type="button"
              className={cn(builder.voice === voice && "on")}
              aria-pressed={builder.voice === voice}
              onClick={() => builder.selectVoice(voice)}
            >
              {card.voices[voice]}
            </button>
          ))}
        </div>
      </div>
      <div className="field">
        <label className="mono" htmlFor="agentPrompt">
          {card.scenarioLabel}
        </label>
        <textarea
          id="agentPrompt"
          rows={7}
          placeholder={card.promptPlaceholder}
          value={builder.prompt}
          data-lenis-prevent=""
          onChange={(event) => builder.changePrompt(event.target.value)}
        />
        <div className="scn" role="group" aria-label={card.scenarioGroup}>
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
            {builder.isStarting ? card.starting : card.start} <Arrow />
          </button>
        </>
      )}
    </div>
  );
}
