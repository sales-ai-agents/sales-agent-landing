"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, Clock, Target, Download, ArrowUp, ArrowDown, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CallsChart } from "@/components/dashboard/calls-chart";
import { useStats } from "@dashboard/hooks/use-stats";
import { useAgents } from "@dashboard/hooks/use-agents";
import { useCallLogs } from "@dashboard/hooks/use-call-logs";
import type { Agent, CallLog } from "@dashboard/types";
import { PageLoading } from "@/components/dashboard/page-states";
import { formatNumber, formatTimeSaved, formatDuration, formatTime, maskPhone } from "@/lib/utils";

const PERIOD_OPTIONS = [
  { label: "7 днів", value: 7 },
  { label: "30 днів", value: 30 },
  { label: "90 днів", value: 90 },
] as const;

export default function DashboardPage() {
  const [days, setDays] = useState(7);

  const { data: stats, isLoading: statsLoading } = useStats(days);
  const { data: agents = [] } = useAgents();
  const { data: callsData } = useCallLogs({ limit: 4 });

  if (statsLoading) return <PageLoading />;

  const minutesUsed = stats?.minutes_used ?? 0;
  const minutesLimit = stats?.minutes_limit ?? 1000;
  const minutesLeft = stats?.minutes_left ?? minutesLimit;
  const usagePercent = minutesLimit > 0 ? (minutesUsed / minutesLimit) * 100 : 0;

  const totalCalls = stats?.period?.total_calls ?? 0;
  const successfulCalls = stats?.period?.successful_calls ?? 0;
  const deltaTotalCalls = stats?.delta_pct?.total_calls ?? null;
  const deltaSuccessfulCalls = stats?.delta_pct?.successful_calls ?? null;

  const daysEstimate =
    minutesUsed > 0 && stats?.period_days
      ? Math.round(minutesLeft / (minutesUsed / stats.period_days))
      : null;

  const recentCalls = callsData?.calls ?? [];
  const selectedLabel = PERIOD_OPTIONS.find((opt) => opt.value === days)?.label;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Огляд</h1>
          <p className="text-muted-foreground text-sm">Статистика роботи ваших ШІ-агентів</p>
        </div>
        <Button variant="outline" className="gap-3">
          <Download className="h-4 w-4" />
          Експорт
        </Button>
      </div>

      <div>
        <Select value={String(days)} onValueChange={(val) => setDays(Number(val))}>
          <SelectTrigger className="w-auto bg-white px-10">
            <SelectValue>{selectedLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-primary/35 col-span-1 rounded-xl border bg-white p-5 sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-medium tracking-wide uppercase">Використання хвилин</p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-semibold">{minutesUsed}</span>
            <span className="text-muted-foreground text-lg">/ {minutesLimit} хв</span>
          </div>
          <Progress value={usagePercent} className="mt-3 rounded-full bg-gray-200" />
          <p className="text-muted-foreground mt-3 text-xs">Залишилось {minutesLeft} хв</p>
          <p className="text-muted-foreground text-xs">
            Вистачить ще на{" "}
            <span className="text-foreground font-medium">~{daysEstimate ?? "—"} днів</span>
          </p>
          <Link
            href="/dashboard/billing"
            className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium"
          >
            Докупити хвилини
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <KpiCard
          icon={<Phone className="h-4 w-4 text-green-600" />}
          iconBg="bg-green-100"
          title="Усього дзвінків"
          value={formatNumber(totalCalls)}
          subtitle={`За останні ${days} днів`}
          delta={deltaTotalCalls}
          periodLabel={`проти попередніх ${days} днів`}
        />

        <KpiCard
          icon={<Clock className="text-primary h-4 w-4" />}
          iconBg="bg-primary/10"
          title="Заощаджено часу"
          value={formatTimeSaved(totalCalls)}
          subtitle={`За останні ${days} днів`}
          delta={null}
          periodLabel=""
        />

        <KpiCard
          icon={<Target className="h-4 w-4 text-orange-500" />}
          iconBg="bg-orange-100"
          title="Досягнуто цілі"
          value={formatNumber(successfulCalls)}
          subtitle={
            totalCalls > 0
              ? `${((successfulCalls / totalCalls) * 100).toFixed(1)}% від усіх дзвінків`
              : "0% від усіх дзвінків"
          }
          delta={deltaSuccessfulCalls}
          periodLabel={`проти попередніх ${days} днів`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="border-border bg-background rounded-xl border p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-medium">Активність дзвінків</h2>
            <ChartLegend />
          </div>
          <CallsChart data={stats?.by_day} />
        </div>

        <div className="border-primary/35 bg-background rounded-xl border p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-medium tracking-wide uppercase">Ефективність агентів</h2>
            <Link href="/dashboard/agents" className="text-primary text-xs font-medium">
              Усі агенти →
            </Link>
          </div>
          <div className="space-y-5">
            {agents.slice(0, 3).map((agent, index) => (
              <AgentEfficiencyRow key={agent.id} agent={agent} index={index} />
            ))}
            {agents.length === 0 && (
              <p className="text-muted-foreground text-sm">Немає створених агентів</p>
            )}
          </div>
          {agents.length > 0 && (
            <Link
              href="/dashboard/agents"
              className="mt-8 flex items-center justify-center rounded-xl bg-black/5 py-2 text-sm text-black/80 transition-colors hover:bg-black/10"
            >
              Перейти до всіх агентів
            </Link>
          )}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-medium">Останні дзвінки</h2>
          <Link href="/dashboard/call-logs" className="text-muted-foreground text-sm">
            Усі дзвінки →
          </Link>
        </div>
        <div className="border-border bg-background overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium">Клієнт</th>
                <th className="px-4 py-3 text-left font-medium">Агент</th>
                <th className="px-4 py-3 text-left font-medium">Тривалість</th>
                <th className="px-4 py-3 text-left font-medium">Результат</th>
                <th className="px-4 py-3 text-left font-medium">Час</th>
                <th className="w-8 px-2" />
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((call) => (
                <RecentCallRow key={call.id} call={call} agents={agents} />
              ))}
              {recentCalls.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-muted-foreground px-4 py-6 text-center">
                    Дзвінків поки немає
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface KpiCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: string;
  subtitle: string;
  delta: number | null;
  periodLabel: string;
}

function KpiCard({ icon, iconBg, title, value, subtitle, delta, periodLabel }: KpiCardProps) {
  return (
    <div className="border-primary/35 rounded-xl border bg-white p-5">
      <div className="flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
          {icon}
        </div>
        <p className="text-xs font-medium tracking-wide uppercase">{title}</p>
      </div>
      <p className="mt-4 text-4xl font-semibold">{value}</p>
      <p className="text-muted-foreground mt-2 text-xs">{subtitle}</p>
      {periodLabel && (
        <div className="mt-2">
          <DeltaDisplay value={delta} />
          <p className="text-muted-foreground text-xs">{periodLabel}</p>
        </div>
      )}
    </div>
  );
}

function DeltaDisplay({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="text-muted-foreground text-sm">—</span>;
  }

  const isPositive = value >= 0;

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-sm font-medium ${
        isPositive ? "text-green-600" : "text-red-500"
      }`}
    >
      {isPositive ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
      {Math.abs(value)}%
    </span>
  );
}

function ChartLegend() {
  return (
    <div className="hidden items-center gap-4 md:flex">
      <div className="flex items-center gap-1.5">
        <span className="bg-primary h-2.5 w-2.5 rounded-full" />
        <span className="text-muted-foreground text-xs">Усі дзвінки</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="text-muted-foreground text-xs">Досягнуто цілі</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
        <span className="text-muted-foreground text-xs">Заощаджений час</span>
      </div>
    </div>
  );
}

function AgentEfficiencyRow({ agent, index }: { agent: Agent; index: number }) {
  const efficiency = 25;

  const colors = [
    { bg: "bg-primary/10", bar: "bg-primary", text: "text-primary" },
    { bg: "bg-green-100", bar: "bg-green-500", text: "text-green-500" },
    { bg: "bg-orange-100", bar: "bg-orange-500", text: "text-orange-500" },
  ];
  const color = colors[index % 3];

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
          <p className="text-muted-foreground text-xs">
            {agent.is_active ? "Активний" : "Призупинено"}
          </p>
          <p className={`text-xs font-normal ${color.text}`}>{efficiency}%</p>
        </div>
        <div className="bg-muted mt-1.5 h-1.5 w-full overflow-hidden rounded-full">
          <div className={`h-full rounded-full ${color.bar}`} style={{ width: `${efficiency}%` }} />
        </div>
      </div>
    </div>
  );
}

interface RecentCallRowProps {
  call: CallLog;
  agents: Agent[];
}

function RecentCallRow({ call, agents }: RecentCallRowProps) {
  const agentName = agents.find((a) => a.id === call.agent_id)?.name ?? "—";
  const duration = call.duration_sec ? formatDuration(call.duration_sec) : "—";
  const time = formatTime(call.created_at);

  const { label, badgeClass, icon } = getOutcomeDisplay(call);

  return (
    <tr className="hover:bg-muted/30 border-b last:border-0">
      <td className="text-muted-foreground px-4 py-2.5 text-sm">{maskPhone(call.phone)}</td>
      <td className="text-muted-foreground px-4 py-2.5 text-sm">{agentName}</td>
      <td className="text-muted-foreground px-4 py-2.5 text-sm">{duration}</td>
      <td className="px-4 py-2.5">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-sm ${badgeClass}`}
        >
          <span>{icon}</span>
          {label}
        </span>
      </td>
      <td className="text-muted-foreground px-4 py-2.5 text-sm">{time}</td>
      <td className="px-2 py-2.5">
        <Link href={`/dashboard/call-logs/${call.id}`}>
          <ChevronRight className="text-muted-foreground h-4 w-4" />
        </Link>
      </td>
    </tr>
  );
}

function getOutcomeDisplay(call: CallLog): {
  label: string;
  badgeClass: string;
  icon: string;
} {
  if (call.meeting_scheduled) {
    return {
      label: "Ціль досягнута",
      badgeClass: "bg-green-100/80 text-green-900",
      icon: "✓",
    };
  }

  switch (call.outcome) {
    case "не_відповів":
      return {
        label: "Без відповіді",
        badgeClass: "bg-gray-100 text-gray-700",
        icon: "–",
      };
    case "передзвонити":
      return {
        label: "Передано",
        badgeClass: "bg-amber-100/80 text-amber-900",
        icon: "↗",
      };
    case "відмова":
    case "не_цікаво":
      return {
        label: "Помилка",
        badgeClass: "bg-red-100/80 text-red-900",
        icon: "!",
      };
    default:
      if (call.outcome) {
        return {
          label: call.outcome,
          badgeClass: "bg-gray-100 text-gray-700",
          icon: "–",
        };
      }
      return {
        label: "В процесі",
        badgeClass: "bg-gray-100 text-gray-700",
        icon: "–",
      };
  }
}
