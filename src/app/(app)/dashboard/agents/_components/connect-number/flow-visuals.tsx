import { Check, Phone } from "lucide-react";

import { cn } from "@/lib/utils";

export const PhonePulse = ({ animated = false }: { animated?: boolean }) => {
  return (
    <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
      <span
        className={cn(
          "border-primary/30 absolute inset-0 rounded-full border-2",
          animated && "animate-ping"
        )}
      />
      <span className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
        <Phone className="text-primary h-7 w-7" />
      </span>
    </div>
  );
};

export const SuccessMark = () => {
  return (
    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/60">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600">
        <Check className="h-6 w-6 text-white" />
      </span>
    </div>
  );
};
