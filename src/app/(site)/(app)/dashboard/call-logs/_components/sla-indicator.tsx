import { Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui";
import { formatSlaMinutes } from "@/lib/utils";
import type { SlaState } from "@dashboard/types";

interface SlaIndicatorProps {
  state: SlaState | null;
  minutesLeft: number | null;
}

const Empty = () => <span className="text-muted-foreground">—</span>;

export const SlaIndicator = ({ state, minutesLeft }: SlaIndicatorProps) => {
  if (!state) return <Empty />;
  const formatted = minutesLeft !== null ? formatSlaMinutes(minutesLeft) : "0 хв";
  switch (state) {
    case "breached":
      return (
        <Badge variant="destructive">
          <Clock aria-hidden="true" />
          Прострочено {formatted}
        </Badge>
      );
    case "ok":
      return (
        <Badge variant="warning">
          <Clock aria-hidden="true" />
          Залишилось {formatted}
        </Badge>
      );
    case "handled":
      return (
        <Badge variant="success">
          <Check aria-hidden="true" />
          Оброблено
        </Badge>
      );
    default:
      return <Empty />;
  }
};
