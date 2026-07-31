"use client";

import { PhoneCall, CheckCircle, XCircle, UserCheck, Bot, Plus } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { CallsChart } from "@/components/dashboard/calls-chart";

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const STATS = [
  {
    title: "Total Calls",
    value: "1,247",
    change: "+12%",
    icon: PhoneCall,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Successful Calls",
    value: "1,089",
    change: "+8%",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Missed Calls",
    value: "98",
    change: "-3%",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    title: "Human Follow-up",
    value: "60",
    change: "+2%",
    icon: UserCheck,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
] as const satisfies readonly StatCard[];

interface RecentAgent {
  name: string;
  calls: number;
  success: string;
  time: string;
}

const RECENT_ACTIVITY = [
  { name: "Appointment Reminder Bot", calls: 45, success: "92%", time: "2 min ago" },
  { name: "Lead Qualifier", calls: 23, success: "87%", time: "15 min ago" },
  { name: "Follow-up Agent", calls: 12, success: "95%", time: "1 hour ago" },
] as const satisfies readonly RecentAgent[];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your AI voice agents performance</p>
        </div>
        <Link href="/dashboard/agents/create" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          New Agent
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
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
                  <div className={`rounded-full p-3 ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Calls This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <CallsChart />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Agent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((agent) => (
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
