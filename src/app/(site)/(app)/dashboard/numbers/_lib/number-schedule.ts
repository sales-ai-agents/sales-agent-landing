import { z } from "zod";

import { WEEKDAYS, parseWorkingDays } from "@/lib/schemas";
import type { AgentNumber, UpdateNumberParams } from "@dashboard/types";

export const HOURS_IN_DAY = 24;

export const HOUR_OPTIONS = Array.from({ length: HOURS_IN_DAY + 1 }, (_, hour) => hour);

const DEFAULT_HOUR_FROM = 9;
const DEFAULT_HOUR_TO = 18;
const NO_CUSTOM_HOURS = 0;

export const numberScheduleSchema = z
  .object({
    hasCustomHours: z.boolean(),
    hourFrom: z.number().int().min(0).max(HOURS_IN_DAY),
    hourTo: z.number().int().min(0).max(HOURS_IN_DAY),
    workingDays: z.array(z.enum(WEEKDAYS)),
    dailyCap: z
      .number({ error: "Вкажіть число від 0" })
      .int("Вкажіть ціле число")
      .min(0, "Не менше 0"),
  })
  .refine(({ hasCustomHours, hourFrom, hourTo }) => !hasCustomHours || hourFrom < hourTo, {
    path: ["hourTo"],
    message: "Початок має бути раніше за кінець",
  });

export type NumberScheduleFormData = z.infer<typeof numberScheduleSchema>;

export const formatHour = (hour: number): string => `${String(hour).padStart(2, "0")}:00`;

export const hasCustomHours = ({ hour_from: hourFrom, hour_to: hourTo }: AgentNumber): boolean =>
  hourFrom > 0 || hourTo > 0;

export const buildNumberScheduleValues = (number: AgentNumber): NumberScheduleFormData => {
  const isCustom = hasCustomHours(number);

  return {
    hasCustomHours: isCustom,
    hourFrom: isCustom ? number.hour_from : DEFAULT_HOUR_FROM,
    hourTo: isCustom ? number.hour_to : DEFAULT_HOUR_TO,
    workingDays: parseWorkingDays(number.working_days),
    dailyCap: number.daily_cap,
  };
};

export const toNumberScheduleParams = (data: NumberScheduleFormData): UpdateNumberParams => ({
  hour_from: data.hasCustomHours ? data.hourFrom : NO_CUSTOM_HOURS,
  hour_to: data.hasCustomHours ? data.hourTo : NO_CUSTOM_HOURS,
  working_days: data.workingDays,
  daily_cap: data.dailyCap,
});
