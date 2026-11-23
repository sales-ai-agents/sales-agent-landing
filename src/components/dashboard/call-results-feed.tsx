"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Skeleton, Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { useAccountTimeZone } from "@/lib/hooks";
import { cn, formatTime } from "@/lib/utils";
import { useCallResultsFeed, useMarkResultsSeen } from "@dashboard/hooks";
import type { CallResultItem } from "@dashboard/types";

interface CallResultsFeedProps {
  onNavigate: () => void;
}

interface FeedItemProps {
  item: CallResultItem;
  timeZone: string | undefined;
  onOpen: (item: CallResultItem) => void;
}

const SKELETON_ROWS = 4;

const FeedItem = ({ item, timeZone, onOpen }: FeedItemProps) => (
  <Link
    href={`/dashboard/call-logs/${item.call_id}`}
    onClick={() => onOpen(item)}
    className={cn(
      "hover:bg-muted flex items-start gap-3 rounded-2xl px-3 py-2.5 transition-colors",
      item.seen && "opacity-70"
    )}
  >
    <span
      aria-hidden="true"
      className={cn(
        "mt-1.5 size-2 shrink-0 rounded-full",
        item.seen ? "bg-muted-foreground/40" : "bg-primary"
      )}
    />
    <div className="min-w-0 flex-1">
      <div className="flex items-baseline justify-between gap-2">
        <b className="truncate text-sm">{item.result.title}</b>
        <time className="text-muted-foreground shrink-0 text-xs">
          {formatTime(item.created_at, timeZone)}
        </time>
      </div>
      <p className="text-muted-foreground truncate text-sm">
        {[item.agent_name, item.phone].filter(Boolean).join(" · ")}
      </p>
    </div>
    {!item.seen && <span className="sr-only">Не переглянуто</span>}
  </Link>
);

export const CallResultsFeed = ({ onNavigate }: CallResultsFeedProps) => {
  const [unseenOnly, setUnseenOnly] = useState(false);
  const feed = useCallResultsFeed(unseenOnly, true);
  const markSeen = useMarkResultsSeen();
  const timeZone = useAccountTimeZone();
  const items = feed.data?.pages.flatMap((page) => page.items) ?? [];
  const unseenCount = feed.data?.pages[0]?.unseen ?? 0;

  const handleOpen = (item: CallResultItem): void => {
    if (!item.seen) markSeen.mutate({ call_ids: [item.call_id] });
    onNavigate();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <b className="font-heading text-lg">Результати дзвінків</b>
        <Button
          type="button"
          variant="link"
          size="xs"
          disabled={markSeen.isPending || unseenCount === 0}
          onClick={() => markSeen.mutate({ all: true })}
        >
          Позначити всі прочитаними
        </Button>
      </div>
      <Tabs
        value={unseenOnly ? "unseen" : "all"}
        onValueChange={(value) => setUnseenOnly(value === "unseen")}
      >
        <TabsList aria-label="Фільтр результатів">
          <TabsTrigger value="all">Усі</TabsTrigger>
          <TabsTrigger value="unseen">Непрочитані · {unseenCount}</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex max-h-[26rem] flex-col overflow-y-auto">
        {feed.isLoading &&
          Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <Skeleton key={index} className="mb-2 h-12 rounded-2xl" />
          ))}
        {feed.error && (
          <p className="text-muted-foreground p-3 text-sm">
            Не вдалося завантажити результати.{" "}
            <Button type="button" variant="link" size="xs" onClick={() => feed.refetch()}>
              Спробувати ще раз
            </Button>
          </p>
        )}
        {!feed.isLoading && !feed.error && items.length === 0 && (
          <p className="text-muted-foreground p-3 text-center text-sm">
            {unseenOnly ? "Непрочитаних результатів немає" : "Результатів поки немає"}
          </p>
        )}
        {items.map((item) => (
          <FeedItem key={item.call_id} item={item} timeZone={timeZone} onOpen={handleOpen} />
        ))}
      </div>
      {feed.hasNextPage && (
        <Button
          type="button"
          variant="ghost"
          disabled={feed.isFetchingNextPage}
          onClick={() => feed.fetchNextPage()}
        >
          {feed.isFetchingNextPage ? "Завантажуємо..." : "Показати ще"}
        </Button>
      )}
    </div>
  );
};
