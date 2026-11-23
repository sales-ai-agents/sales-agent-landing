"use client";

import React from "react";
import { usePathname } from "next/navigation";

import { AuthMarketingPanel } from "@/components/auth/auth-marketing-panel";

const MARKETING_PANEL_VARIANTS: Record<
  string,
  "sign-in" | "sign-up" | "forgot-password" | "email-confirm" | "verified"
> = {
  "/sign-up": "sign-up",
  "/forgot-password": "forgot-password",
  "/email-confirm": "email-confirm",
  "/email-confirmed": "verified",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/auth/")) {
    return <main className="font-body min-h-screen">{children}</main>;
  }

  const variant = MARKETING_PANEL_VARIANTS[pathname] ?? "sign-in";

  return (
    <div className="bg-ground flex min-h-screen items-center justify-center p-4 md:p-8">
      <div className="bg-card grid w-full max-w-5xl overflow-hidden rounded-4xl shadow-sm lg:grid-cols-2">
        <AuthMarketingPanel variant={variant} />
        <main className="flex items-center justify-center px-6 py-10 md:px-12">{children}</main>
      </div>
    </div>
  );
}
