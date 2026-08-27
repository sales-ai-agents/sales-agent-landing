import React from "react";

interface FilterFieldProps {
  label: string;
  children: React.ReactNode;
}

export function FilterField({ label, children }: FilterFieldProps) {
  return (
    <div className="border-border flex min-w-60 flex-col gap-1 rounded-lg border bg-white p-3">
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
      {children}
    </div>
  );
}
