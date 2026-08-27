"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Plus } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

import {
  Button,
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { cn, getInitials } from "@/lib/utils";
import { DASHBOARD_NAV_ITEMS } from "@/lib/constants";
import { useLogout, useMe } from "@/lib/hooks";

export const DashboardHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: account } = useMe();
  const logout = useLogout();

  const isNavActive = (href: string): boolean => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = (): void => {
    logout.mutate(undefined, {
      onSettled: () => router.push("/sign-in"),
    });
  };

  const displayName = account?.name ?? "Користувач";
  const displayEmail = account?.email ?? "";
  const initials = getInitials(displayName);

  return (
    <header className="mb-6 flex">
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
                    active ? "bg-primary/5 text-primary" : "text-muted-foreground"
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

      <div className="hidden flex-1 md:block" />

      <div className="ml-auto flex items-center gap-6">
        <Link id="onboarding-create-agent-btn" href="/dashboard/agents/create">
          <Button className="rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Новий агент
          </Button>
        </Link>

        {/* TODO: real notifications will come from BE */}
        {/*<Button*/}
        {/*  variant="ghost"*/}
        {/*  size="icon"*/}
        {/*  className="text-muted-foreground h-9 w-9"*/}
        {/*  aria-label="Сповіщення"*/}
        {/*>*/}
        {/*  <Bell className="h-5 w-5" />*/}
        {/*</Button>*/}

        <DropdownMenu>
          <DropdownMenuTrigger
            className="bg-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-sm font-medium text-white focus:outline-none"
            aria-label="Меню користувача"
          >
            {initials}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-50 rounded-xl p-4">
            <div className="mb-2 p-1">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-muted-foreground truncate text-xs">{displayEmail}</p>
            </div>
            <DropdownMenuItem
              className="cursor-pointer text-gray-500"
              onClick={() => router.push("/dashboard/settings")}
            >
              Профіль
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-gray-500"
              onClick={() => router.push("/dashboard/billing")}
            >
              Тарифи і оплата
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-gray-500"
              onClick={handleLogout}
              disabled={logout.isPending}
            >
              Вийти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
