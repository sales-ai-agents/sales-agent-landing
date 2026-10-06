import type { PaymentStatus, PaymentStatusResponse } from "@dashboard/types";

export type PaymentOutcome = "paid" | "pending" | "failed";

const FAILED_PAYMENT_STATUSES: ReadonlySet<string> = new Set<PaymentStatus>([
  "Declined",
  "Expired",
  "Refunded",
]);

export const isFailedPaymentStatus = (status: string): boolean =>
  FAILED_PAYMENT_STATUSES.has(status);

export const resolvePaymentOutcome = (data: PaymentStatusResponse): PaymentOutcome => {
  if (data.paid === true) return "paid";
  if (isFailedPaymentStatus(data.status)) return "failed";
  return "pending";
};
