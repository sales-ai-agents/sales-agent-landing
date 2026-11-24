import { Progress } from "@/components/ui";
import { cn, formatNumber, pluralizeGoals } from "@/lib/utils";
import type { Agent } from "@dashboard/types";

export interface AgentEfficiencyRowProps {
  agent: Agent;
  index: number;
  periodDays: number;
}

export const AgentEfficiencyRow = ({ agent, index, periodDays }: AgentEfficiencyRowProps) => {
  const efficiency = agent.stats?.efficiency_pct ?? null;
  const goals = agent.stats?.meetings ?? 0;
  const subtitle =
    efficiency !== null
      ? `${formatNumber(goals)} ${pluralizeGoals(goals)} досягнуто`
      : `Немає дзвінків за ${periodDays} днів`;

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
      <span
        className={cn(
          "font-heading grid size-10 place-items-center rounded-full",
          index === 0 ? "bg-foreground text-background" : "bg-primary/10 text-primary"
        )}
      >
        {agent.name.charAt(0).toUpperCase()}
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <b className="truncate font-medium">{agent.name}</b>
        <span className="text-muted-foreground text-xs">{subtitle}</span>
        <Progress value={efficiency ?? 0} aria-label={`Ефективність ${agent.name}`} />
      </div>
      <span className="font-heading text-lg tabular-nums">
        {efficiency !== null ? `${Math.round(efficiency)}%` : "—"}
      </span>
    </div>
  );
};
