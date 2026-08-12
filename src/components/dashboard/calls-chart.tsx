"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { chartData } from "@/lib/mock-data";

export function CallsChart() {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={[...chartData]} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#005bff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#005bff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="day" className="text-xs" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="calls"
            stroke="#005bff"
            fillOpacity={1}
            fill="url(#colorCalls)"
            name="Total Calls"
          />
          <Area
            type="monotone"
            dataKey="successful"
            stroke="hsl(142, 71%, 45%)"
            fillOpacity={1}
            fill="url(#colorSuccess)"
            name="Successful"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
