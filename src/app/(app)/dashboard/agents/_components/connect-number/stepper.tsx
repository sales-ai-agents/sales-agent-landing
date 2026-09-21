import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  current: number;
}

export const Stepper = ({ steps, current }: StepperProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((label, index) => {
        const isDone = index < current;
        const isActive = index === current;

        return (
          <div key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                isDone && "bg-primary text-primary-foreground",
                isActive && "bg-primary text-primary-foreground",
                !isDone && !isActive && "bg-muted text-muted-foreground"
              )}
            >
              {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </span>
            <span
              className={cn(
                "text-sm",
                isActive || isDone ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
