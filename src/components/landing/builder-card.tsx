"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BUILDER_PRESETS } from "@/components/landing/presets";
import { Arrow } from "@/components/landing/typography";

type Voice = "female" | "male";

const DEFAULT_NAMES: Record<Voice, string> = { female: "Марія", male: "Олександр" };

const VOICE_OPTIONS: readonly { value: Voice; label: string }[] = [
  { value: "female", label: "Жіночий" },
  { value: "male", label: "Чоловічий" },
];

export function BuilderCard() {
  const [voice, setVoice] = useState<Voice>("female");
  const [name, setName] = useState(DEFAULT_NAMES.female);
  const [presetIndex, setPresetIndex] = useState(0);
  const [prompt, setPrompt] = useState(BUILDER_PRESETS[0].prompt);

  const selectVoice = (next: Voice): void => {
    setVoice(next);
    const other: Voice = next === "male" ? "female" : "male";
    if (name === DEFAULT_NAMES[other]) setName(DEFAULT_NAMES[next]);
  };

  const selectPreset = (index: number): void => {
    setPresetIndex(index);
    setPrompt(BUILDER_PRESETS[index].prompt);
  };

  return (
    <div className="bcard" data-r="">
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
          value={name}
          maxLength={40}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className="field">
        <span className="mono">Голос</span>
        <div className="seg" id="voiceSeg" role="group" aria-label="Голос">
          {VOICE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(voice === option.value && "on")}
              aria-pressed={voice === option.value}
              onClick={() => selectVoice(option.value)}
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
          value={prompt}
          data-lenis-prevent=""
          onChange={(event) => setPrompt(event.target.value)}
        />
        <div className="scn" id="scnSeg" role="group" aria-label="Сценарій">
          {BUILDER_PRESETS.map((preset, index) => (
            <button
              key={preset.id}
              type="button"
              className={cn(index === presetIndex && "on")}
              aria-pressed={index === presetIndex}
              onClick={() => selectPreset(index)}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <p className="scn-desc" id="scnDesc">
          {BUILDER_PRESETS[presetIndex].description}
        </p>
      </div>
      <a className="btn btn-blue" href="#top" data-focus-phone="">
        Перевірити дзвінок <Arrow />
      </a>
    </div>
  );
}
