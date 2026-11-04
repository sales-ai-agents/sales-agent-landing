"use client";

import Link from "next/link";
import { Bot, Info, Pause, Play } from "lucide-react";

import {
  Badge,
  Button,
  buttonVariants,
  Progress,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import type { Agent } from "@dashboard/types";
import { cn, formatNumber, formatTimeSaved, formatMinutesUsed } from "@/lib/utils";

export interface AgentCardProps {
  agent: Agent;
  onToggle: () => void;
  onTest: () => void;
}

interface StatItemProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const StatItem = ({ label, value, highlight = false }: StatItemProps) => {
  return (
    <div className="min-w-0">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className={`truncate text-lg font-semibold ${highlight ? "text-primary" : ""}`}>{value}</p>
    </div>
  );
};

const TEST_TOOLTIP_READY = "Дзвінок надійде на ваш номер — клієнтам ми не телефонуватимемо";

const CAN_TEST_REASON_LABELS: Record<string, string> = {
  no_instructions: "Додайте інструкції агенту, щоб здійснити тестовий дзвінок",
  minutes_exhausted: "Хвилини вичерпано — поповніть тариф",
  plan_expired: "Строк тарифу вийшов — продовжіть підписку",
  calls_blocked: "Дзвінки зупинені — зверніться до підтримки",
};

export const AgentCard = ({ agent, onToggle, onTest }: AgentCardProps) => {
  const isActive = agent.is_active;
  const stats = agent.stats;
  const canTest = agent.can_test ?? false;
  const testReason = agent.can_test_reason ?? null;

  const totalCalls = stats?.total_calls ?? 0;
  const efficiencyPct = stats?.efficiency_pct;
  const minutesUsed = stats?.minutes_used ?? 0;
  const minutesSharePct = stats?.minutes_share_pct;
  const talkMinutesSaved = stats?.talk_minutes_saved ?? 0;

  const efficiencyLabel =
    efficiencyPct !== null && efficiencyPct !== undefined ? `${Math.round(efficiencyPct)}%` : "—";
  const minutesShareLabel =
    minutesSharePct !== null && minutesSharePct !== undefined
      ? `${Math.round(minutesSharePct)}%`
      : "0%";

  return (
    <div className="border-border bg-background rounded-2xl border p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Bot className="text-primary h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">{agent.name}</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "shrink-0",
            isActive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
          )}
        >
          <span className={cn("mr-1", isActive ? "text-success" : "text-destructive")}>●</span>
          {isActive ? "Активний" : "Неактивний"}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <StatItem label="Усього дзвінків" value={formatNumber(totalCalls)} />
        <StatItem label="Ефективність" value={efficiencyLabel} highlight />
        <StatItem label="Заощаджено часу" value={formatTimeSaved(talkMinutesSaved)} />
      </div>

      <div className="mt-4">
        <p className="text-muted-foreground text-xs">Використано хвилин</p>
        <div className="mt-1 flex items-center gap-3">
          <span className="shrink-0 text-sm font-semibold">{formatMinutesUsed(minutesUsed)}</span>
          <Progress value={minutesSharePct ?? 0} className="w-full" />
          <span className="text-muted-foreground shrink-0 text-xs">{minutesShareLabel}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/dashboard/agents/${agent.id}/edit`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Редагувати
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  aria-disabled={!canTest}
                  onClick={canTest ? onTest : undefined}
                  className={cn(!canTest && "bg-muted cursor-default opacity-50")}
                >
                  Тестувати
                  {!canTest && (
                    <Info className="text-muted-foreground ml-1 size-3.5" aria-hidden="true" />
                  )}
                </Button>
              }
            />
            <TooltipContent side="bottom">
              {canTest
                ? TEST_TOOLTIP_READY
                : ((testReason && CAN_TEST_REASON_LABELS[testReason]) ??
                  CAN_TEST_REASON_LABELS.no_instructions)}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          {isActive ? (
            <>
              <Pause className="mr-1 h-3 w-3" />
              Пауза
            </>
          ) : (
            <>
              <Play className="mr-1 h-3 w-3" />
              Активувати
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
