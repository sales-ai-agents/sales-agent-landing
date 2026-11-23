import { cn } from "@/lib/utils";

const RADIUS = 15.9155;
const PERCENT = 100;

interface ProgressRingProps {
  percent: number;
  className?: string;
}

export const ProgressRing = ({ percent, className }: ProgressRingProps) => {
  const value = Math.max(0, Math.min(PERCENT, percent));
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" className={cn("size-14 -rotate-90", className)}>
      <circle
        cx="18"
        cy="18"
        r={RADIUS}
        fill="none"
        strokeWidth="4"
        className="stroke-primary/15"
      />
      <circle
        cx="18"
        cy="18"
        r={RADIUS}
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength={PERCENT}
        strokeDasharray={`${value} ${PERCENT}`}
        className="stroke-primary"
      />
    </svg>
  );
};
