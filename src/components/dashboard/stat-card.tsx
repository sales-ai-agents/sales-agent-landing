import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: ReactNode;
  subtitle?: ReactNode;
  tone?: "primary" | "warning";
  delta?: number | null;
  deltaLabel?: string;
  corner?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const ICON_TONES = {
  primary: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning",
} as const;

const Delta = ({ value, label }: { value: number; label?: string }) => (
  <span className={cn("text-sm font-medium", value >= 0 ? "text-success" : "text-destructive")}>
    {value >= 0 ? "▲" : "▼"} {Math.abs(value)}%
    {label && <span className="text-muted-foreground ml-1 font-normal">{label}</span>}
  </span>
);

export const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  tone = "primary",
  delta,
  deltaLabel,
  corner,
  footer,
  className,
}: StatCardProps) => (
  <Card className={cn("relative flex flex-col gap-2 p-6", className)}>
    <div className="flex items-center gap-3">
      <span className={cn("grid size-10 place-items-center rounded-full", ICON_TONES[tone])}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="caption text-muted-foreground">{title}</span>
    </div>
    {corner && <div className="absolute top-5 right-5">{corner}</div>}
    <div className="font-heading [&_small]:text-muted-foreground text-4xl tabular-nums [&_small]:text-base">
      {value}
    </div>
    {subtitle && <span className="text-muted-foreground text-sm">{subtitle}</span>}
    {delta !== undefined &&
      (delta === null ? (
        <span className="text-muted-foreground text-sm">—</span>
      ) : (
        <Delta value={delta} label={deltaLabel} />
      ))}
    {footer}
  </Card>
);
