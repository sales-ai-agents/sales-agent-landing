"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV_ITEMS } from "@/lib/constants";
import { useLogout, useMe } from "@/lib/hooks/use-auth";

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: account } = useMe();
  const logout = useLogout();

  function isNavActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  }

  function handleLogout(): void {
    logout.mutate(undefined, {
      onSettled: () => {
        router.push("/sign-in");
      },
    });
  }

  const displayName = account?.name ?? account?.email ?? "Користувач";
  const displayEmail = account?.email ?? "";

  return (
    <header className="bg-background flex h-16 items-center justify-between border-b px-4">
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" aria-label="Відкрити меню">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetTitle>
            <div className="mb-6 flex items-center gap-2">
              <Image
                src="/image/Logo.svg"
                alt="Calls4U logo"
                width={32}
                height={32}
                className="h-auto w-auto"
              />
              <Image
                src="/image/calls4u.svg"
                alt="Calls4U"
                width={80}
                height={20}
                className="h-auto w-auto"
              />
            </div>
          </SheetTitle>
          <nav className="space-y-1">
            {DASHBOARD_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="md:hidden" />

      <div className="flex items-center gap-2">
        <div className="mr-2 hidden text-right sm:block">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-muted-foreground text-xs">{displayEmail}</p>
        </div>
        <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full">
          <User className="text-primary h-4 w-4" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          disabled={logout.isPending}
          aria-label="Вийти"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
