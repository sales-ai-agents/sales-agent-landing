"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Toggle,
  ToggleGroup,
} from "@/components/ui";
import { NUMBER_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { WEEKDAYS, WEEKDAY_LABELS, type Weekday } from "@/lib/schemas";
import { useUpdateNumber } from "@dashboard/hooks";
import type { AgentNumber } from "@dashboard/types";
import {
  HOUR_OPTIONS,
  buildNumberScheduleValues,
  formatHour,
  numberScheduleSchema,
  toNumberScheduleParams,
  type NumberScheduleFormData,
} from "../_lib/number-schedule";

interface NumberScheduleDialogProps {
  number: AgentNumber;
}

interface NumberScheduleFormProps extends NumberScheduleDialogProps {
  onSaved: () => void;
  onCancel: () => void;
}

const HOUR_FROM_ID = "number-hour-from";
const HOUR_TO_ID = "number-hour-to";
const DAILY_CAP_ID = "number-daily-cap";

const HourSelect = ({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-muted-foreground text-xs">
      {label}
    </Label>
    <Select value={String(value)} onValueChange={(next) => next !== null && onChange(Number(next))}>
      <SelectTrigger id={id} className="w-28">
        <SelectValue>
          {(selected: string | null) => formatHour(Number(selected ?? value))}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {HOUR_OPTIONS.map((hour) => (
          <SelectItem key={hour} value={String(hour)}>
            {formatHour(hour)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const NumberScheduleForm = ({ number, onSaved, onCancel }: NumberScheduleFormProps) => {
  const updateNumber = useUpdateNumber();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NumberScheduleFormData>({
    resolver: zodResolver(numberScheduleSchema),
    defaultValues: buildNumberScheduleValues(number),
  });

  const hasCustomHours = watch("hasCustomHours");

  const onSubmit = (data: NumberScheduleFormData): void => {
    updateNumber.mutate(
      { id: number.id, ...toNumberScheduleParams(data) },
      {
        onSuccess: () => {
          toast.success("Розклад номера збережено");
          onSaved();
        },
        onError: (error) => handleMutationError(error, NUMBER_ERROR_MESSAGES),
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
      <div className="space-y-3">
        <Controller
          control={control}
          name="hasCustomHours"
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm font-medium">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              Власні години
            </label>
          )}
        />
        {hasCustomHours ? (
          <div className="flex items-start gap-3">
            <Controller
              control={control}
              name="hourFrom"
              render={({ field }) => (
                <HourSelect
                  id={HOUR_FROM_ID}
                  label="З"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="hourTo"
              render={({ field }) => (
                <HourSelect
                  id={HOUR_TO_ID}
                  label="До"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        ) : (
          <p className="text-muted-foreground text-xs">Діють загальні години акаунта.</p>
        )}
        {errors.hourTo && (
          <p role="alert" className="text-destructive text-xs">
            {errors.hourTo.message}
          </p>
        )}
      </div>

      <Controller
        control={control}
        name="workingDays"
        render={({ field }) => (
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Робочі дні</legend>
            <ToggleGroup
              multiple
              aria-label="Робочі дні номера"
              value={field.value}
              onValueChange={(value) => field.onChange(value as Weekday[])}
            >
              {WEEKDAYS.map((day) => (
                <Toggle key={day} value={day} aria-label={WEEKDAY_LABELS[day]}>
                  {WEEKDAY_LABELS[day]}
                </Toggle>
              ))}
            </ToggleGroup>
            <p className="text-muted-foreground text-xs">
              Без вибраних днів обмежень по днях немає.
            </p>
          </fieldset>
        )}
      />

      <div className="space-y-1.5">
        <Label htmlFor={DAILY_CAP_ID}>Дзвінків на добу з номера</Label>
        <Input
          id={DAILY_CAP_ID}
          type="number"
          inputMode="numeric"
          min={0}
          className="w-32"
          aria-invalid={Boolean(errors.dailyCap)}
          {...register("dailyCap", { valueAsNumber: true })}
        />
        {errors.dailyCap ? (
          <p role="alert" className="text-destructive text-xs">
            {errors.dailyCap.message}
          </p>
        ) : (
          <p className="text-muted-foreground text-xs">0 означає без власної стелі.</p>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Скасувати
        </Button>
        <Button type="submit" disabled={updateNumber.isPending}>
          {updateNumber.isPending ? "Збереження..." : "Зберегти"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export const NumberScheduleDialog = ({ number }: NumberScheduleDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Розклад номера ${number.phone}`}
          />
        }
      >
        <Clock aria-hidden="true" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Розклад номера {number.phone}</DialogTitle>
          <DialogDescription>
            Години, дні та стеля стосуються вихідних дзвінків з цього номера. Вхідні приймаються
            цілодобово.
          </DialogDescription>
        </DialogHeader>
        <NumberScheduleForm
          number={number}
          onSaved={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
