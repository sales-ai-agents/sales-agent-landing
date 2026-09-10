"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { Info } from "lucide-react";

import { Input, Label, Toggle, ToggleGroup } from "@/components/ui";
import {
  CALLS_PER_DAY_OPTIONS,
  type CreateAgentFormData,
  WEEKDAYS,
  type Weekday,
} from "@/lib/schemas";
import { WEEKDAY_LABELS } from "./wizard";

interface StepScheduleProps {
  form: UseFormReturn<CreateAgentFormData>;
}

export const StepSchedule = ({ form }: StepScheduleProps) => {
  const { control, register } = form;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold">Розклад і ліміти дзвінків</h2>
        <p className="text-muted-foreground mt-1 max-w-xs text-sm">
          Налаштуйте, коли агент телефонуватиме та скільки контактів оброблятиме за день
        </p>
      </div>

      {/* BE not ready: no endpoint persists a per-agent schedule — campaigns run
          09:00–20:00 Kyiv on weekdays server-side. */}
      <fieldset className="space-y-2">
        <legend className="text-sm leading-none font-medium">Час прозвону</legend>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="schedule-start" className="text-muted-foreground text-xs">
              Початок
            </Label>
            <Input id="schedule-start" type="time" {...register("scheduleStart")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="schedule-end" className="text-muted-foreground text-xs">
              Кінець
            </Label>
            <Input id="schedule-end" type="time" {...register("scheduleEnd")} />
          </div>
        </div>
      </fieldset>

      <Controller
        control={control}
        name="workingDays"
        render={({ field }) => (
          <fieldset className="space-y-2">
            <legend className="text-sm leading-none font-medium">Робочі дні</legend>
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
            <legend className="text-sm leading-none font-medium">Кількість дзвінків на день</legend>
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
            <div className="bg-primary/5 text-muted-foreground mt-5 flex items-center gap-2 rounded-lg p-3 text-xs">
              <Info className="text-primary h-4 w-4 shrink-0" />
              <span>Скільки контактів із бази агент може обдзвонити за день</span>
            </div>
          </fieldset>
        )}
      />
    </div>
  );
};
