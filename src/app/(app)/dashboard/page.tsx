"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Clock, Target, Download, ChevronRight } from "lucide-react";

import {
  Button,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { CallsChart, PageError, PageLoading } from "@/components/dashboard";
import { useStats, useAgents, useCallLogs } from "@dashboard/hooks";
import { formatNumber, formatTimeSaved } from "@/lib/utils";
import { KpiCard } from "./_components/kpi-card";
import { ChartLegend } from "./_components/chart-legend";
import { AgentEfficiencyRow } from "./_components/agent-efficiency-row";
import { RecentCallRow } from "./_components/recent-call-row";

const PERIOD_OPTIONS = [
  { label: "7 днів", value: 7 },
  { label: "30 днів", value: 30 },
  { label: "90 днів", value: 90 },
] as const;

export default function DashboardPage() {
  const [days, setDays] = useState(7);

  const { data: stats, isLoading: statsLoading, error, refetch } = useStats(days);
  const { data: agents = [] } = useAgents({ stats: true });
  const { data: callsData } = useCallLogs({ limit: 4 });

  if (statsLoading) return <PageLoading />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;

  const minutesUsed = stats?.minutes_used ?? 0;
  const minutesLimit = stats?.minutes_limit ?? 1000;
  const minutesLeft = stats?.minutes_left ?? minutesLimit;
  const usagePercent = minutesLimit > 0 ? (minutesUsed / minutesLimit) * 100 : 0;

  const totalCalls = stats?.period?.total_calls ?? 0;
  const successfulCalls = stats?.period?.successful_calls ?? 0;
  const deltaTotalCalls = stats?.delta_pct?.total_calls ?? null;
  const deltaSuccessfulCalls = stats?.delta_pct?.successful_calls ?? null;
  const talkMinutesSaved = stats?.period?.talk_minutes_saved ?? 0;
  const deltaTalkMinutesSaved = stats?.delta_pct?.talk_minutes_saved ?? null;

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

      <div
        id="onboarding-stats-cards"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
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
          value={formatTimeSaved(talkMinutesSaved)}
          subtitle={`За останні ${days} днів`}
          delta={deltaTalkMinutesSaved}
          periodLabel={deltaTalkMinutesSaved !== null ? `проти попередніх ${days} днів` : ""}
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
