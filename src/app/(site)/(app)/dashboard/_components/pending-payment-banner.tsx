"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock } from "lucide-react";
import { Alert, AlertDescription, buttonVariants } from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import { clearPendingBillingPayment, getPendingBillingPayment } from "@/lib/billing-checkout";
import { useMe } from "@/lib/hooks";
import { usePaymentStatus } from "@dashboard/hooks";
import { resolvePaymentOutcome } from "@dashboard/payment-status";

const BILLING_SUCCESS_ROUTE = "/dashboard/billing/success";

export const PendingPaymentBanner = () => {
  const pathname = usePathname();
  const { data: account } = useMe();
  const isSuccessRoute = pathname === BILLING_SUCCESS_ROUTE;

  const pending = isSuccessRoute ? null : getPendingBillingPayment();
  const belongsToCurrentAccount =
    pending != null && account != null && account.id === pending.accountId;
  const invoiceId = belongsToCurrentAccount ? pending.invoiceId : null;

  const { data, error } = usePaymentStatus(invoiceId);
  const outcome = data ? resolvePaymentOutcome(data) : null;
  const isResolved = outcome !== null && outcome !== "pending";
  const isNotFound = error instanceof ApiError && error.status === 404;

  useEffect(() => {
    if (isResolved || isNotFound) clearPendingBillingPayment();
  }, [isResolved, isNotFound]);

  if (!invoiceId || outcome !== "pending") return null;

  return (
    <Alert variant="warning" className="flex flex-wrap items-center gap-3">
      <Clock aria-hidden="true" className="shrink-0" />
      <AlertDescription className="flex-1">
        Платіж обробляється. Тариф увімкнеться автоматично, щойно банк підтвердить оплату — зазвичай
        хвилина, іноді до 10–15 хвилин.
      </AlertDescription>
      <Link href={BILLING_SUCCESS_ROUTE} className={buttonVariants({ size: "sm" })}>
        Перевірити статус
      </Link>
    </Alert>
  );
};
