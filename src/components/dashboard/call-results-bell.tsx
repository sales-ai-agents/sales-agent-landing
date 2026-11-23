"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger, buttonVariants } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useUnseenImportantCount } from "@dashboard/hooks";
import { CallResultsFeed } from "./call-results-feed";

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
        className={cn(buttonVariants({ variant: "outline", size: "icon" }), "relative")}
      >
        <Bell aria-hidden="true" />
        {unseenImportant > 0 && (
          <span
            aria-hidden="true"
            className="bg-primary ring-card absolute top-2 right-2.5 size-2 rounded-full ring-2"
          />
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[26rem] max-w-[calc(100vw-2rem)] gap-0 rounded-3xl p-4"
      >
        <CallResultsFeed onNavigate={() => setIsOpen(false)} />
      </PopoverContent>
    </Popover>
  );
};
