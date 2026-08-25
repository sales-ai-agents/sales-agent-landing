"use client";

import { useState } from "react";
import { Check, ArrowLeft, ExternalLink, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useCheckout } from "@dashboard/hooks/use-billing";
import { ApiError } from "@/lib/api-client";
import type { BillingPlan } from "@dashboard/types";

interface ChangePlanDialogProps {
  plans: BillingPlan[];
  currentPlanKey: string;
  onClose: () => void;
}

export function ChangePlanDialog({ plans, currentPlanKey, onClose }: ChangePlanDialogProps) {
  const [selectedKey, setSelectedKey] = useState<string>(currentPlanKey);
  const [step, setStep] = useState<"select" | "payment">("select");
  const checkout = useCheckout();

  const isChanged = selectedKey !== currentPlanKey;
  const selected = plans.find((p) => p.key === selectedKey);

  function handlePay() {
    if (!selected) return;

    checkout.mutate(
      { plan: selected.key },
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
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="bg-background sm:max-w-4xl">
        <div key={step} className="animate-in fade-in duration-500">
          {step === "select" ? (
            <SelectStep
              plans={plans}
              currentPlanKey={currentPlanKey}
              selectedKey={selectedKey}
              isChanged={isChanged}
              onSelect={setSelectedKey}
              onContinue={() => setStep("payment")}
              onClose={onClose}
            />
          ) : (
            <PaymentStep
              plan={selected!}
              isProcessing={checkout.isPending}
              onBack={() => setStep("select")}
              onPay={handlePay}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface SelectStepProps {
  plans: BillingPlan[];
  currentPlanKey: string;
  selectedKey: string;
  isChanged: boolean;
  onSelect: (key: string) => void;
  onContinue: () => void;
  onClose: () => void;
}

function SelectStep({
  plans,
  currentPlanKey,
  selectedKey,
  isChanged,
  onSelect,
  onContinue,
  onClose,
}: SelectStepProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-display text-2xl">Оберіть тариф</DialogTitle>
        <DialogDescription>
          Оберіть тариф, який найкраще підходить для вашого бізнесу
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 items-stretch gap-4 py-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.key}
            plan={plan}
            isSelected={selectedKey === plan.key}
            isCurrent={currentPlanKey === plan.key}
            onSelect={onSelect}
          />
        ))}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Скасувати
        </Button>
        <Button disabled={!isChanged} onClick={onContinue}>
          Продовжити
        </Button>
      </DialogFooter>
    </>
  );
}

interface PlanCardProps {
  plan: BillingPlan;
  isSelected: boolean;
  isCurrent: boolean;
  onSelect: (key: string) => void;
}

function PlanCard({ plan, isSelected, isCurrent, onSelect }: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(plan.key)}
      aria-pressed={isSelected}
      aria-label={`${plan.title} — ${plan.price_uah} грн/міс, ${plan.minutes} хвилин`}
      className={cn(
        "relative flex flex-col rounded-2xl border-2 p-5 text-left transition-all duration-200",
        "focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        isSelected
          ? "border-primary bg-primary/5 shadow-primary/15 scale-105 shadow-lg"
          : "border-border hover:border-primary/50 hover:shadow-md"
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-display text-base font-semibold">{plan.title}</h3>
        {isCurrent && (
          <Badge variant="success" className="px-1.5 py-0 text-xs">
            Зараз
          </Badge>
        )}
      </div>

      <div className="mb-1">
        <span className="text-2xl font-bold">{plan.price_uah} грн</span>
        <span className="text-muted-foreground text-sm">/міс</span>
      </div>

      <p className="text-muted-foreground mb-4 text-xs font-medium">{plan.minutes} хвилин</p>

      <div className="bg-border mb-3 h-px w-full" />

      <ul className="mt-auto space-y-2" role="list">
        <li className="flex items-start gap-2 text-xs leading-tight">
          <Check className="text-primary mt-0.5 size-3.5 shrink-0" />
          <span>{plan.minutes} хвилин дзвінків</span>
        </li>
        <li className="flex items-start gap-2 text-xs leading-tight">
          <Check className="text-primary mt-0.5 size-3.5 shrink-0" />
          <span>{plan.agents === 0 ? "Необмежено агентів" : `${plan.agents} агентів`}</span>
        </li>
      </ul>

      {isSelected && (
        <div className="bg-primary absolute top-3 right-3 flex size-5 items-center justify-center rounded-full">
          <Check className="text-primary-foreground size-3" />
        </div>
      )}
    </button>
  );
}

interface PaymentStepProps {
  plan: BillingPlan;
  isProcessing: boolean;
  onBack: () => void;
  onPay: () => void;
}

function PaymentStep({ plan, isProcessing, onBack, onPay }: PaymentStepProps) {
  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            disabled={isProcessing}
            className="hover:bg-primary/5 rounded-lg p-1 transition-colors"
            aria-label="Назад до вибору тарифу"
          >
            <ArrowLeft className="size-5" />
          </button>
          <DialogTitle className="font-display text-2xl">Підтвердження</DialogTitle>
        </div>
        <DialogDescription>Перевірте деталі та перейдіть до оплати</DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-4">
        <div className="border-border bg-primary/5 rounded-xl border p-5">
          <p className="text-muted-foreground mb-3 text-xs tracking-wide uppercase">
            Ваше замовлення
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-lg font-semibold">Тариф {plan.title}</p>
              <p className="text-muted-foreground text-sm">{plan.minutes} хвилин</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{plan.price_uah} грн</p>
              <p className="text-muted-foreground text-xs">/міс</p>
            </div>
          </div>

          <div className="bg-border mt-4 h-px w-full" />

          <ul className="mt-4 space-y-1.5">
            <li className="flex items-center gap-2 text-sm">
              <Check className="text-primary size-3.5 shrink-0" />
              <span>{plan.minutes} хвилин дзвінків</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="text-primary size-3.5 shrink-0" />
              <span>{plan.agents === 0 ? "Необмежено агентів" : `${plan.agents} агентів`}</span>
            </li>
          </ul>
        </div>

        <div className="border-border rounded-xl border p-4">
          <p className="text-sm">
            Після натискання кнопки ви будете перенаправлені на сторінку оплати monobank, де зможете
            оплатити карткою, через Apple Pay, Google Pay або застосунок monobank.
          </p>
        </div>

        <div className="text-muted-foreground flex items-center gap-1.5">
          <Lock className="size-3" />
          <span className="text-xs">Безпечна оплата через monobank acquiring</span>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          Назад
        </Button>
        <Button onClick={onPay} disabled={isProcessing} className="gap-2">
          {isProcessing ? (
            "Переадресація..."
          ) : (
            <>
              Перейти до оплати
              <ExternalLink className="size-4" />
            </>
          )}
        </Button>
      </DialogFooter>
    </>
  );
}
