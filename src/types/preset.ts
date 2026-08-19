export interface Preset {
  id: string;
  label: string;
  description: string;
  prompt: string;
}

export interface PresetsResponse {
  ok: boolean;
  presets: Preset[];
}
