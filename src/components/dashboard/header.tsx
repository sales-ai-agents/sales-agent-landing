"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui";
import { AlertsBell } from "./alerts-bell";
import { BalancePill } from "./balance-pill";
import { UserMenu } from "./user-menu";

export const DashboardHeader = () => (
  <header className="flex flex-wrap items-center justify-end gap-3 px-4 py-4 md:px-8">
    <BalancePill />
    <AlertsBell />
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
