"use client";

import React from "react";
import { usePathname } from "next/navigation";

import { AuthMarketingPanel } from "@/components/auth/auth-marketing-panel";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const variant = pathname === "/sign-up" ? "sign-up" : "sign-in";

  if (pathname.startsWith("/auth/")) {
    return <main className="font-body min-h-screen">{children}</main>;
  }

  return (
    <div className="font-body flex min-h-screen">
      <aside className="hidden lg:flex lg:w-1/2 xl:w-5/12">
        <AuthMarketingPanel variant={variant} />
      </aside>
      <main className="flex w-full items-center justify-center px-4 py-8 lg:w-1/2 xl:w-7/12">
        {children}
      </main>
    </div>
  );
}
