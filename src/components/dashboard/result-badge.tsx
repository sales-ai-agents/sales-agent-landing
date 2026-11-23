import { Check, Minus, PhoneForwarded, TriangleAlert, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui";

export type ResultTone = "ok" | "fw" | "no" | "err";

const TONES: Record<
  ResultTone,
  { variant: "success" | "secondary" | "muted" | "destructive"; icon: LucideIcon }
> = {
  ok: { variant: "success", icon: Check },
  fw: { variant: "secondary", icon: PhoneForwarded },
  no: { variant: "muted", icon: Minus },
  err: { variant: "destructive", icon: TriangleAlert },
};

interface ResultBadgeProps {
  tone: ResultTone;
  label: string;
  className?: string;
}

export const ResultBadge = ({ tone, label, className }: ResultBadgeProps) => {
  const { variant, icon: Icon } = TONES[tone];
  return (
    <Badge variant={variant} className={className} title={label}>
      <Icon aria-hidden="true" />
      {label}
    </Badge>
  );
};
