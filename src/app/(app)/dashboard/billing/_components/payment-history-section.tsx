"use client";

import { useState } from "react";
import { AlertTriangle, History, Loader2 } from "lucide-react";

import { Button } from "@/components/ui";
import { formatDateShort, formatNumber } from "@/lib/utils";
import type { PaymentHistoryItem } from "@dashboard/types";

import { PaymentStatusLabel } from "./payment-status-label";

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
    <section className="border-border bg-background rounded-2xl border p-6">
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
            Тут відображатиметься історія платежів та офіційні квитанції
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {["Дата", "Опис", "Сума", "Статус"].map((heading) => (
                    <th
                      key={heading}
                      className="text-muted-foreground px-3 py-2 text-left text-sm font-medium"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visiblePayments.map((payment) => (
                  <PaymentRow key={payment.id} payment={payment} />
                ))}
              </tbody>
            </table>
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

const PaymentRow = ({ payment }: PaymentRowProps) => {
  const displayUsd = payment.price_usd != null ? `$${payment.price_usd}` : null;
  const paymentDate = payment.paid_at ?? payment.created_at;

  return (
    <tr className="border-b last:border-0">
      <td className="px-3 py-2.5">{formatDateShort(paymentDate)}</td>
      <td className="px-3 py-2.5">
        Тариф {payment.plan.toUpperCase()} —{` `}
        {new Date(paymentDate).toLocaleString("uk-UA", {
          month: "long",
          year: "numeric",
        })}
      </td>
      <td className="px-3 py-2.5 font-medium">
        <div className="flex flex-col">
          <span>{displayUsd ?? `${formatNumber(payment.amount_uah)} грн`}</span>
          {displayUsd && (
            <span className="text-muted-foreground text-xs font-normal">
              {formatNumber(payment.amount_uah)} грн
              {payment.usd_rate ? ` (${payment.usd_rate.toFixed(2)} ₴/$)` : ""}
            </span>
          )}
        </div>
      </td>
      <td className="px-3 py-2.5">
        <PaymentStatusLabel status={payment.status} />
      </td>
    </tr>
  );
};
