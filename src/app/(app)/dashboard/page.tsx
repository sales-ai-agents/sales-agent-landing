"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Clock, Target, ChevronRight } from "lucide-react";

import {
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { CallsChart, PageError, PageLoading } from "@/components/dashboard";
import { useStats, useAgents, useCallLogs } from "@dashboard/hooks";
import { formatNumber, formatTimeSaved } from "@/lib/utils";
import { KpiCard } from "./_components/kpi-card";
import { ChartLegend } from "./_components/chart-legend";
import { AgentEfficiencyRow } from "./_components/agent-efficiency-row";
import { RecentCallRow } from "./_components/recent-call-row";
import { RecentCallCard } from "./_components/recent-call-card";

const PERIOD_OPTIONS = [
  { label: "7 днів", value: 7 },
  { label: "30 днів", value: 30 },
  { label: "90 днів", value: 90 },
] as const;

const DashboardPage = () => {
  const [days, setDays] = useState(7);

  const { data: stats, isLoading: statsLoading, error, refetch } = useStats(days);
  const { data: agents = [] } = useAgents({ stats: true });
  const { data: callsData } = useCallLogs({ limit: 4 });

  if (statsLoading) return <PageLoading message="Завантажуємо статистику..." />;
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
      </div>

      <Select value={String(days)} onValueChange={(val) => setDays(Number(val))}>
        <SelectTrigger className="bg-card">
          <SelectValue className="px-10">{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {PERIOD_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={String(opt.value)}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div
        id="onboarding-stats-cards"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="border-primary/35 bg-card col-span-1 rounded-xl border p-5 sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-medium tracking-wide uppercase">Використання хвилин</p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-semibold">{minutesUsed}</span>
            <span className="text-muted-foreground text-lg">/ {minutesLimit} хв</span>
          </div>
          <Progress value={usagePercent} className="bg-muted mt-3 rounded-full" />
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
          icon={<Phone className="text-success h-4 w-4" />}
          iconBg="bg-success/15"
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
          icon={<Target className="text-warning h-4 w-4" />}
          iconBg="bg-warning/15"
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
              className="bg-muted text-muted-foreground hover:bg-muted/70 mt-8 flex items-center justify-center rounded-xl py-2 text-sm transition-colors"
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
        <div className="border-border bg-card overflow-hidden rounded-xl border">
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Клієнт</TableHead>
                  <TableHead className="px-4">Агент</TableHead>
                  <TableHead className="px-4">Тривалість</TableHead>
                  <TableHead className="px-4">Результат</TableHead>
                  <TableHead className="px-4">Час</TableHead>
                  <TableHead className="w-8 px-2" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCalls.map((call) => (
                  <RecentCallRow key={call.id} call={call} agents={agents} />
                ))}
                {recentCalls.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground px-4 py-6 text-center">
                      Дзвінків поки немає
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="sm:hidden">
            {recentCalls.map((call) => (
              <RecentCallCard key={call.id} call={call} agents={agents} />
            ))}
            {recentCalls.length === 0 && (
              <p className="text-muted-foreground px-4 py-6 text-center text-sm">
                Дзвінків поки немає
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
