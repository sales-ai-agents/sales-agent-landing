import { Check, Phone } from "lucide-react";

import { cn } from "@/lib/utils";

interface PhonePulseProps {
  animated?: boolean;
  tone?: "active" | "idle";
}

export const PhonePulse = ({ animated = false, tone = "active" }: PhonePulseProps) => {
  const isIdle = tone === "idle";

  return (
    <div className="relative mx-auto my-14 flex h-14 w-14 items-center justify-center">
      {animated && !isIdle && (
        <span className="border-primary/40 absolute inset-0 animate-ping rounded-full border" />
      )}
      <span
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-full",
          isIdle ? "bg-muted" : "bg-primary/10"
        )}
      >
        <Phone className={cn("h-6 w-6", isIdle ? "text-muted-foreground" : "text-primary")} />
      </span>
    </div>
  );
};

export const SuccessMark = () => {
  return (
    <div className="bg-success/15 mx-auto my-14 flex h-24 w-24 items-center justify-center rounded-full">
      <span className="bg-success flex h-12 w-12 items-center justify-center rounded-full">
        <Check className="text-primary-foreground h-6 w-6" />
      </span>
    </div>
  );
};
