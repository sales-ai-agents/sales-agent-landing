import { Fragment } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => (
  <div className="flex items-center gap-2" aria-hidden="true">
    {Array.from({ length: totalSteps }).map((_, index) => {
      const isDone = index < currentStep;
      const isCurrent = index === currentStep;
      return (
        <Fragment key={index}>
          {index > 0 && (
            <span
              className={cn(
                "h-0.5 w-6 rounded-full",
                isDone || isCurrent ? "bg-primary" : "bg-border"
              )}
            />
          )}
          <span
            className={cn(
              "grid size-8 place-items-center rounded-full border text-sm font-medium",
              isCurrent && "border-primary bg-primary text-primary-foreground",
              isDone && "border-primary bg-primary text-primary-foreground",
              !isDone && !isCurrent && "border-border bg-card text-muted-foreground"
            )}
          >
            {isDone ? <Check className="size-4" /> : index + 1}
          </span>
        </Fragment>
      );
    })}
  </div>
);
