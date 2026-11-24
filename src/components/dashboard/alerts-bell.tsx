"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";

import { Button, Popover, PopoverContent, PopoverTrigger, buttonVariants } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useAlerts, useMarkAlertsSeen } from "@dashboard/hooks";
import type { AlertItem, AlertLevel, AlertsResponse } from "@dashboard/types";

const LEVEL_DOT: Record<AlertLevel, string> = {
  bad: "bg-destructive",
  warn: "bg-amber-500",
  info: "bg-blue-500",
};

const LINK_PATHS: Record<string, string> = {
  calls: "/dashboard/call-logs",
  "calls?status=attention": "/dashboard/call-logs?status=attention",
  integrations: "/dashboard/integrations",
  billing: "/dashboard/billing",
  balance: "/dashboard/billing/balance",
  profile: "/dashboard/settings",
};

const AlertRow = ({ item, onNavigate }: { item: AlertItem; onNavigate: () => void }) => {
  const href = LINK_PATHS[item.link] ?? "/dashboard";
  const relativeTime = item.at
    ? formatDistanceToNow(new Date(item.at), { addSuffix: true, locale: uk })
    : null;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "hover:bg-muted flex items-start gap-3 rounded-2xl px-3 py-2.5 transition-colors",
        !item.unread && "opacity-60"
      )}
    >
      <span
        aria-hidden="true"
        className={cn("mt-1.5 size-2 shrink-0 rounded-full", LEVEL_DOT[item.level])}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <b className="truncate text-sm">{item.title}</b>
          {relativeTime && (
            <time className="text-muted-foreground shrink-0 text-xs">{relativeTime}</time>
          )}
        </div>
        <p className="text-muted-foreground truncate text-sm">{item.text}</p>
      </div>
      {item.unread && <span className="sr-only">Непрочитано</span>}
    </Link>
  );
};

const AlertsFeed = ({
  data,
  isLoading,
  error,
  onRefetch,
  onNavigate,
}: {
  data: AlertsResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  onRefetch: () => void;
  onNavigate: () => void;
}) => {
  const markSeen = useMarkAlertsSeen();
  const items = data?.items ?? [];
  const unreadCount = data?.unread ?? 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <b className="font-heading text-lg">Сповіщення</b>
        <Button
          type="button"
          variant="link"
          size="xs"
          disabled={markSeen.isPending || unreadCount === 0}
          onClick={() => markSeen.mutate(undefined)}
        >
          Позначити всі прочитаними
        </Button>
      </div>

      <div className="flex max-h-[26rem] flex-col overflow-y-auto">
        {isLoading && <p className="text-muted-foreground p-3 text-sm">Завантажуємо...</p>}
        {error && (
          <p className="text-muted-foreground p-3 text-sm">
            Не вдалося завантажити.{" "}
            <Button type="button" variant="link" size="xs" onClick={onRefetch}>
              Спробувати ще раз
            </Button>
          </p>
        )}
        {!isLoading && !error && items.length === 0 && (
          <p className="text-muted-foreground p-3 text-center text-sm">Сповіщень немає</p>
        )}
        {items.map((item) => (
          <AlertRow key={item.key} item={item} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
};

export const AlertsBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, error, refetch } = useAlerts();
  const unread = data?.unread ?? 0;
  const label = unread > 0 ? `Сповіщення: ${unread} непрочитаних` : "Сповіщення";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        aria-label={label}
        className={cn(buttonVariants({ variant: "outline", size: "icon" }), "relative")}
      >
        <Bell aria-hidden="true" />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="bg-destructive ring-card absolute top-2 right-2.5 size-2 rounded-full ring-2"
          />
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[26rem] max-w-[calc(100vw-2rem)] gap-0 rounded-3xl p-4"
      >
        <AlertsFeed
          data={data}
          isLoading={isLoading}
          error={error}
          onRefetch={refetch}
          onNavigate={() => setIsOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
};
