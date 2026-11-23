"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  DashboardHeader,
  PageLoading,
  PageError,
  SupportBotButton,
} from "@/components/dashboard";
import { OnboardingWrapper } from "@/components/dashboard/onboarding";
import { useRequireAuth } from "@/lib/hooks";
import { PendingPaymentBanner } from "./dashboard/_components/pending-payment-banner";

const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated, isUnauthenticated, error, refetch } = useRequireAuth();
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  if (isLoading || isUnauthenticated) return <PageLoading fullScreen />;
  if (!isAuthenticated) return <PageError message={error?.message} onRetry={() => refetch()} />;

  return (
    <OnboardingWrapper>
      <div className="bg-ground text-foreground flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader />
          <main className="flex flex-1 flex-col gap-6 px-4 pb-10">
            <PendingPaymentBanner />
            {children}
          </main>
        </div>
        <SupportBotButton />
      </div>
    </OnboardingWrapper>
  );
};

export default DashboardShell;
