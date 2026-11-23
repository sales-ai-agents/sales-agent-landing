import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/utils";
interface SettingsSectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  destructive?: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
}
export const SettingsSection = ({
  title,
  description,
  action,
  destructive = false,
  id,
  className,
  children,
}: SettingsSectionProps) => (
  <Card id={id} className={cn("gap-4", destructive && "ring-destructive/30", className)}>
    <CardHeader className="flex-row flex-wrap items-start justify-between gap-3">
      <div className="flex flex-col gap-1.5">
        <CardTitle className={cn(destructive && "text-destructive")}>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </div>
      {action}
    </CardHeader>
    <CardContent className="flex flex-col gap-4">{children}</CardContent>
  </Card>
);
