"use client";

import { useState } from "react";
import Link from "next/link";
import { subDays } from "date-fns";

import { Clock, Phone, Target, Upload } from "lucide-react";
import {
  PageError,
  PageHead,
  PageLoading,
  ProgressRing,
  SectionCard,
  StatCard,
} from "@/components/dashboard";
import { Button, buttonVariants } from "@/components/ui";
import { useAgents, useBalance, useCallLogs, useStats } from "@dashboard/hooks";
import { apiUrl } from "@/lib/api-config";
import { cn, formatNumber } from "@/lib/utils";
import { toDateString } from "./call-logs/_lib/utils";
import { ActivityCard } from "./_components/activity-card";
import { AgentEfficiencyRow } from "./_components/agent-efficiency-row";
import { MinutesTile } from "./_components/minutes-tile";
import { OverviewFilters, type OverviewFilterState } from "./_components/overview-filters";
import { RecentCallsCard } from "./_components/recent-calls-card";
import { Sparkline } from "./_components/sparkline";
import { WeekBars } from "./_components/week-bars";

const RECENT_CALLS_LIMIT = 4;
const EFFICIENCY_AGENTS_LIMIT = 3;
const MINUTES_PER_HOUR = 60;
const PERCENT = 100;
const DEFAULT_FILTERS: OverviewFilterState = { days: 7, agentId: 0, numberId: 0 };

const SavedTime = ({ minutes }: { minutes: number }) => {
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const rest = Math.round(minutes % MINUTES_PER_HOUR);
  if (hours === 0) {
    return (
      <>
        {rest} <small>хв</small>
      </>
    );
  }
  return (
    <>
      {hours} <small>год</small> {rest} <small>хв</small>
    </>
  );
};

const DashboardPage = () => {
  const [filters, setFilters] = useState<OverviewFilterState>(DEFAULT_FILTERS);
  const { days, agentId, numberId } = filters;

  const stats = useStats(days, { agent_id: agentId, number_id: numberId });
  const { data: balance } = useBalance();
  const { data: agents = [] } = useAgents({ stats: true, days });
  const { data: callsData } = useCallLogs({
    limit: RECENT_CALLS_LIMIT,
    ...(agentId && { agent_id: agentId }),
  });

  if (stats.isLoading) return <PageLoading message="Завантажуємо статистику..." />;
  if (stats.error) return <PageError message={stats.error.message} onRetry={stats.refetch} />;
  if (!stats.data) return null;

  const { data } = stats;
  const recentCalls = callsData?.calls ?? [];
  const totalCalls = data.period.total_calls;
  const goals = data.period.successful_calls;
  const goalsPercent = totalCalls > 0 ? (goals / totalCalls) * PERCENT : 0;
  const previousLabel = `проти попередніх ${days} днів`;
  const averageCost =
    data.avg_call_usd === null ? "—" : `$${data.avg_call_usd.toFixed(2).replace(".", ",")}`;

  const handleExport = (): void => {
    const exportUrl = apiUrl.callsExport({
      date_from: toDateString(subDays(new Date(), days - 1)),
      date_to: toDateString(new Date()),
      ...(agentId && { agent_id: agentId }),
      ...(numberId && { number_id: numberId }),
    });
    window.open(exportUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHead
        word="огляд"
        title="Огляд"
        description="Статистика роботи ваших ШІ-агентів"
        actions={
          <Button variant="outline" onClick={handleExport}>
            <Upload aria-hidden="true" />
            Експорт за фільтром
          </Button>
        }
      />
      <OverviewFilters value={filters} onChange={setFilters} />
      <div id="onboarding-stats-cards" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MinutesTile stats={data} balance={balance} />
        <StatCard
          icon={Phone}
          title="Усього дзвінків"
          value={formatNumber(totalCalls)}
          subtitle={`Середня вартість дзвінка: ${averageCost}`}
          delta={data.delta_pct.total_calls}
          deltaLabel={previousLabel}
          footer={<WeekBars days={data.by_day} />}
        />
        <StatCard
          icon={Clock}
          title="Заощаджено часу"
          value={<SavedTime minutes={data.period.talk_minutes_saved} />}
          subtitle={`За останні ${days} днів`}
          delta={data.delta_pct.talk_minutes_saved}
          deltaLabel={previousLabel}
          footer={<Sparkline days={data.by_day} />}
        />
        <StatCard
          icon={Target}
          tone="warning"
          title="Досягнуто цілі"
          value={formatNumber(goals)}
          subtitle={`${goalsPercent.toFixed(1).replace(".", ",")}% від усіх дзвінків`}
          delta={data.delta_pct.successful_calls}
          deltaLabel={previousLabel}
          corner={<ProgressRing percent={goalsPercent} />}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <ActivityCard data={data.by_day} />
        <SectionCard
          caption="Ефективність агентів"
          action={
            <Link
              className="text-primary text-sm font-medium hover:underline"
              href="/dashboard/agents"
            >
              Усі агенти →
            </Link>
          }
          contentClassName="flex flex-col gap-4"
        >
          {agents.slice(0, EFFICIENCY_AGENTS_LIMIT).map((agent, index) => (
            <AgentEfficiencyRow key={agent.id} agent={agent} index={index} />
          ))}
          {agents.length === 0 && (
            <p className="text-muted-foreground text-sm">Немає створених агентів</p>
          )}
          <Link
            className={cn(buttonVariants({ variant: "outline" }), "mt-2 w-full")}
            href="/dashboard/agents"
          >
            Перейти до всіх агентів
          </Link>
        </SectionCard>
      </div>
      <RecentCallsCard calls={recentCalls} agents={agents} />
    </div>
  );
};
export default DashboardPage;
