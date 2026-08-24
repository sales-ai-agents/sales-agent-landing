"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV_ITEMS } from "@/lib/constants";

export function Sidebar() {
  const pathname = usePathname();

  function isNavActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="bg-primary/5 hidden min-w-3xs flex-col rounded-3xl p-4 transition-all duration-200 md:flex">
      <div className="flex h-16 items-center gap-4">
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

      <nav id="onboarding-sidebar-nav" className="mt-10 flex flex-1 flex-col space-y-3">
        {DASHBOARD_NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const active = isNavActive(item.href);
          const isLast = index === DASHBOARD_NAV_ITEMS.length - 1;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isLast && "mt-auto",
                active
                  ? "bg-background text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground hover:bg-background"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
