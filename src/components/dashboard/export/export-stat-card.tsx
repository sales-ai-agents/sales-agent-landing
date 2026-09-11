import type { ReactNode } from "react";

import { cn, formatNumber } from "@/lib/utils";

interface ExportStatCardProps {
  icon: ReactNode;
  iconBg: string;
  title: string;
  value: number;
}

export const ExportStatCard = ({ icon, iconBg, title, value }: ExportStatCardProps) => {
  return (
    <div className="border-border bg-background rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div
          className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", iconBg)}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-muted-foreground truncate text-xs">{title}</p>
          <p className="text-xl font-bold">{formatNumber(value)}</p>
        </div>
      </div>
    </div>
  );
};
