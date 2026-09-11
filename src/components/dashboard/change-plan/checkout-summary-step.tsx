import { ArrowLeft, ExternalLink } from "lucide-react";

import { Badge, Button, DialogDescription, DialogTitle } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import type { CheckoutResponse } from "@dashboard/types";

import { SecureNote } from "./confirm-step";

interface CheckoutSummaryStepProps {
  checkoutResult: CheckoutResponse;
  planTitle: string;
  onProceed: () => void;
  onBack: () => void;
}

export const CheckoutSummaryStep = ({
  checkoutResult,
  planTitle,
  onProceed,
  onBack,
}: CheckoutSummaryStepProps) => {
  const isYear = checkoutResult.period === "year";
  const periodLabel = isYear ? "1 рік" : "1 місяць";

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-600 text-white hover:bg-green-600">Рахунок готовий</Badge>
          <span className="text-muted-foreground text-xs">
            ID: {checkoutResult.invoice_id.slice(0, 12)}...
          </span>
        </div>
        <DialogTitle className="mt-2 text-2xl font-bold">Підтвердження суми оплати</DialogTitle>
        <DialogDescription className="mt-1">
          Рахунок для тарифу <span className="font-semibold">{planTitle}</span> ({periodLabel})
          успішно сформовано за офіційним курсом НБУ.
        </DialogDescription>
      </div>

      <div className="border-primary/30 bg-primary/5 rounded-2xl border p-6 text-center">
        <p className="text-muted-foreground text-sm font-medium">Точна сума до списання в банку:</p>
        <p className="text-primary mt-2 text-4xl font-extrabold">
          {formatNumber(checkoutResult.amount_uah)} грн
        </p>
        <div className="text-muted-foreground mt-3 flex flex-wrap items-center justify-center gap-3 text-xs">
          <span>Ціна тарифу: ${checkoutResult.price_usd}</span>
          <span>•</span>
          <span>Курс НБУ: {checkoutResult.usd_rate.toFixed(2)} ₴/$</span>
          <span>•</span>
          <span>Період: {periodLabel}</span>
        </div>
      </div>

      <div className="border-border bg-muted/30 text-muted-foreground space-y-1 rounded-xl border p-4 text-xs">
        <p className="text-foreground font-medium">Зверніть увагу перед переходом:</p>
        <p>• Саме ця гривнева сума буде вказана на захищеній сторінці оплати WayForPay.</p>
        <p>• Оплата є разовою — автосписань без вашої участі немає.</p>
        <p>• Тариф активується автоматично одразу після підтвердження оплати у додатку банку.</p>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Змінити тариф
        </Button>
        <Button onClick={onProceed} size="lg" className="flex-1 gap-2">
          <span>Перейти до оплати WayForPay</span>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>

      <SecureNote label="Захищене зʼєднання WayForPay" />
    </div>
  );
};
