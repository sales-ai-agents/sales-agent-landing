import { cn } from "@/lib/utils";
import type { DayStats } from "@dashboard/types";
const WEEK_LENGTH = 7;
const PERCENT = 100;
const MIN_BAR_PERCENT = 6;
export const WeekBars = ({ days }: { days: DayStats[] }) => {
  const recent = days.slice(-WEEK_LENGTH);
  const max = Math.max(1, ...recent.map((day) => day.calls));
  const peakIndex = recent.findIndex((day) => day.calls === max);
  return (
    <span aria-hidden="true" className="flex h-10 items-end gap-1.5">
      {recent.map((day, index) => (
        <i
          key={day.date}
          className={cn(
            "flex-1 rounded-sm",
            index === peakIndex && max > 1 ? "bg-primary" : "bg-primary/20"
          )}
          style={{
            height: `${day.calls === 0 ? MIN_BAR_PERCENT : Math.round((day.calls / max) * PERCENT)}%`,
          }}
        />
      ))}
    </span>
  );
};
