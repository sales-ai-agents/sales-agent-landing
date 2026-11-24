"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
  buttonVariants,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import { useAlerts, useMarkAlertsSeen, useUnseenImportantCount } from "@dashboard/hooks";
import type { AlertItem, AlertLevel, AlertsResponse } from "@dashboard/types";
import { CallResultsFeed } from "./call-results-feed";

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
          {item.at && (
            <time className="text-muted-foreground shrink-0 text-xs">
              {formatRelativeTime(item.at)}
            </time>
          )}
        </div>
        <p className="text-muted-foreground truncate text-sm">{item.text}</p>
      </div>
      {item.unread && <span className="sr-only">Непрочитано</span>}
    </Link>
  );
};

const SystemAlertsFeed = ({
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
      <div className="flex max-h-[22rem] flex-col overflow-y-auto">
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
  const [tab, setTab] = useState<"alerts" | "results">("alerts");

  const { data, isLoading, error, refetch } = useAlerts();
  const { data: unseenImportant = 0 } = useUnseenImportantCount();

  const alertsUnread = data?.unread ?? 0;
  const totalBadge = alertsUnread + unseenImportant;
  const label = totalBadge > 0 ? `Сповіщення: ${totalBadge} непрочитаних` : "Сповіщення";

  const close = () => setIsOpen(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        aria-label={label}
        className={cn(buttonVariants({ variant: "outline", size: "icon" }), "relative")}
      >
        <Bell aria-hidden="true" />
        {totalBadge > 0 && (
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
        <div className="flex flex-col gap-3">
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList aria-label="Розділ сповіщень">
              <TabsTrigger value="alerts">
                Системні
                {alertsUnread > 0 && (
                  <span className="bg-destructive text-destructive-foreground ml-1.5 rounded-full px-1.5 py-0.5 text-xs tabular-nums">
                    {alertsUnread}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="results">
                Результати дзвінків
                {unseenImportant > 0 && (
                  <span className="bg-primary text-primary-foreground ml-1.5 rounded-full px-1.5 py-0.5 text-xs tabular-nums">
                    {unseenImportant}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {tab === "alerts" ? (
            <SystemAlertsFeed
              data={data}
              isLoading={isLoading}
              error={error}
              onRefetch={refetch}
              onNavigate={close}
            />
          ) : (
            <CallResultsFeed onNavigate={close} />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
