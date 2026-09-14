"use client";

import { Info, RefreshCw } from "lucide-react";

import { formatDateShort } from "@/lib/utils";

interface SubscriptionSectionProps {
  expiresAt: string | null;
}

export const SubscriptionSection = ({ expiresAt }: SubscriptionSectionProps) => {
  return (
    <section className="border-border bg-background rounded-2xl border p-6">
      <h2 className="text-muted-foreground mb-4 text-sm font-medium">Підписка</h2>

      <div className="border-border flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="bg-muted text-muted-foreground flex shrink-0 items-center justify-center rounded-lg px-5 py-3">
            <RefreshCw className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium">Автопродовження вимкнене</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {expiresAt
                ? `Доступ активний до ${formatDateShort(expiresAt)}. Кошти автоматично не списуються — наступний період потрібно оплатити вручну.`
                : "Кошти автоматично не списуються — наступний період потрібно оплатити вручну."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-lg bg-blue-50 p-3">
        <Info className="text-primary h-4 w-4 shrink-0" aria-hidden="true" />
        <p className="text-muted-foreground text-xs">
          Ми не списуємо кошти без вашого підтвердження. Щоб продовжити користування Сервісом,
          оплатіть тариф вручну до завершення поточного періоду.
        </p>
      </div>
    </section>
  );
};
