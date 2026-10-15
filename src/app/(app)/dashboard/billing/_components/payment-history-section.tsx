"use client";

import { useState } from "react";
import { AlertTriangle, History, Loader2 } from "lucide-react";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { formatDateShort, formatMonthYear, formatNumber } from "@/lib/utils";
import type { PaymentHistoryItem } from "@dashboard/types";

import { PaymentStatusLabel } from "./payment-status-label";

const isPaidPayment = (payment: PaymentHistoryItem): boolean => payment.status === "success";

const INITIAL_PAYMENT_COUNT = 3;

interface PaymentHistorySectionProps {
  payments?: PaymentHistoryItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export const PaymentHistorySection = ({
  payments = [],
  isLoading,
  isError,
  onRetry,
}: PaymentHistorySectionProps) => {
  const [showAll, setShowAll] = useState(false);
  const visiblePayments = showAll ? payments : payments.slice(0, INITIAL_PAYMENT_COUNT);

  return (
    <section className="border-border bg-background rounded-2xl border p-4 sm:p-6">
      <h2 className="text-muted-foreground mb-4 text-sm font-medium">Історія платежів</h2>

      {isLoading ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-8">
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
          <p className="text-sm">Завантаження історії платежів...</p>
        </div>
      ) : isError ? (
        <div className="border-destructive/30 bg-destructive/5 flex flex-col items-center justify-center gap-3 rounded-lg border p-6 text-center">
          <AlertTriangle className="text-destructive h-8 w-8" />
          <div>
            <p className="text-destructive text-sm font-medium">
              Не вдалося завантажити історію платежів
            </p>
            <p className="text-muted-foreground mt-1 text-xs">Спробуйте повторити запит.</p>
          </div>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Повторити
          </Button>
        </div>
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8">
          <History className="text-muted-foreground h-10 w-10" />
          <p className="text-sm font-semibold">Платежів ще немає</p>
          <p className="text-muted-foreground text-xs">
            Тут відображатиметься історія ваших платежів
          </p>
        </div>
      ) : (
        <>
          <div className="divide-border divide-y sm:hidden">
            {visiblePayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </div>

          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  {["Дата", "Опис", "Сума", "Статус", "Інвойс"].map((heading) => (
                    <TableHead key={heading} className="px-3 whitespace-nowrap">
                      {heading}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {visiblePayments.map((payment) => (
                  <PaymentRow key={payment.id} payment={payment} />
                ))}
              </TableBody>
            </Table>
          </div>

          {payments.length > INITIAL_PAYMENT_COUNT && (
            <div className="mt-3 text-center">
              <button
                type="button"
                className="text-primary cursor-pointer text-sm hover:underline"
                onClick={() => setShowAll((visible) => !visible)}
              >
                {showAll ? "Приховати" : "Показати більше"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

interface PaymentRowProps {
  payment: PaymentHistoryItem;
}

const getPaymentDate = (payment: PaymentHistoryItem): string =>
  payment.paid_at ?? payment.created_at;

const formatPaymentDescription = (payment: PaymentHistoryItem): string => {
  const period = formatMonthYear(getPaymentDate(payment));
  return `Тариф ${payment.plan.toUpperCase()} — ${period}`;
};

const PaymentAmount = ({ payment }: { payment: PaymentHistoryItem }) => {
  const displayUsd = payment.price_usd != null ? `$${payment.price_usd}` : null;

  return (
    <div className="flex flex-col">
      <span>{displayUsd ?? `${formatNumber(payment.amount_uah)} грн`}</span>
      {displayUsd && (
        <span className="text-muted-foreground text-xs font-normal">
          {formatNumber(payment.amount_uah)} грн
          {payment.usd_rate ? ` (${payment.usd_rate.toFixed(2)}$)` : ""}
        </span>
      )}
    </div>
  );
};

const PaymentRow = ({ payment }: PaymentRowProps) => (
  <TableRow>
    <TableCell className="px-3 py-2.5 whitespace-nowrap">
      {formatDateShort(getPaymentDate(payment))}
    </TableCell>
    <TableCell className="px-3 py-2.5">{formatPaymentDescription(payment)}</TableCell>
    <TableCell className="px-3 py-2.5 font-medium">
      <PaymentAmount payment={payment} />
    </TableCell>
    <TableCell className="px-3 py-2.5">
      <PaymentStatusLabel status={payment.status} paid={isPaidPayment(payment)} />
    </TableCell>
    <TableCell className="text-muted-foreground px-3 py-2.5 font-mono text-xs">
      {payment.invoice_id}
    </TableCell>
  </TableRow>
);

const PaymentCard = ({ payment }: PaymentRowProps) => (
  <div className="flex flex-col gap-2 py-3">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{formatPaymentDescription(payment)}</p>
        <p className="text-muted-foreground text-xs">{formatDateShort(getPaymentDate(payment))}</p>
      </div>
      <PaymentStatusLabel status={payment.status} paid={isPaidPayment(payment)} />
    </div>
    <div className="flex items-end justify-between gap-3 text-sm font-medium">
      <PaymentAmount payment={payment} />
      <span className="text-muted-foreground font-mono text-xs font-normal">
        {payment.invoice_id}
      </span>
    </div>
  </div>
);
