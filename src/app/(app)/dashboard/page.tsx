"use client";

import { PhoneCall, CheckCircle, XCircle, UserCheck, Bot, Plus } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { CallsChart } from "@/components/dashboard/calls-chart";
import { recentActivity, type StatCard } from "@/lib/mock-data";

const STATS: readonly StatCard[] = [
  {
    title: "Total Calls",
    value: "1,247",
    change: "+12%",
    icon: PhoneCall,
  },
  {
    title: "Successful Calls",
    value: "1,089",
    change: "+8%",
    icon: CheckCircle,
  },
  {
    title: "Missed Calls",
    value: "98",
    change: "-3%",
    icon: XCircle,
  },
  {
    title: "Human Follow-up",
    value: "60",
    change: "+2%",
    icon: UserCheck,
  },
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your AI voice agents performance</p>
        </div>
        <Link href="/dashboard/agents/create" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          New Agent
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => {
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
                    <p className="text-muted-foreground mt-1 text-xs">
                      <span
                        className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}
                      >
                        {stat.change}
                      </span>{" "}
                      vs last week
                    </p>
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
          <h2 className="font-display text-lg font-semibold">Calls This Week</h2>
        </CardHeader>
        <CardContent>
          <CallsChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-display text-lg font-semibold">Recent Agent Activity</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((agent) => (
              <div
                key={agent.name}
                className="flex items-center justify-between border-b py-2 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Bot className="text-primary h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{agent.name}</p>
                    <p className="text-muted-foreground text-xs">{agent.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{agent.calls} calls</p>
                  <p className="text-xs text-green-600">{agent.success} success</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
