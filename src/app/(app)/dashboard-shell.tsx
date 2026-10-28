"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  DashboardHeader,
  PageLoading,
  PageError,
  SupportBotButton,
  PageTransition,
} from "@/components/dashboard";
import { OnboardingWrapper } from "@/components/dashboard/onboarding";
import { useRequireAuth } from "@/lib/hooks";

import { PendingPaymentBanner } from "./dashboard/_components/pending-payment-banner";

const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated, isUnauthenticated, error, refetch } = useRequireAuth();
  const mainRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  if (isLoading || isUnauthenticated) return <PageLoading fullScreen />;
  if (!isAuthenticated) return <PageError message={error?.message} onRetry={() => refetch()} />;

  return (
    <OnboardingWrapper>
      <div className="flex h-screen flex-col px-4 py-4 md:flex-row md:px-5 md:py-8">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col md:ml-5">
          <DashboardHeader />
          <main
            ref={mainRef}
            className="bg-primary/5 flex-1 overflow-y-auto scroll-smooth rounded-xl px-4 py-6 md:px-6 md:py-8"
          >
            <PendingPaymentBanner />
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
        <SupportBotButton />
      </div>
    </OnboardingWrapper>
  );
};

export default DashboardShell;
