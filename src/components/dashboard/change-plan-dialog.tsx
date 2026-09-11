"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui";
import { savePendingBillingInvoiceId } from "@/lib/billing-checkout";
import { useCheckout } from "@dashboard/hooks";
import type { BillingPeriod, BillingPlan, CheckoutResponse } from "@dashboard/types";

import { CheckoutSummaryStep } from "./change-plan/checkout-summary-step";
import { resolveCheckoutErrorMessage } from "./change-plan/checkout-error";
import { ConfirmStep } from "./change-plan/confirm-step";

interface ChangePlanDialogProps {
  plans: BillingPlan[];
  currentPlanKey: string;
  selectedPlanKey: string;
  initialCycle?: BillingPeriod;
  onClose: () => void;
}

const SAVE_INVOICE_ERROR =
  "Не вдалося зберегти дані рахунку для перевірки оплати. Дозвольте сайту зберігати дані та спробуйте ще раз.";

export const ChangePlanDialog = ({
  plans,
  currentPlanKey,
  selectedPlanKey,
  initialCycle = "month",
  onClose,
}: ChangePlanDialogProps) => {
  const checkout = useCheckout();
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResponse | null>(null);

  const currentPlan = plans.find((plan) => plan.key === currentPlanKey);
  const selectedPlan = plans.find((plan) => plan.key === selectedPlanKey);
  const hasAnnual = !!selectedPlan?.year;

  const [cycle, setCycle] = useState<BillingPeriod>(
    hasAnnual && initialCycle === "year" ? "year" : "month"
  );

  const effectiveCycle: BillingPeriod = hasAnnual && cycle === "year" ? "year" : "month";

  const handleCreateInvoice = () => {
    if (!selectedPlan) return;

    checkout.mutate(
      { plan: selectedPlan.key, period: effectiveCycle },
      {
        onSuccess: setCheckoutResult,
        onError: (error) => toast.error(resolveCheckoutErrorMessage(error)),
      }
    );
  };

  const handleProceedToPayment = () => {
    if (!checkoutResult) return;

    if (!savePendingBillingInvoiceId(checkoutResult.invoice_id)) {
      toast.error(SAVE_INVOICE_ERROR);
      return;
    }

    window.location.assign(checkoutResult.payment_url);
  };

  const handleCycleChange = (nextCycle: BillingPeriod) => {
    if (nextCycle === "year" && !hasAnnual) return;
    setCycle(nextCycle);
  };

  if (!selectedPlan) return null;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        {checkoutResult ? (
          <CheckoutSummaryStep
            checkoutResult={checkoutResult}
            planTitle={selectedPlan.title}
            onProceed={handleProceedToPayment}
            onBack={() => setCheckoutResult(null)}
          />
        ) : (
          <ConfirmStep
            currentPlan={currentPlan}
            newPlan={selectedPlan}
            isSamePlan={currentPlanKey === selectedPlanKey}
            cycle={effectiveCycle}
            onCycleChange={handleCycleChange}
            isProcessing={checkout.isPending}
            onCancel={onClose}
            onPay={handleCreateInvoice}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
