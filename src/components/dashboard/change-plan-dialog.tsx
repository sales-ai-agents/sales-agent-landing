"use client";

import { useState } from "react";
import { Check, Sparkles, ArrowLeft, ExternalLink, Lock } from "lucide-react";
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
import { PLANS, type PlanId, type Plan } from "@/lib/plans";

interface ChangePlanDialogProps {
  currentPlan: PlanId;
  onClose: () => void;
  onConfirm: (planId: PlanId) => void;
}

export function ChangePlanDialog({ currentPlan, onClose, onConfirm }: ChangePlanDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(currentPlan);
  const [step, setStep] = useState<"select" | "payment">("select");
  const [isProcessing, setIsProcessing] = useState(false);

  const isChanged = selectedPlan !== currentPlan;
  const selected = PLANS.find((p) => p.id === selectedPlan)!;

  function handlePay() {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirm(selectedPlan);
      toast.success("Переадресація на сторінку оплати...");
      onClose();
    }, 1500);
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
              currentPlan={currentPlan}
              selectedPlan={selectedPlan}
              isChanged={isChanged}
              onSelect={setSelectedPlan}
              onContinue={() => setStep("payment")}
              onClose={onClose}
            />
          ) : (
            <PaymentStep
              plan={selected}
              isProcessing={isProcessing}
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
  currentPlan: PlanId;
  selectedPlan: PlanId;
  isChanged: boolean;
  onSelect: (id: PlanId) => void;
  onContinue: () => void;
  onClose: () => void;
}

function SelectStep({
  currentPlan,
  selectedPlan,
  isChanged,
  onSelect,
  onContinue,
  onClose,
}: SelectStepProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-display text-2xl">Оберіть план</DialogTitle>
        <DialogDescription>
          Оберіть тариф, який найкраще підходить для вашого бізнесу
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 items-stretch gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan === plan.id}
            isCurrent={currentPlan === plan.id}
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
  plan: Plan;
  isSelected: boolean;
  isCurrent: boolean;
  onSelect: (id: PlanId) => void;
}

function PlanCard({ plan, isSelected, isCurrent, onSelect }: PlanCardProps) {
  const isEnterprise = plan.tier === "enterprise";
  const isPopular = plan.tier === "popular";

  return (
    <button
      type="button"
      onClick={() => onSelect(plan.id)}
      aria-pressed={isSelected}
      aria-label={`${plan.name} — ${plan.price}${plan.period}, ${plan.calls}`}
      className={cn(
        "relative flex flex-col rounded-2xl border-2 p-5 text-left transition-all duration-200",
        "focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        isEnterprise && !isSelected && "border-foreground/90 bg-foreground text-white",
        isSelected
          ? isEnterprise
            ? "border-primary ring-primary/30 bg-foreground/30 scale-105 text-white shadow-lg ring-2"
            : "border-primary bg-primary/5 shadow-primary/15 scale-105 shadow-lg"
          : !isEnterprise && "border-border hover:border-primary/50 hover:shadow-md"
      )}
    >
      {isPopular && (
        <div className="mb-3 flex items-center gap-1.5">
          <Sparkles className="text-primary size-3.5" />
          <span className="text-primary text-xs font-semibold tracking-wide uppercase">
            Популярний
          </span>
        </div>
      )}

      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className={cn("font-display font-semibold", isPopular ? "text-lg" : "text-base")}>
          {plan.name}
        </h3>
        {isCurrent && (
          <Badge variant="success" className="px-1.5 py-0 text-xs">
            Зараз
          </Badge>
        )}
      </div>

      <div className={cn("mb-1", isPopular && "mb-2")}>
        <span className={cn("font-bold", isPopular ? "text-3xl" : "text-2xl")}>{plan.price}</span>
        {plan.period && (
          <span className={cn("text-sm", isEnterprise ? "text-white/60" : "text-muted-foreground")}>
            {plan.period}
          </span>
        )}
      </div>

      <p
        className={cn(
          "mb-4 text-xs font-medium",
          isEnterprise ? "text-white/60" : "text-muted-foreground"
        )}
      >
        {plan.calls}
      </p>

      <div className={cn("mb-3 h-px w-full", isEnterprise ? "bg-white/20" : "bg-border")} />

      <ul className="mt-auto space-y-2" role="list">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-xs leading-tight">
            <Check
              className={cn(
                "mt-0.5 size-3.5 shrink-0",
                isEnterprise ? "text-white/80" : "text-primary"
              )}
            />
            <span className={isEnterprise ? "text-white/90" : ""}>{feature}</span>
          </li>
        ))}
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
  plan: Plan;
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
            className="hover:bg-primary/10 rounded-lg p-1 transition-colors"
            aria-label="Назад до вибору плану"
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
              <p className="font-display text-lg font-semibold">План {plan.name}</p>
              <p className="text-muted-foreground text-sm">{plan.calls}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{plan.price}</p>
              {plan.period && <p className="text-muted-foreground text-xs">{plan.period}</p>}
            </div>
          </div>

          <div className="bg-border mt-4 h-px w-full" />

          <ul className="mt-4 space-y-1.5">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="text-primary size-3.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
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
