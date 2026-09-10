"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { Input, Label, Toggle, ToggleGroup } from "@/components/ui";
import {
  CALLS_PER_DAY_OPTIONS,
  WEEKDAYS,
  type EditAgentFormData,
  type Weekday,
  WEEKDAY_LABELS,
} from "@/lib/schemas";

interface SectionScheduleProps {
  form: UseFormReturn<EditAgentFormData>;
}

export const SectionSchedule = ({ form }: SectionScheduleProps) => {
  const { control, register } = form;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Розклад і ліміти дзвінків</h2>

      {/* BE not ready: no endpoint persists a per-agent schedule — campaigns run
          09:00–20:00 Kyiv on weekdays server-side. */}
      <div className="grid gap-6 lg:grid-cols-[auto_1fr_auto]">
        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm">Час прозвону</legend>
          <div className="flex items-center gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="schedule-start" className="sr-only">
                Початок
              </Label>
              <Input
                id="schedule-start"
                type="time"
                {...register("scheduleStart")}
                className="w-28"
              />
            </div>
            <span className="text-muted-foreground">-</span>
            <div className="space-y-1.5">
              <Label htmlFor="schedule-end" className="sr-only">
                Кінець
              </Label>
              <Input id="schedule-end" type="time" {...register("scheduleEnd")} className="w-28" />
            </div>
          </div>
        </fieldset>

        <Controller
          control={control}
          name="workingDays"
          render={({ field }) => (
            <fieldset className="space-y-2">
              <legend className="mb-2 text-sm">Робочі дні</legend>
              <ToggleGroup
                multiple
                aria-label="Робочі дні"
                value={field.value}
                onValueChange={(value) => field.onChange(value as Weekday[])}
              >
                {WEEKDAYS.map((day) => (
                  <Toggle key={day} value={day} aria-label={WEEKDAY_LABELS[day]}>
                    {WEEKDAY_LABELS[day]}
                  </Toggle>
                ))}
              </ToggleGroup>
            </fieldset>
          )}
        />

        <Controller
          control={control}
          name="callsPerDay"
          render={({ field }) => (
            <fieldset className="space-y-2">
              <legend className="mb-2 text-sm">Кількість дзвінків на день</legend>
              <ToggleGroup
                aria-label="Кількість дзвінків на день"
                value={[String(field.value)]}
                onValueChange={(value) => {
                  const next = value.at(-1);
                  if (next) field.onChange(Number(next));
                }}
              >
                {CALLS_PER_DAY_OPTIONS.map((option) => (
                  <Toggle key={option} value={String(option)} variant="soft">
                    {option}
                  </Toggle>
                ))}
              </ToggleGroup>
            </fieldset>
          )}
        />
      </div>
    </section>
  );
};
