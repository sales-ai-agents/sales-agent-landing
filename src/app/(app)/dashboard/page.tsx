"use client";

import { PhoneCall, CheckCircle, XCircle, Bot, Plus } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { CallsChart } from "@/components/dashboard/calls-chart";
import { useStats } from "@/hooks/use-stats";
import { useAgents } from "@/hooks/use-agents";
import type { Agent } from "@/types";

export default function DashboardPage() {
  const { data: stats } = useStats();
  const { data: agents = [] } = useAgents();

  const totalCalls = stats?.total_calls ?? 0;
  const successfulCalls = stats?.successful_calls ?? 0;
  const missedCalls = stats?.missed_calls ?? 0;

  const STATS_CARDS = [
    {
      title: "Всього дзвінків",
      value: totalCalls.toLocaleString(),
      icon: PhoneCall,
    },
    {
      title: "Успішні дзвінки",
      value: successfulCalls.toLocaleString(),
      icon: CheckCircle,
    },
    {
      title: "Пропущені дзвінки",
      value: missedCalls.toLocaleString(),
      icon: XCircle,
    },
  ] as const;

  const recentAgents = agents.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Дашборд</h1>
          <p className="text-muted-foreground">Огляд продуктивності ваших AI голосових агентів</p>
        </div>
        <Link href="/dashboard/agents/create" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Новий агент
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATS_CARDS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="border-border shadow-primary/30 rounded-2xl shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                    <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="bg-primary/10 rounded-full p-3">
                    <Icon className="text-primary h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-display text-lg font-semibold">Дзвінки цього тижня</h2>
        </CardHeader>
        <CardContent>
          <CallsChart data={stats?.by_day} />
        </CardContent>
      </Card>

      {recentAgents.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="font-display text-lg font-semibold">Ваші агенти</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAgents.map((agent: Agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between border-b py-2 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Bot className="text-primary h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{agent.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {agent.is_active ? "Активний" : "Призупинено"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">{agent.voice}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
