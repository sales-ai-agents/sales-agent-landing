"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { DASHBOARD_NAV_ITEMS, DASHBOARD_SETTINGS_ITEM, type NavItem } from "@/lib/constants";
import { cn, pluralizeDays } from "@/lib/utils";
import { useBillingPlans } from "@dashboard/hooks";

const isNavActive = (pathname: string, href: string): boolean => {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
};

const NavLink = ({ item, pathname }: { item: NavItem; pathname: string }) => {
  const isActive = isNavActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      id={item.href === "/dashboard" ? "onboarding-dashboard-header" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <item.icon className="size-5 shrink-0" aria-hidden="true" />
      {item.label}
    </Link>
  );
};

const PlanMini = () => {
  const { data: billing } = useBillingPlans();
  const isTrial = billing?.current === "trial";
  const currentTitle = billing?.plans.find((plan) => plan.key === billing.current)?.title;
  const daysLeft = billing?.days_left;
  const heading = (() => {
    if (!billing) return "—";
    if (!isTrial) return currentTitle ?? billing.current;
    if (daysLeft != null && daysLeft >= 0)
      return `${daysLeft} ${pluralizeDays(daysLeft)} безкоштовно`;
    return "Пробний період";
  })();
  return (
    <div className="bg-primary flex flex-col gap-1 rounded-3xl p-4">
      <span className="caption text-primary-foreground">Тариф</span>
      <b className="font-heading text-primary-foreground text-lg">{heading}</b>
      <Link
        href="/dashboard/billing"
        className="text-primary-foreground mt-1 inline-flex items-center gap-1 text-sm font-medium hover:underline"
      >
        {isTrial ? "Обрати тариф" : "Змінити тариф"}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
};

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="bg-card sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 p-5 md:flex">
      <Link href="/dashboard" className="flex h-10 items-center gap-3 px-2" aria-label="Calls4U">
        <Image src="/image/Logo.svg" alt="Calls4U" width={30} height={30} />
        <Image src="/image/calls4u.svg" alt="calls4u" width={80} height={19} />
      </Link>
      <nav
        id="onboarding-sidebar-nav"
        className="flex flex-col gap-1"
        aria-label="Розділи кабінету"
      >
        {DASHBOARD_NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>
      <nav className="mt-auto flex flex-col gap-1" aria-label="Акаунт">
        <NavLink item={DASHBOARD_SETTINGS_ITEM} pathname={pathname} />
      </nav>
      <PlanMini />
    </aside>
  );
};
