"use client";

import { Bell } from "lucide-react";
import { toast } from "sonner";

import { FilterSelect } from "@/components/dashboard";
import { handleMutationError } from "@/lib/mutation-error";
import { useUpdateBalanceAlert } from "@dashboard/hooks";
import type { AlertBelowUsd } from "@dashboard/types";

const ALERT_OFF: AlertBelowUsd = 0;
const ALERT_VALUES: readonly AlertBelowUsd[] = [0, 2, 5, 10];

const isAlertValue = (value: number): value is AlertBelowUsd =>
  (ALERT_VALUES as readonly number[]).includes(value);

interface LowBalanceAlertProps {
  current: number;
  options: number[];
}

export const LowBalanceAlert = ({ current, options }: LowBalanceAlertProps) => {
  const update = useUpdateBalanceAlert();
  const choices = options.filter(isAlertValue).map((value) => ({ value, label: `$${value}` }));

  const handleChange = (next: number): void => {
    if (!isAlertValue(next) || next === current) return;
    update.mutate(
      { alert_below_usd: next },
      {
        onSuccess: () => toast.success("Поріг сповіщення оновлено"),
        onError: (error) => handleMutationError(error),
      }
    );
  };

  return (
    <div className="border-border mt-auto flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm">
      <span className="text-muted-foreground flex items-center gap-2">
        <Bell className="size-4" aria-hidden="true" />
        Сповістити, коли на рахунку менше
      </span>
      <FilterSelect
        label="Поріг сповіщення про низький баланс"
        allLabel="Вимкнено"
        value={current === ALERT_OFF ? 0 : current}
        options={choices}
        onChange={handleChange}
      />
    </div>
  );
};
