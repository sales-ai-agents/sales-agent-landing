"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMe } from "@/hooks/use-auth";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: account, isLoading } = useMe();

  useEffect(() => {
    if (!isLoading && account) {
      router.replace("/dashboard");
    }
  }, [isLoading, account, router]);

  if (isLoading || account) return null;

  return (
    <div className="font-body">
      <main>{children}</main>
    </div>
  );
}
