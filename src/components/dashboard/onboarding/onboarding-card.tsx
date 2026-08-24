"use client";

import Image from "next/image";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useOnborda } from "onborda";
import type { CardComponentProps } from "onborda";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";

export function OnboardingCard({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
}: CardComponentProps) {
  const { closeOnborda } = useOnborda();
  const { skipTour, completeTour } = useOnboardingStore();
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  function handleSkip(): void {
    skipTour("dashboard-welcome");
    closeOnborda();
  }

  function handleNext(): void {
    if (isLastStep) {
      completeTour("dashboard-welcome");
      closeOnborda();
      return;
    }
    nextStep();
  }

  return (
    <div className="relative flex items-end gap-0">
      <motion.div
        className="pointer-events-none relative z-10 -mr-2 shrink-0"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/image/onboarding-agent.png"
          alt="AI-агент помічник"
          width={100}
          height={100}
          className="h-40 w-auto drop-shadow-lg"
          priority
        />
      </motion.div>

      <div className="relative w-200 max-w-100 rounded-2xl border bg-white p-5 shadow-xl">
        <button
          onClick={handleSkip}
          className="text-muted-foreground hover:text-foreground absolute top-3 right-3 rounded-md p-1 transition-colors"
          aria-label="Пропустити тур"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-3 flex items-center gap-2 pr-6">
          {step.icon && <span className="text-lg">{step.icon}</span>}
          <h3 className="font-display text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {step.title}
          </h3>
        </div>

        <div className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {step.content}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 rounded-full transition-all",
                  index === currentStep ? "bg-primary w-4" : "w-2 bg-zinc-200 dark:bg-zinc-700"
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <Button variant="ghost" size="sm" onClick={prevStep}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                Назад
              </Button>
            )}
            <Button size="sm" onClick={handleNext}>
              {isLastStep ? "Готово" : "Далі"}
              {!isLastStep && <ArrowRight className="ml-1 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
