"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui";
import { SAVE_INVOICE_ERROR, savePendingBillingInvoiceId } from "@/lib/billing-checkout";
import { useCheckout } from "@dashboard/hooks";
import type { BillingPeriod, BillingPlan } from "@dashboard/types";

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

export const ChangePlanDialog = ({
  plans,
  currentPlanKey,
  selectedPlanKey,
  initialCycle = "month",
  onClose,
}: ChangePlanDialogProps) => {
  const checkout = useCheckout();
  const [showSummary, setShowSummary] = useState(false);
  const [saveCard, setSaveCard] = useState(true);
  const [autoRenew, setAutoRenew] = useState(false);

  const currentPlan = plans.find((plan) => plan.key === currentPlanKey);
  const selectedPlan = plans.find((plan) => plan.key === selectedPlanKey);
  const hasAnnual = !!selectedPlan?.year;

  const [cycle, setCycle] = useState<BillingPeriod>(
    hasAnnual && initialCycle === "year" ? "year" : "month"
  );

  const handleSaveCardChange = (nextSaveCard: boolean) => {
    setSaveCard(nextSaveCard);
    if (!nextSaveCard) setAutoRenew(false);
  };

  const handleProceedToPayment = () => {
    if (!selectedPlan) return;

    checkout.mutate(
      {
        plan: selectedPlan.key,
        period: cycle,
        save_card: saveCard,
        auto_renew: autoRenew,
      },
      {
        onSuccess: (invoice) => {
          if (!savePendingBillingInvoiceId(invoice.invoice_id)) {
            toast.error(SAVE_INVOICE_ERROR);
            return;
          }

          window.location.assign(invoice.payment_url);
        },
        onError: (error) => toast.error(resolveCheckoutErrorMessage(error)),
      }
    );
  };

  const handleCycleChange = (nextCycle: BillingPeriod) => {
    if (nextCycle === "year" && !hasAnnual) return;
    setCycle(nextCycle);
  };

  if (!selectedPlan) return null;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={showSummary ? "sm:max-w-4xl" : "sm:max-w-2xl"}>
        {showSummary ? (
          <CheckoutSummaryStep
            plan={selectedPlan}
            period={cycle}
            saveCard={saveCard}
            autoRenew={autoRenew}
            isProcessing={checkout.isPending}
            onSaveCardChange={handleSaveCardChange}
            onAutoRenewChange={setAutoRenew}
            onProceed={handleProceedToPayment}
            onBack={() => setShowSummary(false)}
          />
        ) : (
          <ConfirmStep
            currentPlan={currentPlan}
            newPlan={selectedPlan}
            isSamePlan={currentPlanKey === selectedPlanKey}
            cycle={cycle}
            onCycleChange={handleCycleChange}
            onCancel={onClose}
            onPay={() => setShowSummary(true)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
