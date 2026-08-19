"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMe } from "@/hooks/use-auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: account, isLoading, isFetched } = useMe();

  useEffect(() => {
    if (isFetched && !account) {
      router.replace("/sign-in");
    }
  }, [isFetched, account, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  if (!account) return null;

  return <>{children}</>;
}
