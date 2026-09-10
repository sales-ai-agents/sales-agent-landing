import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { TOTAL_STEPS } from "./wizard";

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: TOTAL_STEPS }).map((_, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                isCompleted || isCurrent
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              )}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            {index < TOTAL_STEPS - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 w-10",
                  index < currentStep ? "bg-primary" : "bg-gray-400"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
