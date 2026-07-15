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

const data = [
  { day: "Mon", calls: 45, successful: 42 },
  { day: "Tue", calls: 52, successful: 48 },
  { day: "Wed", calls: 38, successful: 35 },
  { day: "Thu", calls: 65, successful: 60 },
  { day: "Fri", calls: 58, successful: 53 },
  { day: "Sat", calls: 22, successful: 20 },
  { day: "Sun", calls: 15, successful: 14 },
];

export function CallsChart() {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(221.2, 83.2%, 53.3%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(221.2, 83.2%, 53.3%)" stopOpacity={0} />
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
              backgroundColor: "hsl(0, 0%, 100%)",
              border: "1px solid hsl(214.3, 31.8%, 91.4%)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="calls"
            stroke="hsl(221.2, 83.2%, 53.3%)"
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
