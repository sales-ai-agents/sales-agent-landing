"use client";

import { useEffect } from "react";
import { Onborda, OnbordaProvider, useOnborda } from "onborda";

import { OnboardingCard } from "./onboarding-card";
import { dashboardWelcomeSteps, TOUR_NAME } from "./onboarding-steps";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";

import type { Step } from "onborda";

interface Tour {
  tour: string;
  steps: Step[];
}

const tours: Tour[] = [
  {
    tour: TOUR_NAME,
    steps: dashboardWelcomeSteps,
  },
];

function OnboardingAutoStart() {
  const { startOnborda } = useOnborda();
  const { hasTourCompleted, startTour } = useOnboardingStore();

  useEffect(() => {
    if (hasTourCompleted(TOUR_NAME)) return;

    const timeout = setTimeout(() => {
      startTour();
      startOnborda(TOUR_NAME);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

export function OnboardingWrapper({ children }: OnboardingWrapperProps) {
  return (
    <OnbordaProvider>
      <Onborda
        steps={tours}
        showOnborda={true}
        shadowRgb="0,0,0"
        shadowOpacity="0.6"
        cardComponent={OnboardingCard}
        cardTransition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {children}
      </Onborda>
      <OnboardingAutoStart />
    </OnbordaProvider>
  );
}
