"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { DASHBOARD_NAV_ITEMS, DASHBOARD_SETTINGS_ITEM } from "@/lib/constants";
import { useStats } from "@dashboard/hooks/use-stats";

export function Sidebar() {
  const pathname = usePathname();
  const { data: stats } = useStats();

  function isNavActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  }

  const planLabel = stats?.plan ?? "trial";
  const isTrialPlan = planLabel === "trial";

  return (
    <aside className="bg-primary/5 hidden w-56 shrink-0 flex-col rounded-3xl p-4 transition-all duration-200 md:flex">
      <div className="flex h-10 items-center gap-3 px-1">
        <Image
          src="/image/Logo.svg"
          alt="Calls4u.ai"
          width={32}
          height={32}
          className="h-auto w-auto shrink-0"
        />
        <Image
          src="/image/calls4u.svg"
          alt="Calls4u.ai"
          width={80}
          height={18}
          className="h-auto w-auto"
        />
      </div>

      <nav className="mt-10 flex flex-1 flex-col">
        <div className="space-y-1">
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 rounded-xl px-3 py-2 text-sm font-normal transition-colors",
                  active
                    ? "text-primary bg-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-white"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto">
          <Link
            href={DASHBOARD_SETTINGS_ITEM.href}
            className={cn(
              "flex items-center gap-4 rounded-xl px-3 py-2 text-sm font-normal transition-colors",
              isNavActive(DASHBOARD_SETTINGS_ITEM.href)
                ? "text-primary bg-white"
                : "text-muted-foreground hover:text-foreground hover:bg-white"
            )}
          >
            <DASHBOARD_SETTINGS_ITEM.icon className="h-5 w-5 shrink-0" />
            <span>{DASHBOARD_SETTINGS_ITEM.label}</span>
          </Link>
        </div>
      </nav>

      <div className="border-muted-foreground/30 mt-4 rounded-xl border bg-white p-3">
        <p className="text-muted-foreground text-xs font-normal uppercase">Тариф</p>
        {isTrialPlan ? (
          <>
            <p className="mt-1 text-sm font-bold tracking-tight uppercase">3 дні безкоштовно</p>
            <Link
              href="/dashboard/billing"
              className="text-primary mt-2 flex items-center gap-1 text-xs font-medium"
            >
              Обрати тариф
              <ArrowRight className="h-3 w-3" />
            </Link>
          </>
        ) : (
          <>
            <p className="mt-1 text-lg font-semibold tracking-tight uppercase">{planLabel}</p>
            <Link
              href="/dashboard/billing"
              className="text-primary mt-2 flex items-center gap-1 text-xs font-medium"
            >
              Тариф і оплата
              <ArrowRight className="h-3 w-3" />
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}
