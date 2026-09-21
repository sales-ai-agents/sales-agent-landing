"use client";

import { Info, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Switch } from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import { formatDateShort } from "@/lib/utils";
import { useAutoRenew } from "@dashboard/hooks";
import type { AutoRenewState } from "@dashboard/types";

interface SubscriptionSectionProps {
  autoRenew: AutoRenewState;
  expiresAt: string | null;
}

export const SubscriptionSection = ({ autoRenew, expiresAt }: SubscriptionSectionProps) => {
  const mutation = useAutoRenew();
  const isEnabled = autoRenew.auto_renew;

  const handleToggle = (enabled: boolean) => {
    mutation.mutate(
      { enabled },
      {
        onSuccess: () =>
          toast.success(enabled ? "Автопродовження увімкнено." : "Автопродовження скасовано."),
        onError: (error) => {
          const message =
            error instanceof ApiError && error.message
              ? error.message
              : "Не вдалося змінити налаштування. Спробуйте пізніше.";
          toast.error(message);
        },
      }
    );
  };

  return (
    <section className="border-border bg-background rounded-2xl border p-6">
      <h2 className="text-muted-foreground mb-4 text-sm font-medium">Підписка</h2>

      <div className="border-border flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="bg-muted text-muted-foreground flex shrink-0 items-center justify-center rounded-lg px-5 py-3">
            <RefreshCw className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {isEnabled ? "Автопродовження увімкнене" : "Автопродовження вимкнене"}
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {buildDescription(autoRenew, expiresAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mutation.isPending && (
            <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggle}
            disabled={mutation.isPending}
            aria-label="Автопродовження тарифу"
          />
        </div>
      </div>

      {!autoRenew.auto_charge && (
        <div className="bg-primary/10 mt-4 flex items-center gap-3 rounded-lg p-3">
          <Info className="text-primary h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="text-muted-foreground text-xs">
            {isEnabled
              ? "Автопродовження увімкнене, але картка ще не збережена. Вона з'явиться після першої успішної оплати, і наступний період продовжиться автоматично."
              : "Кошти автоматично не списуються — наступний період потрібно оплатити вручну до завершення поточного."}
          </p>
        </div>
      )}
    </section>
  );
};

const buildDescription = (autoRenew: AutoRenewState, expiresAt: string | null): string => {
  const periodLabel = autoRenew.auto_renew_period === "year" ? "рік" : "місяць";

  if (autoRenew.auto_charge && autoRenew.next_charge_at) {
    return `Наступне списання ${formatDateShort(autoRenew.next_charge_at)} за поточним тарифом на ${periodLabel}.`;
  }

  if (expiresAt) {
    return `Доступ активний до ${formatDateShort(expiresAt)}.`;
  }

  return "Тариф продовжується автоматично за збереженою карткою.";
};
