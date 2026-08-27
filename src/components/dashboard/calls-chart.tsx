"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { DayStats } from "@dashboard/types";

interface CallsChartProps {
  data?: DayStats[];
}

const DAY_LABELS = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

const formatDayLabel = (dateStr: string): string => {
  const d = new Date(dateStr);
  return DAY_LABELS[d.getUTCDay()];
};

export const CallsChart = ({ data }: CallsChartProps) => {
  const chartData = (data ?? []).map((item) => ({
    ...item,
    label: formatDayLabel(item.date),
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-56 w-full items-center justify-center">
        <p className="text-muted-foreground text-sm">Дані з&apos;являться після першого дзвінка</p>
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={true} className="stroke-border" />
          <XAxis
            dataKey="label"
            className="text-xs"
            tick={{ fontSize: 12, fill: "#868686" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            className="text-xs"
            tick={{ fontSize: 12, fill: "#868686" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            className="text-xs"
            tick={{ fontSize: 12, fill: "#868686" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #c0c0c0",
              borderRadius: "6px",
              fontSize: "12px",
            }}
            formatter={(value, name) => {
              const labels: Record<string, string> = {
                calls: "дзвінків",
                meetings: "досягнуто",
              };
              return [String(value), labels[String(name)] ?? String(name)];
            }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="calls"
            stroke="#005bff"
            strokeWidth={2}
            dot={false}
            name="calls"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="meetings"
            stroke="#2cb151"
            strokeWidth={2}
            dot={false}
            name="meetings"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
