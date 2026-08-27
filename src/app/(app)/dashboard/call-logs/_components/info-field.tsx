import React from "react";

interface InfoFieldProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export const InfoField = ({ label, value, icon }: InfoFieldProps) => {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <div className="mt-1 flex items-center gap-1.5">
        {icon}
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
};
