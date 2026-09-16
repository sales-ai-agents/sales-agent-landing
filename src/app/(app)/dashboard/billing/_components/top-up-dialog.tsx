"use client";

import { useState } from "react";
import { Info, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { savePendingBillingInvoiceId } from "@/lib/billing-checkout";
import { cn, formatNumber } from "@/lib/utils";
import { resolveCheckoutErrorMessage } from "@/components/dashboard/change-plan/checkout-error";
import { useTopUp } from "@dashboard/hooks";
import type { MinutesPack, TopUpPackKey } from "@dashboard/types";

interface TopUpDialogProps {
  packs: MinutesPack[];
  popularPackKey?: TopUpPackKey;
  onClose: () => void;
}

const SAVE_INVOICE_ERROR =
  "Не вдалося зберегти дані рахунку для перевірки оплати. Дозвольте сайту зберігати дані та спробуйте ще раз.";

export const TopUpDialog = ({ packs, popularPackKey = "250", onClose }: TopUpDialogProps) => {
  const topUp = useTopUp();
  const [selectedKey, setSelectedKey] = useState<TopUpPackKey>(
    packs.some((pack) => pack.key === popularPackKey) ? popularPackKey : (packs[0]?.key ?? "100")
  );

  const selectedPack = packs.find((pack) => pack.key === selectedKey);

  const handlePay = () => {
    if (!selectedPack) return;

    topUp.mutate(
      { pack: selectedPack.key },
      {
        onSuccess: (result) => {
          if (!savePendingBillingInvoiceId(result.invoice_id)) {
            toast.error(SAVE_INVOICE_ERROR);
            return;
          }
          window.location.assign(result.payment_url);
        },
        onError: (error) => toast.error(resolveCheckoutErrorMessage(error)),
      }
    );
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Купити хвилини</DialogTitle>
          <DialogDescription>Поповніть баланс для дзвінків вашого ШІ-агента</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-sm font-semibold">Оберіть пакет хвилин</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {packs.map((pack) => (
              <PackOption
                key={pack.key}
                pack={pack}
                isSelected={pack.key === selectedKey}
                isPopular={pack.key === popularPackKey}
                onSelect={() => setSelectedKey(pack.key)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold">Оплата</p>
          <p className="text-muted-foreground text-sm">
            Ви будете перенаправлені на захищену сторінку WayForPay для завершення платежу
          </p>
        </div>

        {selectedPack && <OrderSummary pack={selectedPack} />}

        <div className="flex items-center justify-end">
          <Button
            className="px-6"
            onClick={handlePay}
            disabled={topUp.isPending || !selectedPack}
            aria-busy={topUp.isPending}
          >
            {topUp.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Перейти до оплати
          </Button>
        </div>

        <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-xs">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Безпечна оплата через WayForPay
        </p>
      </DialogContent>
    </Dialog>
  );
};

interface PackOptionProps {
  pack: MinutesPack;
  isSelected: boolean;
  isPopular: boolean;
  onSelect: () => void;
}

const PackOption = ({ pack, isSelected, isPopular, onSelect }: PackOptionProps) => (
  <button
    type="button"
    aria-pressed={isSelected}
    onClick={onSelect}
    className={cn(
      "relative flex cursor-pointer flex-col gap-1 rounded-xl border p-3 text-left transition-colors",
      isSelected
        ? "border-primary bg-primary/5 ring-primary ring-1"
        : "border-border hover:border-primary/40"
    )}
  >
    {isPopular && (
      <span className="bg-primary absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-white">
        Популярний
      </span>
    )}
    <span className="text-sm font-semibold">{formatNumber(pack.minutes)} хв</span>
    <span className="text-muted-foreground text-xs">{pack.per_minute_uah.toFixed(2)}/хв</span>
    <span className="mt-1 text-sm font-bold">{formatNumber(pack.price_uah)} ₴</span>
  </button>
);

const OrderSummary = ({ pack }: { pack: MinutesPack }) => (
  <div className="space-y-2">
    <p className="text-sm font-semibold">Ваше замовлення</p>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="border-border space-y-2 rounded-lg border p-4 text-sm">
        <SummaryRow label="Пакет хвилин" value={`${formatNumber(pack.minutes)} хв`} />
        <SummaryRow label="Ціна за хвилину" value={`${pack.per_minute_uah.toFixed(2)}/хв`} />
        <div className="border-border flex items-center justify-between border-t pt-2 font-semibold">
          <span>До сплати</span>
          <span>{formatNumber(pack.price_uah)} ₴</span>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-4">
        <Info className="text-primary h-4 w-4 shrink-0" aria-hidden="true" />
        <p className="text-muted-foreground text-xs">
          Хвилини зараховуються одразу після успішної оплати.
        </p>
      </div>
    </div>
  </div>
);

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="text-muted-foreground flex items-center justify-between">
    <span>{label}</span>
    <span className="text-foreground font-medium">{value}</span>
  </div>
);
