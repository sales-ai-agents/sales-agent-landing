import { pluralizeNumbers } from "@/lib/utils";
import type { BillingPlan } from "@dashboard/types";

export const formatPlanNumbers = ({ numbers, pool_numbers }: BillingPlan): string | null => {
  if (numbers === undefined) return null;

  const total = numbers === 0 ? "Необмежено номерів" : `${numbers} ${pluralizeNumbers(numbers)}`;
  if (!pool_numbers) return total;

  return `${total}, з них ${pool_numbers} від Calls4U`;
};
