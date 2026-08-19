"use client";

import React from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { PageLoading } from "@/components/dashboard/page-states";
import { useMe } from "@/lib/hooks/use-auth";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: account, isLoading } = useMe();

  if (isLoading) return <PageLoading />;
  if (!account) return <PageLoading />;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="bg-muted/30 flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
