"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { PageLoading } from "@/components/dashboard/page-states";
import { SupportBotButton } from "@/components/dashboard/support-bot-button";
import { OnboardingWrapper } from "@/components/dashboard/onboarding/onboarding-wrapper";
import { useMe } from "@/lib/hooks/use-auth";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const redirecting = useRef(false);
  const { data: account, isLoading } = useMe();

  useEffect(() => {
    if (!isLoading && !account && !redirecting.current) {
      redirecting.current = true;
      router.replace("/sign-in");
    }
  }, [isLoading, account, router]);

  if (isLoading || !account) return <PageLoading />;

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
}
