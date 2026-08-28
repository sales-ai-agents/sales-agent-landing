"use client";

import { Check, ArrowRight, Lock, Clock } from "lucide-react";
import { toast } from "sonner";

import { Button, Badge, Dialog, DialogContent } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import { useCheckout } from "@dashboard/hooks";
import { ApiError } from "@/lib/api-client";
import type { BillingPlan } from "@dashboard/types";

interface ChangePlanDialogProps {
  plans: BillingPlan[];
  currentPlanKey: string;
  selectedPlanKey: string;
  onClose: () => void;
}

export const ChangePlanDialog = ({
  plans,
  currentPlanKey,
  selectedPlanKey,
  onClose,
}: ChangePlanDialogProps) => {
  const checkout = useCheckout();

  const currentPlan = plans.find((p) => p.key === currentPlanKey);
  const selectedPlan = plans.find((p) => p.key === selectedPlanKey);

  const handlePay = () => {
    if (!selectedPlan) return;

    checkout.mutate(
      { plan: selectedPlan.key },
      {
        onSuccess: (data) => {
          window.location.href = data.payment_url;
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            if (error.code === "unknown_plan") {
              toast.error("Невідомий тариф. Оновіть сторінку та спробуйте ще.");
            } else if (error.code === "payment_provider_error") {
              toast.error("Помилка платіжної системи. Спробуйте пізніше.");
            } else if (error.code === "payments_unavailable") {
              toast.error("Оплата тимчасово недоступна.");
            } else {
              toast.error("Щось пішло не так.");
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
      <DialogContent className="bg-background sm:max-w-2xl">
        <ConfirmStep
          currentPlan={currentPlan}
          newPlan={selectedPlan}
          isProcessing={checkout.isPending}
          onCancel={onClose}
          onPay={handlePay}
        />
      </DialogContent>
    </Dialog>
  );
};

interface ConfirmStepProps {
  currentPlan: BillingPlan | undefined;
  newPlan: BillingPlan;
  isProcessing: boolean;
  onCancel: () => void;
  onPay: () => void;
}

const ConfirmStep = ({ currentPlan, newPlan, isProcessing, onCancel, onPay }: ConfirmStepProps) => {
  const priceDiff = Math.round(newPlan.price_uah / 41);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Підтвердити зміну тарифу</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Ви обрали тариф <span className="font-semibold">{newPlan.title}</span>. Перевірте деталі
          перед переходом до оплати
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="border-border flex-1 rounded-xl border p-4">
          <p className="text-muted-foreground text-xs">Ваш поточний тариф</p>
          <p className="mt-1 text-2xl font-bold uppercase">{currentPlan?.title ?? "—"}</p>
          <p className="text-muted-foreground mt-1 text-sm">
            ${currentPlan ? Math.round(currentPlan.price_uah / 41) : 0} / місяць
          </p>
          <Badge variant="outline" className="bg-primary/10 text-primary mt-4 border-white px-5">
            Поточний
          </Badge>
        </div>

        <ArrowRight className="text-muted-foreground h-5 w-5 shrink-0" />

        <div className="border-primary flex-1 rounded-xl border p-4">
          <p className="text-muted-foreground text-xs">Новий тариф</p>
          <p className="text-primary mt-1 text-2xl font-bold uppercase">{newPlan.title}</p>
          <p className="text-muted-foreground mt-1 text-sm">${priceDiff} / місяць</p>
          <Badge variant="outline" className="bg-primary text-primary-foreground mt-4 px-5">
            Новий
          </Badge>
        </div>
      </div>

      <div className="border-border rounded-xl border">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Clock className="text-muted-foreground h-4 w-4" />
          <span className="flex-1 text-sm">Хвилин розмов</span>
          <span className="text-muted-foreground text-sm">
            {currentPlan ? formatNumber(currentPlan.minutes) : 0} хв
          </span>
          <span className="text-primary text-sm font-medium">
            {formatNumber(newPlan.minutes)} хв
          </span>
          {currentPlan && newPlan.minutes > currentPlan.minutes && (
            <span className="text-xs font-medium text-green-600">
              +{formatNumber(newPlan.minutes - currentPlan.minutes)} хв
            </span>
          )}
        </div>
        <div className="flex items-center border-b px-4 py-3">
          <span className="flex-1 text-sm">ШІ-агенти</span>
          <span className="text-muted-foreground text-sm">
            {currentPlan
              ? currentPlan.agents === 0
                ? "Необмежено"
                : `До ${currentPlan.agents}`
              : "—"}
          </span>
          <span className="text-primary ml-8 text-sm font-medium">
            {newPlan.agents === 0 ? "Необмежено" : `До ${newPlan.agents}`}
          </span>
        </div>
        <div className="flex items-center border-b px-4 py-3">
          <span className="flex-1 text-sm">Інтеграції</span>
          <span className="text-muted-foreground text-sm">Обмежені</span>
          <span className="text-primary ml-8 text-sm font-medium">
            {newPlan.agents === 0 ? "Усі доступні" : "Обмежені"}
          </span>
        </div>
        <div className="flex items-center border-b px-4 py-3">
          <span className="flex-1 text-sm">Пріоритетна підтримка</span>
          <span className="text-muted-foreground text-sm">Базова</span>
          <span className="text-primary ml-8 text-sm font-medium">
            {newPlan.agents === 0 ? "Пріоритетна" : "Базова"}
          </span>
        </div>
        <div className="flex items-center px-4 py-3">
          <span className="flex-1 text-sm">Підключення до бізнес-процесів</span>
          <span className="text-muted-foreground text-sm">-</span>
          <span className="ml-8">
            {newPlan.agents === 0 ? (
              <Check className="text-primary h-4 w-4" />
            ) : (
              <span className="text-muted-foreground text-sm">-</span>
            )}
          </span>
        </div>
      </div>

      <div className="border-border bg-primary/5 rounded-xl border px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs">До сплати сьогодні</p>
            <p className="mt-2 text-2xl font-semibold">${priceDiff}</p>
          </div>
          <p className="text-muted-foreground max-w-xs text-xs">
            Платіж буде списано одразу. <br /> Скасувати тариф можна в будь-який час
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing} className="px-8">
          Скасувати
        </Button>
        <Button onClick={onPay} disabled={isProcessing} className="px-8">
          {isProcessing ? "Переадресація..." : "Перейти до оплати"}
        </Button>
      </div>

      <div className="text-muted-foreground flex items-center justify-center gap-1.5">
        <Lock className="h-3 w-3" />
        <span className="text-xs">Безпечна оплата через ...</span>
      </div>
    </div>
  );
};
