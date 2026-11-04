import type { BillingPlan } from "@dashboard/types";

export const getDefaultUpgradePlan = (plans: BillingPlan[], currentKey: string): string | null => {
  if (plans.length === 0) return null;

  const byCapacityThenPrice = (a: BillingPlan, b: BillingPlan) =>
    a.minutes - b.minutes || a.price_usd - b.price_usd;

  if (currentKey === "trial") {
    return [...plans].sort(byCapacityThenPrice)[0]?.key ?? null;
  }

  const currentPlan = plans.find((p) => p.key === currentKey);
  if (!currentPlan) return null;

  const higherPlans = plans
    .filter((plan) => plan.minutes > currentPlan.minutes)
    .sort(byCapacityThenPrice);

  return higherPlans[0]?.key ?? null;
};
