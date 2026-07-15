import { create } from "zustand";

// --- Agent Wizard Store ---
interface WizardState {
  step: number;
  name: string;
  voice: string;
  instructions: string;
  testPhone: string;
  setStep: (step: number) => void;
  setName: (name: string) => void;
  setVoice: (voice: string) => void;
  setInstructions: (instructions: string) => void;
  setTestPhone: (testPhone: string) => void;
  reset: () => void;
}

const WIZARD_INITIAL_STATE = {
  step: 0,
  name: "",
  voice: "",
  instructions: "",
  testPhone: "",
};

export const useWizardStore = create<WizardState>((set) => ({
  ...WIZARD_INITIAL_STATE,
  setStep: (step) => set({ step }),
  setName: (name) => set({ name }),
  setVoice: (voice) => set({ voice }),
  setInstructions: (instructions) => set({ instructions }),
  setTestPhone: (testPhone) => set({ testPhone }),
  reset: () => set(WIZARD_INITIAL_STATE),
}));

// --- Audio Player Store ---
interface AudioState {
  currentTrackId: string | null;
  isPlaying: boolean;
  progress: number;
  setTrack: (id: string | null) => void;
  setPlaying: (playing: boolean) => void;
  setProgress: (progress: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentTrackId: null,
  isPlaying: false,
  progress: 0,
  setTrack: (currentTrackId) => set({ currentTrackId, progress: 0 }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setProgress: (progress) => set({ progress }),
}));
