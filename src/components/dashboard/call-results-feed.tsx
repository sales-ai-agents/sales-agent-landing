"use client";

import { useState } from "react";
import Link from "next/link";

import { Button, Skeleton } from "@/components/ui";
import { useAccountTimeZone } from "@/lib/hooks";
import { cn, formatTime } from "@/lib/utils";
import { useCallResultsFeed, useMarkResultsSeen } from "@dashboard/hooks";
import type { CallResultItem } from "@dashboard/types";
import { CallResultIcon } from "./call-result-icon";

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
  <li>
    <Link
      href={`/dashboard/call-logs/${item.call_id}`}
      onClick={() => onOpen(item)}
      className={cn(
        "hover:bg-muted/50 flex items-start gap-3 px-4 py-3 transition-colors",
        !item.seen && "bg-primary/5"
      )}
    >
      <CallResultIcon type={item.result.type} />
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm leading-snug", !item.seen && "font-semibold")}>
          {item.result.title}
        </p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {[item.agent_name, formatTime(item.created_at, timeZone), item.phone]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
      {!item.seen && (
        <span className="bg-primary mt-1.5 h-2 w-2 shrink-0 rounded-full">
          <span className="sr-only">Не переглянуто</span>
        </span>
      )}
    </Link>
  </li>
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
    <div className="flex flex-col">
      <div className="space-y-3 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Результати дзвінків</h2>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0"
            disabled={markSeen.isPending || unseenCount === 0}
            onClick={() => markSeen.mutate({ all: true })}
          >
            Позначити всі прочитаними
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={unseenOnly ? "outline" : "default"}
            aria-pressed={!unseenOnly}
            className="rounded-full"
            onClick={() => setUnseenOnly(false)}
          >
            Усі
          </Button>
          <Button
            type="button"
            size="sm"
            variant={unseenOnly ? "default" : "outline"}
            aria-pressed={unseenOnly}
            className="rounded-full"
            onClick={() => setUnseenOnly(true)}
          >
            Непрочитані · {unseenCount}
          </Button>
        </div>
      </div>

      <div className="border-border max-h-[28rem] overflow-y-auto border-t">
        {feed.isLoading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: SKELETON_ROWS }, (_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        )}

        {feed.error && (
          <div className="space-y-2 p-4">
            <p className="text-destructive text-sm">Не вдалося завантажити результати</p>
            <Button type="button" variant="outline" size="sm" onClick={() => feed.refetch()}>
              Спробувати ще раз
            </Button>
          </div>
        )}

        {!feed.isLoading && !feed.error && items.length === 0 && (
          <p className="text-muted-foreground p-6 text-center text-sm">
            {unseenOnly ? "Непрочитаних результатів немає" : "Результатів поки немає"}
          </p>
        )}

        {items.length > 0 && (
          <ul className="divide-border divide-y">
            {items.map((item) => (
              <FeedItem key={item.call_id} item={item} timeZone={timeZone} onOpen={handleOpen} />
            ))}
          </ul>
        )}
      </div>

      {feed.hasNextPage && (
        <div className="border-border flex justify-center border-t p-3">
          <Button
            type="button"
            variant="outline"
            disabled={feed.isFetchingNextPage}
            onClick={() => feed.fetchNextPage()}
          >
            {feed.isFetchingNextPage ? "Завантажуємо..." : "Показати ще"}
          </Button>
        </div>
      )}
    </div>
  );
};
