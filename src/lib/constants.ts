import { LayoutDashboard, Bot, Users, PhoneCall, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  readonly href: string;
  readonly icon: LucideIcon;
  readonly label: string;
}

export const DASHBOARD_NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/agents", icon: Bot, label: "Agents" },
  { href: "/dashboard/contacts", icon: Users, label: "Contacts" },
  { href: "/dashboard/call-logs", icon: PhoneCall, label: "Call Logs" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
] as const satisfies readonly NavItem[];
