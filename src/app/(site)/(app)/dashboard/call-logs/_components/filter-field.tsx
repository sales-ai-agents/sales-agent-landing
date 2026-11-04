import React from "react";

interface FilterFieldProps {
  label: string;
  children: React.ReactNode;
}

export const FilterField = ({ label, children }: FilterFieldProps) => {
  return (
    <div className="border-border bg-card flex w-full flex-col gap-1 rounded-lg border p-3 sm:w-auto sm:min-w-60">
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
      {children}
    </div>
  );
};
