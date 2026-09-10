import { Bot } from "lucide-react";

import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

interface AgentHeaderProps {
  name: string;
  id: number | string;
  isActive: boolean;
}

export const AgentHeader = ({ name, id, isActive }: AgentHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-background flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <Bot className="text-primary h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="text-muted-foreground text-xs font-light">{`agent_${id}`}</p>
        </div>
      </div>
      <Badge
        variant="outline"
        className={cn(
          "shrink-0 border-transparent",
          isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
        )}
      >
        <span className={cn("mr-1", isActive ? "text-green-600" : "text-red-500")}>●</span>
        {isActive ? "Активний" : "Неактивний"}
      </Badge>
    </div>
  );
};
