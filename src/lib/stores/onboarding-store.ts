"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  completedTours: string[];
  skippedTours: string[];
  isTourActive: boolean;
  completeTour: (tourName: string) => void;
  skipTour: (tourName: string) => void;
  startTour: () => void;
  endTour: () => void;
  hasTourCompleted: (tourName: string) => boolean;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      completedTours: [],
      skippedTours: [],
      isTourActive: false,

      completeTour: (tourName: string) => {
        set((state) => ({
          completedTours: [...new Set([...state.completedTours, tourName])],
          isTourActive: false,
        }));
      },

      skipTour: (tourName: string) => {
        set((state) => ({
          skippedTours: [...new Set([...state.skippedTours, tourName])],
          isTourActive: false,
        }));
      },

      startTour: () => {
        set({ isTourActive: true });
      },

      endTour: () => {
        set({ isTourActive: false });
      },

      hasTourCompleted: (tourName: string) => {
        const state = get();
        return state.completedTours.includes(tourName) || state.skippedTours.includes(tourName);
      },

      resetOnboarding: () => {
        set({ completedTours: [], skippedTours: [], isTourActive: false });
      },
    }),
    {
      name: "calls4u-onboarding",
    }
  )
);
