"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";

interface TimeFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const MINUTE_STEP = 5;
const TIME_SEPARATOR = ":";

const pad = (value: number): string => String(value).padStart(2, "0");

const HOUR_OPTIONS = Array.from({ length: HOURS_IN_DAY }, (_, hour) => pad(hour));
const MINUTE_OPTIONS = Array.from({ length: MINUTES_IN_HOUR / MINUTE_STEP }, (_, index) =>
  pad(index * MINUTE_STEP)
);

const splitTime = (value: string): [hours: string, minutes: string] => {
  const [hours = "", minutes = ""] = value.split(TIME_SEPARATOR);
  return [hours, minutes];
};

const withCurrentOption = (options: string[], current: string): string[] =>
  current && !options.includes(current) ? [...options, current].sort() : options;

export const TimeField = ({ id, label, value, onChange }: TimeFieldProps) => {
  const [hours, minutes] = splitTime(value);

  const handleHoursChange = (next: string | null): void => {
    if (next) onChange(`${next}${TIME_SEPARATOR}${minutes || "00"}`);
  };

  const handleMinutesChange = (next: string | null): void => {
    if (next) onChange(`${hours || "00"}${TIME_SEPARATOR}${next}`);
  };

  return (
    <div role="group" aria-label={label} className="flex items-center gap-1.5">
      <Select value={hours || null} onValueChange={handleHoursChange}>
        <SelectTrigger id={id} className="w-20" aria-label={`${label}, години`}>
          <SelectValue placeholder="ГГ" />
        </SelectTrigger>
        <SelectContent>
          {HOUR_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-muted-foreground" aria-hidden="true">
        {TIME_SEPARATOR}
      </span>

      <Select value={minutes || null} onValueChange={handleMinutesChange}>
        <SelectTrigger className="w-20" aria-label={`${label}, хвилини`}>
          <SelectValue placeholder="ХХ" />
        </SelectTrigger>
        <SelectContent>
          {withCurrentOption(MINUTE_OPTIONS, minutes).map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
