import { Bot } from "lucide-react";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

interface AgentIdentityProps {
  name: string;
  id: number | string;
  isActive: boolean;
  revision?: number;
  className?: string;
}

export const AgentIdentity = ({ name, id, isActive, revision, className }: AgentIdentityProps) => (
  <div className={cn("flex items-center gap-3", className)}>
    <span
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-2xl",
        isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
      )}
    >
      <Bot className="size-5" aria-hidden="true" />
    </span>
    <div className="flex min-w-0 flex-1 flex-col">
      <h3 className="font-heading truncate text-xl">{name}</h3>
      <span className="caption text-muted-foreground">
        {`agent_${id}`}
        {revision !== undefined && revision > 0 && (
          <>
            {" "}
            · <span title="Версія інструкції">v{revision}</span>
          </>
        )}
      </span>
    </div>
    {isActive ? (
      <Badge variant="success" dot>
        Активний
      </Badge>
    ) : (
      <Badge variant="muted">Неактивний</Badge>
    )}
  </div>
);
