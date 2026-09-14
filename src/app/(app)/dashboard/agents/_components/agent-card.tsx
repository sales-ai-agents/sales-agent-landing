"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Bot, Info, Pause, Play, Plug, FileSpreadsheet, Table, Webhook } from "lucide-react";

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
import type { Agent, AgentIntegration } from "@dashboard/types";
import { cn, formatNumber, formatTimeSaved, formatMinutesUsed } from "@/lib/utils";

const INTEGRATION_LABELS: Record<string, string> = {
  google_sheets: "Google Sheets",
  sheets: "Google Sheets",
  bitrix24: "Bitrix24",
  keycrm: "KeyCRM",
  pipedrive: "Pipedrive",
  webhook: "Webhook",
  crm: "CRM",
};

const INTEGRATION_ICONS: Record<string, LucideIcon> = {
  google_sheets: FileSpreadsheet,
  sheets: FileSpreadsheet,
  bitrix24: Table,
  keycrm: Table,
  pipedrive: Table,
  webhook: Webhook,
  crm: Table,
};

const resolveIntegrationKey = (item: string | AgentIntegration): string =>
  (typeof item === "string" ? item : (item.type ?? item.id ?? "")).toLowerCase();

const resolveIntegrationIcon = (item: string | AgentIntegration): LucideIcon =>
  INTEGRATION_ICONS[resolveIntegrationKey(item)] ?? Plug;

const resolveIntegrationName = (item: string | AgentIntegration): string => {
  if (typeof item === "string") {
    return INTEGRATION_LABELS[item.toLowerCase()] ?? item;
  }
  return item.name || INTEGRATION_LABELS[item.id?.toLowerCase() ?? ""] || item.id || "Інтеграція";
};

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
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className={`text-lg font-semibold ${highlight ? "text-primary" : ""}`}>{value}</p>
    </div>
  );
};

const MAX_VISIBLE_INTEGRATIONS = 3;

interface IntegrationIconsProps {
  integrations?: (string | AgentIntegration)[];
}

const IntegrationIcons = ({ integrations }: IntegrationIconsProps) => {
  const active = (integrations ?? []).filter((item) =>
    typeof item === "string" ? true : item.connected !== false
  );

  if (active.length === 0) {
    return <p className="text-muted-foreground mt-1 text-sm">—</p>;
  }

  const visible = active.slice(0, MAX_VISIBLE_INTEGRATIONS);
  const hiddenCount = active.length - visible.length;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-4">
      {visible.map((item, index) => {
        const Icon = resolveIntegrationIcon(item);
        const name = resolveIntegrationName(item);

        return (
          <span
            key={typeof item === "string" ? `${item}-${index}` : `${item.id ?? item.name}-${index}`}
            title={name}
            aria-label={name}
            className="border-border bg-background relative flex size-9 items-center justify-center rounded-full border"
          >
            <Icon className="size-4" aria-hidden="true" />
            <span className="absolute right-0 bottom-0 size-2 rounded-full border-white bg-green-500" />
          </span>
        );
      })}

      {hiddenCount > 0 && (
        <span className="bg-primary/10 text-primary flex h-6 items-center rounded-full px-2.5 text-xs font-medium">
          +{hiddenCount}
        </span>
      )}
    </div>
  );
};

export const AgentCard = ({ agent, onToggle, onTest }: AgentCardProps) => {
  const isActive = agent.is_active;
  const stats = agent.stats;

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
            <p className="text-muted-foreground text-xs">
              agent_{String(agent.id).padStart(2, "0")}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "shrink-0",
            isActive ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
          )}
        >
          <span className={cn("mr-1", isActive ? "text-green-500" : "text-red-500")}>●</span>
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

      <div className="mt-4">
        <p className="text-muted-foreground text-xs">Інтеграції</p>
        <IntegrationIcons integrations={agent.integrations} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <div className="border-border rounded-md border">
          <Link
            href={`/dashboard/agents/${agent.id}/edit`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Редагувати
          </Link>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="outline" size="sm" onClick={onTest}>
                  Тестувати
                  <Info className="text-muted-foreground ml-1 size-3.5" aria-hidden="true" />
                </Button>
              }
            />
            <TooltipContent side="bottom">
              Дзвінок надійде на ваш номер - клієнтам ми не телефонуватимемо
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
