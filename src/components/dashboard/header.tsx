"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, LogOut, User, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { LayoutDashboard, Bot, Users, PhoneCall, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  readonly href: string;
  readonly icon: LucideIcon;
  readonly label: string;
}

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/agents", icon: Bot, label: "Agents" },
  { href: "/dashboard/contacts", icon: Users, label: "Contacts" },
  { href: "/dashboard/call-logs", icon: PhoneCall, label: "Call Logs" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
] as const satisfies readonly NavItem[];

export function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="bg-background flex h-16 items-center justify-between border-b px-4">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetTitle>
            <div className="mb-6 flex items-center gap-2">
              <Phone className="text-primary h-6 w-6" />
              <span className="text-lg font-bold">VoiceAgent</span>
            </div>
          </SheetTitle>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
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

      {/* User menu */}
      <div className="flex items-center gap-2">
        <div className="mr-2 hidden text-right sm:block">
          <p className="text-sm font-medium">John Smith</p>
          <p className="text-muted-foreground text-xs">demo@voiceagent.ai</p>
        </div>
        <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full">
          <User className="text-primary h-4 w-4" />
        </div>
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} title="Log out">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
