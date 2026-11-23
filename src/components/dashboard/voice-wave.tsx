import { cn } from "@/lib/utils";

const WAVE_HEIGHTS = [
  0.45, 0.7, 0.55, 0.9, 0.6, 1, 0.75, 0.5, 0.85, 0.65, 0.95, 0.55, 0.8, 0.6, 0.9, 0.5, 0.7, 1, 0.6,
  0.8, 0.55, 0.9, 0.65, 0.75, 0.5, 0.85, 0.6, 0.95, 0.7, 0.55, 0.8, 0.65,
] as const;
const DEFAULT_BARS = 32;
const PERCENT = 100;

interface VoiceWaveProps {
  fraction: number;
  bars?: number;
  className?: string;
}

export const VoiceWave = ({ fraction, bars = DEFAULT_BARS, className }: VoiceWaveProps) => {
  const filled = Math.round(Math.max(0, Math.min(1, fraction)) * bars);
  return (
    <span aria-hidden="true" className={cn("flex h-8 items-center gap-0.5", className)}>
      {Array.from({ length: bars }, (_, index) => (
        <i
          key={index}
          className={cn(
            "w-0.5 flex-1 rounded-full",
            index < filled ? "bg-primary" : "bg-primary/20"
          )}
          style={{ height: `${Math.round(WAVE_HEIGHTS[index % WAVE_HEIGHTS.length] * PERCENT)}%` }}
        />
      ))}
    </span>
  );
};
