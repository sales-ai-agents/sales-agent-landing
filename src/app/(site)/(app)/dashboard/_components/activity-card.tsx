"use client";
import { useState } from "react";
import {
  CallsChart,
  CHART_SERIES,
  SectionCard,
  type ChartSeries,
  type ChartSeriesVisibility,
} from "@/components/dashboard";
import { cn } from "@/lib/utils";
import type { DayStats } from "@dashboard/types";
interface ActivityCardProps {
  data: DayStats[];
}
const ALL_VISIBLE: ChartSeriesVisibility = { calls: true, goal: true, saved: true };
const SERIES_META: Record<ChartSeries, { label: string; swatch: string }> = {
  calls: { label: "Усі дзвінки", swatch: "bg-primary/30" },
  goal: { label: "Досягнуто цілі", swatch: "bg-primary" },
  saved: { label: "Заощаджений час", swatch: "bg-warning" },
};
export const ActivityCard = ({ data }: ActivityCardProps) => {
  const [visibility, setVisibility] = useState<ChartSeriesVisibility>(ALL_VISIBLE);
  const toggleSeries = (series: ChartSeries): void => {
    setVisibility((current) => ({ ...current, [series]: !current[series] }));
  };
  const legend = (
    <div className="flex flex-wrap items-center gap-3">
      {CHART_SERIES.map((series) => (
        <button
          key={series}
          type="button"
          aria-pressed={visibility[series]}
          onClick={() => toggleSeries(series)}
          className="text-muted-foreground aria-pressed:text-foreground flex items-center gap-2 text-sm transition-colors"
        >
          <i
            className={cn(
              "size-2.5 rounded-full",
              SERIES_META[series].swatch,
              !visibility[series] && "opacity-30"
            )}
          />
          {SERIES_META[series].label}
        </button>
      ))}
    </div>
  );
  return (
    <SectionCard title="Активність дзвінків" action={legend}>
      <div className="caption text-muted-foreground flex justify-between">
        <span>Дзвінки</span>
        <span className="text-warning">Год/день</span>
      </div>
      <CallsChart data={data} visibility={visibility} />
    </SectionCard>
  );
};
