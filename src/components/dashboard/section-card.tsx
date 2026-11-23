import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: ReactNode;
  caption?: string;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

export const SectionCard = ({
  title,
  caption,
  action,
  className,
  contentClassName,
  children,
}: SectionCardProps) => (
  <Card className={cn("gap-4", className)}>
    {(title || caption || action) && (
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          {caption && <span className="caption text-muted-foreground">{caption}</span>}
          {title && <CardTitle>{title}</CardTitle>}
        </div>
        {action}
      </CardHeader>
    )}
    <CardContent className={contentClassName}>{children}</CardContent>
  </Card>
);
