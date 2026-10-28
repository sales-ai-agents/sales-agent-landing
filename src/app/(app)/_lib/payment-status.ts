import type { BillingState, PaymentStatusResponse } from "@dashboard/types";

export type PaymentOutcome = BillingState;

export const resolvePaymentOutcome = (data: PaymentStatusResponse): PaymentOutcome => {
  if (data.state) return data.state;
  return data.paid ? "paid" : "pending";
};
