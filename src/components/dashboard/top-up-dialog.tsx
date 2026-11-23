"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/components/ui";
import {
  SAVE_INVOICE_ERROR,
  buildBillingReturnUrl,
  savePendingBillingPayment,
} from "@/lib/billing-checkout";
import { formatUsd } from "@/lib/utils";
import { SecureNote } from "@/components/dashboard/change-plan/confirm-step";
import { resolveCheckoutErrorMessage } from "@/components/dashboard/change-plan/checkout-error";
import { useMe } from "@/lib/hooks";
import { useBalance, useBalanceTopUp } from "@dashboard/hooks";

interface TopUpDialogProps {
  onClose: () => void;
}

const parseAmount = (raw: string): number | null => {
  const normalized = raw.trim().replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  return Number(normalized);
};

export const TopUpDialog = ({ onClose }: TopUpDialogProps) => {
  const { data: account } = useMe();
  const { data: balance } = useBalance();
  const topUp = useBalanceTopUp();
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState("");

  const minUsd = balance?.topup_min_usd;
  const maxUsd = balance?.topup_max_usd;
  const customAmount = parseAmount(custom);
  const amount = custom ? customAmount : selected;
  const isInRange =
    amount !== null &&
    minUsd !== undefined &&
    maxUsd !== undefined &&
    amount >= minUsd &&
    amount <= maxUsd;
  const hasCustomError = custom !== "" && !isInRange;

  const handlePay = (): void => {
    if (!isInRange || !account) return;

    topUp.mutate(
      { amount_usd: amount, return_url: buildBillingReturnUrl() },
      {
        onSuccess: (result) => {
          const saved = savePendingBillingPayment({
            invoiceId: result.invoice_id,
            accountId: account.id,
          });
          if (!saved) {
            toast.error(SAVE_INVOICE_ERROR);
            return;
          }
          window.location.assign(result.payment_url);
        },
        onError: (error) => toast.error(resolveCheckoutErrorMessage(error)),
      }
    );
  };

  const handlePreset = (value: number): void => {
    setSelected(value);
    setCustom("");
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Поповнити рахунок</DialogTitle>
          <DialogDescription>
            Кошти на рахунку витрачаються на додаткові хвилини та номери понад тариф
          </DialogDescription>
        </DialogHeader>

        <div className="bg-primary/5 flex items-center justify-between gap-3 rounded-2xl px-5 py-4">
          <span className="caption text-muted-foreground">Зараз на рахунку</span>
          <b className="font-heading text-2xl tabular-nums">
            {balance ? formatUsd(balance.balance_usd) : "—"}
          </b>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Оберіть суму">
          {(balance?.topup_options_usd ?? []).map((option) => (
            <Button
              key={option}
              type="button"
              variant={!custom && selected === option ? "default" : "outline"}
              aria-pressed={!custom && selected === option}
              onClick={() => handlePreset(option)}
            >
              ${option}
            </Button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="topup-custom">Своя сума, $</Label>
          <Input
            id="topup-custom"
            inputMode="decimal"
            placeholder={minUsd !== undefined ? `Від ${minUsd} до ${maxUsd}` : undefined}
            value={custom}
            aria-invalid={hasCustomError}
            onChange={(event) => setCustom(event.target.value)}
          />
          {hasCustomError && (
            <small className="text-destructive">
              Вкажіть суму від ${minUsd} до ${maxUsd}, наприклад 25 або 25,50
            </small>
          )}
        </div>
        <div className="bg-muted flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-4">
          <span className="flex flex-col gap-1">
            <span className="caption text-muted-foreground">Після поповнення</span>
            <b className="text-xl tabular-nums">
              {isInRange && balance ? formatUsd(balance.balance_usd + amount) : "—"}
            </b>
          </span>
          <span className="text-muted-foreground max-w-[26ch] text-sm">
            Оплата карткою через WayForPay. Кошти зараховуються одразу
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SecureNote label="Безпечна оплата через WayForPay" />
          <Button
            onClick={handlePay}
            disabled={topUp.isPending || !isInRange}
            aria-busy={topUp.isPending}
          >
            {topUp.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
            {isInRange ? `Поповнити на ${formatUsd(amount)}` : "Перейти до оплати"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
