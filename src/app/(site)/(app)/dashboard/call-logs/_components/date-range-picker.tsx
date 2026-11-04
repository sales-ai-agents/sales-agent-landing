"use client";

import { useState } from "react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { CalendarDays, X } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

export const DateRangePicker = ({ value, onChange }: DateRangePickerProps) => {
  const [draft, setDraft] = useState<DateRange | undefined>(value);

  const displayRange = draft ?? value;
  const hasSelection = Boolean(displayRange?.from);

  const label = displayRange?.from
    ? displayRange.to
      ? `${format(displayRange.from, "dd.MM.yyyy")} — ${format(displayRange.to, "dd.MM.yyyy")}`
      : format(displayRange.from, "dd.MM.yyyy")
    : "Оберіть період";

  const handleSelect = (range: DateRange | undefined) => {
    setDraft(range);

    if (range?.from && range?.to) {
      onChange(range);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setDraft(value);
    }
  };

  const handleClear = () => {
    setDraft(undefined);
    onChange(undefined);
  };

  return (
    <div className="flex items-center gap-1">
      <Popover onOpenChange={handleOpenChange}>
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              data-empty={!hasSelection}
              className="data-[empty=true]:text-muted-foreground aria-expanded:bg-card h-6 justify-start gap-2 p-0! text-left text-sm font-normal"
            />
          }
        >
          <CalendarDays className="size-3.5" />
          {label}
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
      {hasSelection && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleClear}
          aria-label="Очистити період"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  );
};
