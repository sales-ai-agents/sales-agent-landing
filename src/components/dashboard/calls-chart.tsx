"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { DayStats } from "@dashboard/types";

export const CHART_SERIES = ["calls", "goal", "saved"] as const;
export type ChartSeries = (typeof CHART_SERIES)[number];
export type ChartSeriesVisibility = Record<ChartSeries, boolean>;

interface CallsChartProps {
  data?: DayStats[];
  visibility: ChartSeriesVisibility;
}

const HEIGHT = 240;
const PAD = { left: 34, right: 34, top: 16, bottom: 28 };
const DEFAULT_WIDTH = 680;
const MIN_WIDTH = 320;
const WEEK_LENGTH = 7;
const MINUTES_PER_HOUR = 60;
const PERCENT = 100;
const WEEKDAYS = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

const formatLabel = (date: string, isWeek: boolean): string => {
  const parsed = new Date(date);
  if (isWeek) return WEEKDAYS[parsed.getUTCDay()];
  const day = String(parsed.getUTCDate()).padStart(2, "0");
  const month = String(parsed.getUTCMonth() + 1).padStart(2, "0");
  return `${day}.${month}`;
};

const smoothPath = (points: [number, number][]): string =>
  points.reduce((path, [x, y], index) => {
    if (index === 0) return `M${x} ${y}`;
    const [prevX, prevY] = points[index - 1];
    const midX = (prevX + x) / 2;
    return `${path} C${midX} ${prevY} ${midX} ${y} ${x} ${y}`;
  }, "");

export const CallsChart = ({ data, visibility }: CallsChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [hovered, setHovered] = useState(-1);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.max(MIN_WIDTH, Math.round(entry.contentRect.width)))
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const days = data ?? [];
  if (days.length === 0) {
    return (
      <div ref={containerRef} className="py-14 text-center">
        <p className="text-muted-foreground">Дані з&apos;являться після першого дзвінка</p>
      </div>
    );
  }
  const isWeek = days.length <= WEEK_LENGTH;
  const labels = days.map((day) => formatLabel(day.date, isWeek));
  const calls = days.map((day) => day.calls);
  const goals = days.map((day) => day.meetings);
  const saved = days.map((day) => (day.talk_minutes ?? 0) / MINUTES_PER_HOUR);
  const innerWidth = width - PAD.left - PAD.right;
  const innerHeight = HEIGHT - PAD.top - PAD.bottom;
  const maxCalls = Math.max(10, ...calls) * 1.15;
  const maxSaved = Math.max(1, ...saved) * 1.25;
  const step = innerWidth / days.length;
  const barWidth = Math.min(40, step * 0.42);
  const yCalls = (value: number) => PAD.top + innerHeight * (1 - value / maxCalls);
  const ySaved = (value: number) => PAD.top + innerHeight * (1 - value / maxSaved);
  const centerX = (index: number) => PAD.left + step * index + step / 2;
  const baseline = PAD.top + innerHeight;
  const hoverX = hovered >= 0 ? centerX(hovered) : 0;
  const tooltipLeft = (hoverX / width) * PERCENT;
  const tooltipTop = hovered >= 0 ? (yCalls(calls[hovered]) / HEIGHT) * PERCENT : 0;
  return (
    <div ref={containerRef} className="relative" onMouseLeave={() => setHovered(-1)}>
      <svg
        className="[&_text]:fill-muted-foreground block w-full [&_text]:text-[11px]"
        viewBox={`0 0 ${width} ${HEIGHT}`}
        role="img"
        aria-label="Активність дзвінків"
      >
        <defs>
          <linearGradient id="chart-calls" x1="0" y1="0" x2="0" y2="1" className="text-primary">
            <stop offset="0" stopColor="currentColor" stopOpacity=".25" />
            <stop offset="1" stopColor="currentColor" stopOpacity=".08" />
          </linearGradient>
          <linearGradient id="chart-goal" x1="0" y1="0" x2="0" y2="1" className="text-primary">
            <stop offset="0" stopColor="currentColor" stopOpacity=".8" />
            <stop offset="1" stopColor="currentColor" />
          </linearGradient>
        </defs>
        {hovered >= 0 && (
          <line
            x1={hoverX}
            x2={hoverX}
            y1={PAD.top}
            y2={baseline}
            className="stroke-primary/30"
            strokeDasharray="3 4"
          />
        )}
        {[0, 0.5, 1].map((fraction) => {
          const y = PAD.top + innerHeight * (1 - fraction);
          return (
            <g key={fraction}>
              <line
                x1={PAD.left}
                x2={width - PAD.right}
                y1={y}
                y2={y}
                className="stroke-border"
                strokeDasharray={fraction ? "3 5" : "0"}
              />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end">
                {Math.round(maxCalls * fraction)}
              </text>
              <text className="fill-warning!" x={width - PAD.right + 8} y={y + 4}>
                {(maxSaved * fraction).toFixed(0)}
              </text>
            </g>
          );
        })}
        {labels.map((label, index) => {
          const x = centerX(index) - barWidth / 2;
          return (
            <g key={`${label}-${index}`}>
              {visibility.calls && (
                <rect
                  x={x}
                  y={yCalls(calls[index])}
                  width={barWidth}
                  height={Math.max(0, baseline - yCalls(calls[index]))}
                  rx={barWidth / 2}
                  fill="url(#chart-calls)"
                />
              )}
              {visibility.goal && (
                <rect
                  x={x + 4}
                  y={yCalls(goals[index])}
                  width={barWidth - 8}
                  height={Math.max(0, baseline - yCalls(goals[index]))}
                  rx={(barWidth - 8) / 2}
                  fill="url(#chart-goal)"
                  opacity={index === hovered ? 1 : 0.9}
                />
              )}
              <text
                x={centerX(index)}
                y={HEIGHT - 8}
                textAnchor="middle"
                className={index === hovered ? "fill-foreground! font-semibold" : undefined}
              >
                {label}
              </text>
              <rect
                x={PAD.left + step * index}
                y={PAD.top}
                width={step}
                height={innerHeight}
                className="cursor-pointer fill-transparent"
                onMouseEnter={() => setHovered(index)}
              />
            </g>
          );
        })}
        {visibility.saved && (
          <>
            <path
              d={smoothPath(saved.map((value, index) => [centerX(index), ySaved(value)]))}
              fill="none"
              className="stroke-warning"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {saved.map((value, index) => (
              <circle
                key={index}
                cx={centerX(index)}
                cy={ySaved(value)}
                r={index === hovered ? 5 : 3.5}
                className="fill-card stroke-warning"
                strokeWidth="2.2"
                pointerEvents="none"
              />
            ))}
          </>
        )}
      </svg>
      {hovered >= 0 && (
        <div
          className="bg-foreground text-background pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-2xl px-3 py-2 text-xs shadow-lg"
          style={{ left: `${tooltipLeft}%`, top: `calc(${tooltipTop}% - 10px)` }}
        >
          <b className="mb-1 block">{labels[hovered]}</b>
          <TipRow dotClassName="bg-primary/30" text={`${calls[hovered]} дзвінків`} />
          <TipRow dotClassName="bg-primary" text={`${goals[hovered]} досягнуто`} />
          <TipRow dotClassName="bg-warning" text={`${saved[hovered].toFixed(1)} год/день`} />
        </div>
      )}
    </div>
  );
};

const TipRow = ({ dotClassName, text }: { dotClassName: string; text: string }) => (
  <div className="flex items-center gap-1.5 whitespace-nowrap">
    <i className={cn("size-2 rounded-full", dotClassName)} />
    {text}
  </div>
);
