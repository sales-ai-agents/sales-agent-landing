"use client";

import React from "react";

import {
  Sidebar,
  DashboardHeader,
  PageLoading,
  PageError,
  SupportBotButton,
} from "@/components/dashboard";
import { OnboardingWrapper } from "@/components/dashboard/onboarding";
import { useRequireAuth } from "@/lib/hooks";

const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated, isUnauthenticated, error, refetch } = useRequireAuth();

  if (isLoading || isUnauthenticated) return <PageLoading />;
  if (!isAuthenticated) return <PageError message={error?.message} onRetry={() => refetch()} />;

  return (
    <OnboardingWrapper>
      <div className="flex h-screen px-5 pt-8 pb-15">
        <Sidebar />
        <div className="ml-5 flex flex-1 flex-col">
          <DashboardHeader />
          <main className="bg-primary/5 flex-1 overflow-y-auto rounded-xl px-6 py-8">
            {children}
          </main>
        </div>
        <SupportBotButton />
      </div>
    </OnboardingWrapper>
  );
};

export default DashboardShell;
