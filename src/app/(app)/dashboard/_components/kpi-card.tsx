import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export interface KpiCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: string;
  subtitle: string;
  delta: number | null;
  periodLabel: string;
}

export const KpiCard = ({
  icon,
  iconBg,
  title,
  value,
  subtitle,
  delta,
  periodLabel,
}: KpiCardProps) => {
  return (
    <div className="border-primary/35 rounded-xl border bg-white p-5">
      <div className="flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
          {icon}
        </div>
        <p className="text-xs font-medium tracking-wide uppercase">{title}</p>
      </div>
      <p className="mt-4 text-4xl font-semibold">{value}</p>
      <p className="text-muted-foreground mt-2 text-xs">{subtitle}</p>
      {periodLabel && (
        <div className="mt-2">
          <DeltaBadge value={delta} />
          <p className="text-muted-foreground text-xs">{periodLabel}</p>
        </div>
      )}
    </div>
  );
};

const DeltaBadge = ({ value }: { value: number | null }) => {
  if (value === null) {
    return <span className="text-muted-foreground text-sm">—</span>;
  }

  const isPositive = value >= 0;

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-sm font-medium ${
        isPositive ? "text-green-600" : "text-red-500"
      }`}
    >
      {isPositive ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
      {Math.abs(value)}%
    </span>
  );
};
