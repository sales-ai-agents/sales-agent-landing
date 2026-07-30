import { useState, useCallback, useMemo } from "react";

import type { Preset } from "@/hooks/use-presets";

const VOICE_OPTIONS = ["Жіночий", "Чоловічий"] as const;
type VoiceOption = (typeof VOICE_OPTIONS)[number];

const VOICE_API_MAP: Record<VoiceOption, string> = {
  Жіночий: "жіночий",
  Чоловічий: "чоловічий",
};

export { VOICE_OPTIONS, type VoiceOption };

export function useBuilderForm(presets: Preset[]) {
  const [name, setName] = useState("Марія");
  const [voice, setVoice] = useState<VoiceOption>("Жіночий");
  const [instruction, setInstruction] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const activePreset = useMemo(
    () => presets.find((p) => p.id === selectedPresetId) ?? null,
    [presets, selectedPresetId]
  );

  if (presets.length > 0 && !selectedPresetId && instruction === "") {
    setSelectedPresetId(presets[0].id);
    setInstruction(presets[0].prompt);
  }

  const selectPreset = useCallback((preset: Preset) => {
    setSelectedPresetId(preset.id);
    setInstruction(preset.prompt);
  }, []);

  const updateInstruction = useCallback(
    (value: string) => {
      setInstruction(value);
      if (activePreset && value !== activePreset.prompt) {
        setSelectedPresetId(null);
      }
    },
    [activePreset]
  );

  const isValid = name.trim().length > 0 && instruction.trim().length > 0;

  return {
    name,
    setName,
    voice,
    setVoice,
    instruction,
    updateInstruction,
    activePreset,
    selectPreset,
    isValid,
    voiceApiValue: VOICE_API_MAP[voice],
  };
}
