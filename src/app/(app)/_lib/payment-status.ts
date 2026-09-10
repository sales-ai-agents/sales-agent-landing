import type { PaymentStatusResponse } from "@dashboard/types";

export type PaymentOutcome = "paid" | "pending" | "failed";

const PENDING_PAYMENT_STATUSES = new Set(["created", "processing", "hold"]);

export const resolvePaymentOutcome = (data: PaymentStatusResponse): PaymentOutcome => {
  if (data.paid || data.status === "success") return "paid";
  if (PENDING_PAYMENT_STATUSES.has(data.status)) return "pending";
  return "failed";
};
