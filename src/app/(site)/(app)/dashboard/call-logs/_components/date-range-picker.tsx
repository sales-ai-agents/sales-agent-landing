"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

import { Clock, X } from "lucide-react";
import {
  Button,
  buttonVariants,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

const DISPLAY_FORMAT = "dd.MM.yyyy";

export const DateRangePicker = ({ value, onChange }: DateRangePickerProps) => {
  const [draft, setDraft] = useState<DateRange | undefined>(value);
  const displayRange = draft ?? value;
  const hasSelection = Boolean(displayRange?.from);
  const label = displayRange?.from
    ? displayRange.to
      ? `${format(displayRange.from, DISPLAY_FORMAT)} - ${format(displayRange.to, DISPLAY_FORMAT)}`
      : format(displayRange.from, DISPLAY_FORMAT)
    : "Оберіть період";

  const handleSelect = (range: DateRange | undefined) => {
    setDraft(range);
    if (range?.from && range?.to) onChange(range);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) setDraft(value);
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setDraft(undefined);
    onChange(undefined);
  };

  return (
    <div className="flex items-center gap-1.5">
      <Popover onOpenChange={handleOpenChange}>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 w-full justify-between rounded-xl px-4 font-normal",
            !hasSelection && "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <Clock aria-hidden="true" />
            {label}
          </div>
          {hasSelection && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleClear}
              aria-label="Очистити період"
              className="z-100"
            >
              <X aria-hidden="true" />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto">
          <Calendar
            mode="range"
            resetOnSelect
            defaultMonth={displayRange?.from}
            selected={draft}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={uk}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
