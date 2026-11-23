"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Clock, LogOut, User, type LucideIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { getInitials } from "@/lib/utils";
import { useLogout, useMe } from "@/lib/hooks";

interface MenuLink {
  href: string;
  icon: LucideIcon;
  label: string;
}

const MENU_LINKS: readonly MenuLink[] = [
  { href: "/dashboard/settings", icon: User, label: "Профіль" },
  { href: "/dashboard/billing", icon: CreditCard, label: "Тарифи і оплата" },
  { href: "/dashboard/balance", icon: Clock, label: "Баланс" },
];

export const UserMenu = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { data: account } = useMe();
  const logout = useLogout();

  const goTo = (href: string): void => {
    setIsOpen(false);
    router.push(href);
  };

  const handleLogout = (): void => {
    logout.mutate(undefined, { onSettled: () => router.push("/sign-in") });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger aria-label="Меню користувача" className="cursor-pointer rounded-full">
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
            {getInitials(account?.name ?? "Користувач")}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-72 gap-1 rounded-3xl p-3">
        <div className="flex flex-col px-3 py-2">
          <b className="truncate">{account?.name ?? "Користувач"}</b>
          <span className="text-muted-foreground truncate text-sm">{account?.email ?? ""}</span>
        </div>
        {MENU_LINKS.map((link) => (
          <Button
            key={link.href}
            type="button"
            variant="ghost"
            className="justify-start"
            onClick={() => goTo(link.href)}
          >
            <link.icon aria-hidden="true" />
            {link.label}
          </Button>
        ))}
        <Button
          type="button"
          variant="destructive"
          className="justify-start"
          onClick={handleLogout}
          disabled={logout.isPending}
        >
          <LogOut aria-hidden="true" />
          Вийти
        </Button>
      </PopoverContent>
    </Popover>
  );
};
