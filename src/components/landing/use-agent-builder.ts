"use client";

import { useState } from "react";
import type { Preset, WebAgentSession } from "@/components/landing/api/types";
import { useWebAgent } from "@/components/landing/api/use-web-agent";
import { BUILDER_PRESETS } from "@/components/landing/presets";
import { useLandingPresets } from "@/components/landing/use-landing-presets";
import { trackEvent } from "@/lib/analytics";

export type Voice = "female" | "male";

const DEFAULT_NAMES: Record<Voice, string> = { female: "Марія", male: "Олександр" };

const VOICE_API_VALUES: Record<Voice, string> = { female: "жіночий", male: "чоловічий" };

interface AgentBuilder {
  name: string;
  voice: Voice;
  presets: readonly Preset[];
  selectedPreset: Preset;
  prompt: string;
  canStart: boolean;
  isStarting: boolean;
  session: WebAgentSession | null;
  errorMessage: string | null;
  changeName: (value: string) => void;
  selectVoice: (voice: Voice) => void;
  selectPreset: (presetId: string) => void;
  changePrompt: (value: string) => void;
  start: () => void;
}

export function useAgentBuilder(loadPresets: boolean): AgentBuilder {
  const apiPresets = useLandingPresets(loadPresets);
  const { startAgent, isLoading, session, errorMessage, reset } = useWebAgent();
  const [name, setName] = useState(DEFAULT_NAMES.female);
  const [voice, setVoice] = useState<Voice>("female");
  const [selectedId, setSelectedId] = useState(BUILDER_PRESETS[0].id);
  const [editedPrompt, setEditedPrompt] = useState<string | null>(null);

  const hasApiPresets = apiPresets.length > 0;
  const presets: readonly Preset[] = hasApiPresets ? apiPresets : BUILDER_PRESETS;
  const selectedPreset = presets.find((preset) => preset.id === selectedId) ?? presets[0];
  const prompt = editedPrompt ?? selectedPreset.prompt;
  const canStart = name.trim().length > 0 && prompt.trim().length > 0;

  const changeName = (value: string): void => {
    setName(value);
    reset();
  };

  const selectVoice = (next: Voice): void => {
    const previousDefault = DEFAULT_NAMES[voice];
    setVoice(next);
    if (name === previousDefault) setName(DEFAULT_NAMES[next]);
    reset();
  };

  const selectPreset = (presetId: string): void => {
    setSelectedId(presetId);
    setEditedPrompt(null);
    reset();
  };

  const changePrompt = (value: string): void => {
    setEditedPrompt(value);
    reset();
  };

  const start = (): void => {
    if (!canStart) return;
    trackEvent("test_call_start", { location: "landing_builder" });
    startAgent({
      instruction: prompt,
      voice: VOICE_API_VALUES[voice],
      agent_name: name,
      ...(hasApiPresets && editedPrompt === null ? { preset: selectedPreset.id } : {}),
    });
  };

  return {
    name,
    voice,
    presets,
    selectedPreset,
    prompt,
    canStart,
    isStarting: isLoading,
    session,
    errorMessage,
    changeName,
    selectVoice,
    selectPreset,
    changePrompt,
    start,
  };
}
