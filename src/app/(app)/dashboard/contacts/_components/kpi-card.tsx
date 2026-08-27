import React from "react";

interface ContactsKpiCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: string;
  subtitle: string;
}

export const KpiCard = ({ icon, iconBg, title, value, subtitle }: ContactsKpiCardProps) => {
  return (
    <div className="border-border bg-background flex items-center gap-4 rounded-2xl border p-5">
      <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-muted-foreground text-xs">{title}</p>
        <p className="my-1 text-2xl font-semibold">{value}</p>
        <p className="text-muted-foreground text-xs">{subtitle}</p>
      </div>
    </div>
  );
};
