"use client";

import { useState } from "react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [draft, setDraft] = useState<DateRange | undefined>(value);

  const displayRange = draft ?? value;

  const label = displayRange?.from
    ? displayRange.to
      ? `${format(displayRange.from, "dd.MM.yyyy")} — ${format(displayRange.to, "dd.MM.yyyy")}`
      : format(displayRange.from, "dd.MM.yyyy")
    : "Оберіть період";

  function handleSelect(range: DateRange | undefined) {
    setDraft(range);

    if (range?.from && range?.to) {
      onChange(range);
    }
  }

  function handleOpenChange(open: boolean) {
    if (open) {
      setDraft(value);
    }
  }

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            data-empty={!displayRange?.from}
            className="data-[empty=true]:text-muted-foreground h-6 justify-start gap-2 p-0! text-left text-sm font-normal aria-expanded:bg-white"
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
  );
}
