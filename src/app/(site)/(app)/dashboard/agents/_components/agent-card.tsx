"use client";

import Link from "next/link";
import { Info, Mic, Pause, Pencil, PhoneOutgoing, Play } from "lucide-react";
import {
  Button,
  Card,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  buttonVariants,
} from "@/components/ui";
import { VoiceWave } from "@/components/dashboard";
import { cn, formatMinutesUsed, formatNumber, formatTimeSaved } from "@/lib/utils";
import type { Agent } from "@dashboard/types";
import { AgentIdentity } from "./agent-identity";

export interface AgentCardProps {
  agent: Agent;
  onToggle: () => void;
  onTest: () => void;
  onStartCampaign: () => void;
}

const TEST_TOOLTIP_READY = "Дзвінок надійде на ваш номер - клієнтам ми не телефонуватимемо";

const CAN_TEST_REASON_LABELS: Record<string, string> = {
  no_instructions: "Додайте інструкції агенту, щоб здійснити тестовий дзвінок",
  minutes_exhausted: "Хвилини вичерпано — поповніть рахунок",
  plan_expired: "Строк тарифу вийшов — продовжіть підписку",
  calls_blocked: "Дзвінки зупинені — зверніться до підтримки",
};

const WAVE_BARS = 40;
const PERCENT = 100;

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <span className="caption text-muted-foreground">{label}</span>
    <b className="font-heading text-2xl">{value}</b>
  </div>
);

const AgentMetrics = ({ stats }: { stats: Agent["stats"] }) => {
  const efficiency = stats?.efficiency_pct;
  const minutesShare = stats?.minutes_share_pct;
  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <Metric label="Усього дзвінків" value={formatNumber(stats?.total_calls ?? 0)} />
        <Metric
          label="Ефективність"
          value={efficiency != null ? `${Math.round(efficiency)}%` : "—"}
        />
        <Metric label="Заощаджено часу" value={formatTimeSaved(stats?.talk_minutes_saved ?? 0)} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Використано хвилин</span>
          <span className="font-mono">
            <b>{formatMinutesUsed(stats?.minutes_used ?? 0)}</b>{" "}
            <span className="text-muted-foreground">
              · {minutesShare != null ? `${Math.round(minutesShare)}%` : "—"}
            </span>
          </span>
        </div>
        <VoiceWave fraction={(minutesShare ?? 0) / PERCENT} bars={WAVE_BARS} />
      </div>
    </>
  );
};

const TestButton = ({
  canTest,
  tooltip,
  onTest,
}: {
  canTest: boolean;
  tooltip: string;
  onTest: () => void;
}) => (
  <Tooltip>
    <TooltipTrigger
      render={
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-disabled={!canTest}
          onClick={canTest ? onTest : undefined}
          className={cn(!canTest && "cursor-default opacity-50")}
        />
      }
    >
      <Mic aria-hidden="true" />
      Тестувати
      <Info className="size-3 opacity-60" aria-hidden="true" />
    </TooltipTrigger>
    <TooltipContent>{tooltip}</TooltipContent>
  </Tooltip>
);

export const AgentCard = ({ agent, onToggle, onTest, onStartCampaign }: AgentCardProps) => {
  const isActive = agent.is_active;
  const canTest = agent.can_test ?? false;
  const testReason = agent.can_test_reason ?? null;
  const tooltip = canTest
    ? TEST_TOOLTIP_READY
    : ((testReason && CAN_TEST_REASON_LABELS[testReason]) ??
      CAN_TEST_REASON_LABELS.no_instructions);

  return (
    <Card className="flex flex-col gap-5 p-6">
      <AgentIdentity name={agent.name} id={agent.id} isActive={isActive} />
      <AgentMetrics stats={agent.stats} />
      <div className="mt-auto flex flex-wrap items-center gap-2">
        <Link
          className={buttonVariants({ variant: "ghost", size: "sm" })}
          href={`/dashboard/agents/${agent.id}/edit`}
        >
          <Pencil aria-hidden="true" />
          Редагувати
        </Link>
        <TestButton canTest={canTest} tooltip={tooltip} onTest={onTest} />
        {agent.call_direction === "outbound" && (
          <Button type="button" variant="ghost" size="sm" onClick={onStartCampaign}>
            <PhoneOutgoing aria-hidden="true" />
            Запустити обдзвін
          </Button>
        )}
        <Button type="button" variant="ghost" size="sm" onClick={onToggle}>
          {isActive ? (
            <>
              <Pause aria-hidden="true" />
              Пауза
            </>
          ) : (
            <>
              <Play aria-hidden="true" />
              Активувати
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
