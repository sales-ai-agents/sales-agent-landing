"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock } from "lucide-react";

import { Button } from "@/components/ui";
import { clearPendingBillingInvoiceId, getPendingBillingInvoiceId } from "@/lib/billing-checkout";
import { usePaymentStatus } from "@dashboard/hooks";
import { resolvePaymentOutcome } from "@dashboard/payment-status";

const BILLING_SUCCESS_ROUTE = "/dashboard/billing/success";

export const PendingPaymentBanner = () => {
  const pathname = usePathname();
  const isSuccessRoute = pathname === BILLING_SUCCESS_ROUTE;

  const invoiceId = isSuccessRoute ? null : getPendingBillingInvoiceId();

  const { data } = usePaymentStatus(invoiceId);
  const outcome = data ? resolvePaymentOutcome(data) : null;
  const isResolved = outcome !== null && outcome !== "pending";

  useEffect(() => {
    if (isResolved) clearPendingBillingInvoiceId();
  }, [isResolved]);

  if (!invoiceId || outcome !== "pending") return null;

  return (
    <div className="bg-warning/10 mb-4 flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Clock className="text-warning mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p className="text-sm">
          Платіж обробляється. Тариф увімкнеться автоматично, щойно банк підтвердить оплату —
          зазвичай хвилина, іноді до 10–15 хвилин.
        </p>
      </div>
      <Link href={BILLING_SUCCESS_ROUTE} className="shrink-0">
        <Button variant="outline" size="sm">
          Перевірити статус
        </Button>
      </Link>
    </div>
  );
};
