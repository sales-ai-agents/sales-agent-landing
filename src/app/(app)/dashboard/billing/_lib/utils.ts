import type { BillingPlan } from "@dashboard/types";

export function getDefaultUpgradePlan(plans: BillingPlan[], currentKey: string) {
  const nonCurrent = plans.filter((p) => p.key !== currentKey);
  return nonCurrent[0]?.key ?? plans[0]?.key ?? "";
}
