import { cn } from "@/lib/utils";
import { CALL_RESULT_VISUALS } from "@dashboard/call-result";
import type { CallResultType } from "@dashboard/types";

interface CallResultIconProps {
  type: CallResultType;
  className?: string;
}

export const CallResultIcon = ({ type, className }: CallResultIconProps) => {
  const { icon: Icon, className: toneClassName } = CALL_RESULT_VISUALS[type];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
        toneClassName,
        className
      )}
    >
      <Icon className="h-4 w-4" />
    </span>
  );
};
