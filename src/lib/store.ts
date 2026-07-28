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
