"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Clock, ExternalLink, Lock } from "lucide-react";
import { toast } from "sonner";

import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui";
import { savePendingBillingInvoiceId } from "@/lib/billing-checkout";
import { formatNumber, cn } from "@/lib/utils";
import { useCheckout } from "@dashboard/hooks";
import { ApiError } from "@/lib/api-client";
import type { BillingPeriod, BillingPlan, CheckoutResponse } from "@dashboard/types";

interface ChangePlanDialogProps {
  plans: BillingPlan[];
  currentPlanKey: string;
  selectedPlanKey: string;
  initialCycle?: BillingPeriod;
  onClose: () => void;
}

export const ChangePlanDialog = ({
  plans,
  currentPlanKey,
  selectedPlanKey,
  initialCycle = "month",
  onClose,
}: ChangePlanDialogProps) => {
  const checkout = useCheckout();

  const currentPlan = plans.find((p) => p.key === currentPlanKey);
  const selectedPlan = plans.find((p) => p.key === selectedPlanKey);

  const hasAnnual = !!selectedPlan?.year;
  const [cycle, setCycle] = useState<BillingPeriod>(
    hasAnnual && initialCycle === "year" ? "year" : "month"
  );
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResponse | null>(null);

  const effectiveCycle = hasAnnual && cycle === "year" ? "year" : "month";

  const handleCreateInvoice = () => {
    if (!selectedPlan) return;

    checkout.mutate(
      { plan: selectedPlan.key, period: effectiveCycle },
      {
        onSuccess: (data) => {
          setCheckoutResult(data);
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            if (error.code === "unknown_plan") {
              toast.error("Невідомий тариф. Оновіть сторінку та спробуйте ще.");
            } else if (error.code === "payment_provider_error") {
              toast.error("Помилка створення рахунку в Monobank. Спробуйте пізніше.");
            } else if (error.code === "payments_unavailable") {
              toast.error("Оплата тимчасово недоступна.");
            } else if (error.code === "rate_unavailable") {
              toast.error(
                "Курс НБУ зараз недоступний для розрахунку суми. Рахунок не створено, спробуйте пізніше."
              );
            } else {
              toast.error(error.message || "Щось пішло не так.");
            }
          } else {
            toast.error("Щось пішло не так.");
          }
        },
      }
    );
  };

  if (!selectedPlan) return null;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        {checkoutResult ? (
          <CheckoutSummaryStep
            checkoutResult={checkoutResult}
            planTitle={selectedPlan.title}
            onProceed={() => {
              if (!savePendingBillingInvoiceId(checkoutResult.invoice_id)) {
                toast.error(
                  "Не вдалося зберегти дані рахунку для перевірки оплати. Дозвольте сайту зберігати дані та спробуйте ще раз."
                );
                return;
              }
              window.location.assign(checkoutResult.payment_url);
            }}
            onBack={() => setCheckoutResult(null)}
          />
        ) : (
          <ConfirmStep
            currentPlan={currentPlan}
            newPlan={selectedPlan}
            isSamePlan={currentPlanKey === selectedPlanKey}
            cycle={effectiveCycle}
            onCycleChange={(c) => {
              if (c === "year" && !hasAnnual) return;
              setCycle(c);
            }}
            isProcessing={checkout.isPending}
            onCancel={onClose}
            onPay={handleCreateInvoice}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

interface ConfirmStepProps {
  currentPlan: BillingPlan | undefined;
  newPlan: BillingPlan;
  isSamePlan: boolean;
  cycle: BillingPeriod;
  onCycleChange: (cycle: BillingPeriod) => void;
  isProcessing: boolean;
  onCancel: () => void;
  onPay: () => void;
}

const ConfirmStep = ({
  currentPlan,
  newPlan,
  isSamePlan,
  cycle,
  onCycleChange,
  isProcessing,
  onCancel,
  onPay,
}: ConfirmStepProps) => {
  const annualPlan = cycle === "year" ? newPlan.year : undefined;
  const isAnnual = annualPlan !== undefined;
  const payPriceUsd = annualPlan?.price_usd ?? newPlan.price_usd;
  const payPriceUah = annualPlan?.price_uah ?? newPlan.price_uah;

  return (
    <div className="space-y-6">
      <div>
        <DialogTitle className="text-xl font-bold">
          {isSamePlan
            ? isAnnual
              ? `Оплатити тариф ${newPlan.title} на 1 рік`
              : `Продовжити тариф ${newPlan.title}`
            : `Змінити тариф на ${newPlan.title}`}
        </DialogTitle>
        <DialogDescription className="mt-1">
          {isSamePlan
            ? `Створення рахунку для вашого поточного тарифу. Перевірте деталі перед переходом до Monobank.`
            : `Ви обрали тариф ${newPlan.title}. Перевірте деталі перед формуванням рахунку.`}
        </DialogDescription>
      </div>

      {newPlan.year && (
        <div className="bg-muted/50 border-border flex flex-col rounded-lg border p-1 sm:flex-row">
          <button
            type="button"
            onClick={() => onCycleChange("month")}
            className={cn(
              "flex-1 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              cycle === "month"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Оплата щомісяця (${newPlan.price_usd}/міс)
          </button>
          <button
            type="button"
            onClick={() => onCycleChange("year")}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              cycle === "year"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>Оплата на рік (${newPlan.year.price_usd}/рік)</span>
            {newPlan.year.months_free > 0 && (
              <span className="py-0.2 rounded bg-green-100 px-1.5 text-xs font-semibold text-green-700 dark:bg-green-950/60 dark:text-green-300">
                -{newPlan.year.months_free} міс
              </span>
            )}
            {newPlan.year.months_free === 0 && newPlan.year.saving_usd > 0 && (
              <span className="py-0.2 rounded bg-green-100 px-1.5 text-xs font-semibold text-green-700 dark:bg-green-950/60 dark:text-green-300">
                -${newPlan.year.saving_usd}
              </span>
            )}
          </button>
        </div>
      )}

      {isSamePlan ? (
        <div className="border-primary bg-primary/5 rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-xs">Ваш тариф</p>
              <p className="text-primary mt-1 text-2xl font-bold uppercase">{newPlan.title}</p>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="bg-primary text-primary-foreground px-4">
                {isAnnual ? "Річна оплата" : "Щомісячна оплата"}
              </Badge>
              <p className="text-muted-foreground mt-1 text-sm">
                ${payPriceUsd} / {isAnnual ? "рік" : "місяць"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="border-border flex-1 rounded-xl border p-4">
            <p className="text-muted-foreground text-xs">Ваш поточний тариф</p>
            <p className="mt-1 text-2xl font-bold uppercase">{currentPlan?.title ?? "TRIAL"}</p>
            <p className="text-muted-foreground mt-1 text-sm">
              ${currentPlan ? currentPlan.price_usd : 0} / місяць
            </p>
            <Badge variant="outline" className="bg-primary/10 text-primary mt-4 border-white px-5">
              Поточний
            </Badge>
          </div>

          <ArrowRight className="text-muted-foreground hidden h-5 w-5 shrink-0 sm:block" />

          <div className="border-primary flex-1 rounded-xl border p-4">
            <p className="text-muted-foreground text-xs">Новий тариф</p>
            <p className="text-primary mt-1 text-2xl font-bold uppercase">{newPlan.title}</p>
            <p className="text-muted-foreground mt-1 text-sm">
              ${payPriceUsd} / {isAnnual ? "рік" : "місяць"}
            </p>
            <Badge variant="outline" className="bg-primary text-primary-foreground mt-4 px-5">
              Новий
            </Badge>
          </div>
        </div>
      )}

      <div className="border-border rounded-xl border">
        <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
          <Clock className="text-muted-foreground h-4 w-4" />
          <span className="flex-1 text-sm">Хвилин розмов</span>
          {currentPlan && !isSamePlan && (
            <span className="text-muted-foreground text-sm">
              {formatNumber(currentPlan.minutes)} хв
            </span>
          )}
          <span className="text-primary text-sm font-medium">
            {formatNumber(newPlan.minutes)} хв
          </span>
          {currentPlan && !isSamePlan && newPlan.minutes > currentPlan.minutes && (
            <span className="text-xs font-medium text-green-600">
              +{formatNumber(newPlan.minutes - currentPlan.minutes)} хв
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center px-4 py-3">
          <span className="flex-1 text-sm">ШІ-агенти</span>
          {currentPlan && !isSamePlan && (
            <span className="text-muted-foreground text-sm">
              {currentPlan.agents === 0 ? "Необмежено" : `До ${currentPlan.agents}`}
            </span>
          )}
          <span className="text-primary ml-8 text-sm font-medium">
            {newPlan.agents === 0 ? "Необмежено" : `До ${newPlan.agents}`}
          </span>
        </div>
      </div>

      <div className="border-border bg-primary/5 rounded-xl border px-4 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-muted-foreground text-xs">Орієнтовна сума</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold">${payPriceUsd}</span>
              {payPriceUah != null && (
                <span className="text-muted-foreground text-sm">
                  (≈ {formatNumber(payPriceUah)} грн)
                </span>
              )}
            </div>
            {newPlan.usd_rate && (
              <p className="text-muted-foreground mt-0.5 text-xs">
                Попередній курс НБУ {newPlan.usd_rate.toFixed(2)} ₴/$
              </p>
            )}
          </div>
          <p className="text-muted-foreground max-w-xs text-xs sm:text-right">
            Точна сума в гривнях розраховується сервером за курсом НБУ на момент створення рахунку.
            <br />
            {isAnnual ? "Період: 1 рік." : "Період: 1 місяць."}
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing} className="px-8">
          Скасувати
        </Button>
        <Button onClick={onPay} disabled={isProcessing} className="px-8">
          {isProcessing ? "Формування рахунку..." : "Сформувати рахунок"}
        </Button>
      </div>

      <div className="text-muted-foreground flex items-center justify-center gap-1.5">
        <Lock className="h-3 w-3" />
        <span className="text-xs">Безпечна оплата через Monobank</span>
      </div>
    </div>
  );
};

interface CheckoutSummaryStepProps {
  checkoutResult: CheckoutResponse;
  planTitle: string;
  onProceed: () => void;
  onBack: () => void;
}

const CheckoutSummaryStep = ({
  checkoutResult,
  planTitle,
  onProceed,
  onBack,
}: CheckoutSummaryStepProps) => {
  const isYear = checkoutResult.period === "year";

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
          Рахунок для тарифу <span className="font-semibold">{planTitle}</span> (
          {isYear ? "1 рік" : "1 місяць"}) успішно сформовано за офіційним курсом НБУ.
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
          <span>Період: {isYear ? "1 рік" : "1 місяць"}</span>
        </div>
      </div>

      <div className="border-border bg-muted/30 text-muted-foreground space-y-1 rounded-xl border p-4 text-xs">
        <p className="text-foreground font-medium">Зверніть увагу перед переходом:</p>
        <p>• Саме ця гривнева сума буде вказана на захищеній сторінці Monobank.</p>
        <p>• Оплата є разовою — автосписань без вашої участі немає.</p>
        <p>• Тариф активується автоматично одразу після підтвердження оплати у додатку банку.</p>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Змінити тариф
        </Button>
        <Button onClick={onProceed} size="lg" className="flex-1 gap-2">
          <span>Перейти до оплати в Monobank</span>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-muted-foreground flex items-center justify-center gap-1.5">
        <Lock className="h-3 w-3" />
        <span className="text-xs">Захищене з&apos;єднання Monobank Checkout</span>
      </div>
    </div>
  );
};
