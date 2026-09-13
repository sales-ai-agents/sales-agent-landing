"use client";

import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import { formatDateShort } from "@/lib/utils";
import { useDeletePaymentMethod } from "@dashboard/hooks";

interface SubscriptionSectionProps {
  hasSavedCard: boolean;
  autoCharge: boolean;
  expiresAt: string | null;
  isTrial: boolean;
}

export const SubscriptionSection = ({
  hasSavedCard,
  autoCharge,
  expiresAt,
  isTrial,
}: SubscriptionSectionProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const cancelAutoRenew = useDeletePaymentMethod();

  const autoRenewEnabled = hasSavedCard && autoCharge;

  const handleOpenChange = (open: boolean): void => {
    if (cancelAutoRenew.isPending) return;
    setIsConfirmOpen(open);
  };

  const handleCancel = (): void => {
    cancelAutoRenew.mutate(undefined, {
      onSuccess: () => {
        toast.success("Автопродовження скасовано. Доступ збережеться до кінця оплаченого періоду.");
        setIsConfirmOpen(false);
      },
      onError: (error) => {
        if (error instanceof ApiError && error.code === "no_card") {
          toast.error("Активного автопродовження не знайдено.");
          setIsConfirmOpen(false);
          return;
        }
        toast.error("Не вдалося скасувати автопродовження. Спробуйте пізніше.");
      },
    });
  };

  if (isTrial) return null;

  return (
    <section className="border-border bg-background rounded-2xl border p-6">
      <h2 className="text-muted-foreground mb-4 text-sm font-medium">Підписка</h2>

      <div className="border-border flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary flex shrink-0 items-center justify-center rounded-lg px-5 py-3">
            <RefreshCw className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {autoRenewEnabled ? "Автопродовження увімкнене" : "Автопродовження вимкнене"}
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {autoRenewEnabled
                ? expiresAt
                  ? `Наступне списання ${formatDateShort(expiresAt)}. Скасувати можна будь-коли.`
                  : "Підписка продовжується автоматично. Скасувати можна будь-коли."
                : "Наступний період потрібно оплатити вручну. Доступ активний до кінця оплаченого періоду."}
            </p>
          </div>
        </div>

        {autoRenewEnabled && (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10 shrink-0"
            onClick={() => setIsConfirmOpen(true)}
          >
            Скасувати автопродовження
          </Button>
        )}
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Скасувати автопродовження?</DialogTitle>
            <DialogDescription>
              {expiresAt
                ? `Доступ до Сервісу збережеться до кінця оплаченого періоду (${formatDateShort(
                    expiresAt
                  )}). Автоматичне списання не відбудеться — наступний період можна оплатити вручну.`
                : "Доступ до Сервісу збережеться до кінця оплаченого періоду. Автоматичне списання не відбудеться — наступний період можна оплатити вручну."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={cancelAutoRenew.isPending}
            >
              Залишити активним
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelAutoRenew.isPending}
              aria-busy={cancelAutoRenew.isPending}
            >
              {cancelAutoRenew.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              Скасувати автопродовження
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
