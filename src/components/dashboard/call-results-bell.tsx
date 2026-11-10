"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { useUnseenImportantCount } from "@dashboard/hooks";
import { CallResultsFeed } from "./call-results-feed";

const MAX_BADGE_COUNT = 99;

const formatBadge = (count: number): string =>
  count > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : String(count);

export const CallResultsBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: unseenImportant = 0 } = useUnseenImportantCount();

  const label =
    unseenImportant > 0
      ? `Результати дзвінків, потребують дії: ${unseenImportant}`
      : "Результати дзвінків";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        aria-label={label}
        className="border-border bg-background hover:bg-muted relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-colors"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unseenImportant > 0 && (
          <span
            aria-hidden="true"
            className="bg-destructive absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-semibold text-white"
          >
            {formatBadge(unseenImportant)}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[26rem] max-w-[calc(100vw-2rem)] gap-0 rounded-2xl p-0"
      >
        <CallResultsFeed onNavigate={() => setIsOpen(false)} />
      </PopoverContent>
    </Popover>
  );
};
