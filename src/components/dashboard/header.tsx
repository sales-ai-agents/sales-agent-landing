"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui";
import { BalancePill } from "./balance-pill";
import { CallResultsBell } from "./call-results-bell";
import { UserMenu } from "./user-menu";

export const DashboardHeader = () => (
  <header className="flex flex-wrap items-center justify-end gap-3 px-4 py-4 md:px-8">
    <BalancePill />
    <CallResultsBell />
    <Link
      id="onboarding-create-agent-btn"
      className={buttonVariants({ size: "default" })}
      href="/dashboard/agents/create"
    >
      <Plus aria-hidden="true" />
      <span>Новий агент</span>
    </Link>
    <UserMenu />
  </header>
);
