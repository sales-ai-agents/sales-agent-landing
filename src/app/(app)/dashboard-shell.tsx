"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, DashboardHeader, PageLoading, SupportBotButton } from "@/components/dashboard";
import { OnboardingWrapper } from "@/components/dashboard/onboarding";
import { useMe } from "@/lib/hooks";

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
