import type { Agent } from "@dashboard/types";
import { formatNumber } from "@/lib/utils";

const COLORS = [
  { bg: "bg-primary/10", bar: "bg-primary", text: "text-primary" },
  { bg: "bg-green-100", bar: "bg-green-500", text: "text-green-500" },
  { bg: "bg-orange-100", bar: "bg-orange-500", text: "text-orange-500" },
] as const;

export interface AgentEfficiencyRowProps {
  agent: Agent;
  index: number;
}

export function AgentEfficiencyRow({ agent, index }: AgentEfficiencyRowProps) {
  const efficiency = agent.stats?.efficiency_pct ?? null;
  const subtitle =
    efficiency !== null
      ? `${formatNumber(agent.stats?.meetings ?? 0)} цілей досягнуто`
      : "Ще не дзвонив";

  const color = COLORS[index % COLORS.length];

  return (
    <div className="flex items-start gap-3">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color.bg}`}>
        <span className={`text-xs font-bold ${color.text}`}>
          {agent.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{agent.name}</p>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs">{subtitle}</p>
          <p className={`text-xs font-normal ${color.text}`}>
            {efficiency !== null ? `${Math.round(efficiency)}%` : "—"}
          </p>
        </div>
        <div className="bg-muted mt-1.5 h-1.5 w-full overflow-hidden rounded-full">
          <div
            className={`h-full rounded-full ${color.bar}`}
            style={{ width: `${efficiency ?? 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}
