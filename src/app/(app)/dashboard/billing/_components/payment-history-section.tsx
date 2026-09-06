"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Download, History, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import { formatDateShort, formatNumber } from "@/lib/utils";
import { downloadReceipt } from "@dashboard/hooks";
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
  const queryClient = useQueryClient();
  const [showAll, setShowAll] = useState(false);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);
  const visiblePayments = showAll ? payments : payments.slice(0, INITIAL_PAYMENT_COUNT);

  const handleDownload = async (invoiceId: string) => {
    try {
      setDownloadingInvoiceId(invoiceId);
      await downloadReceipt(invoiceId);
    } catch (error) {
      if (error instanceof ApiError && error.code === "receipt_not_ready") {
        toast.error("Квитанція з'явиться після успішної оплати рахунку.");
        queryClient.invalidateQueries({ queryKey: ["billing", "history"] });
      } else if (error instanceof ApiError && error.code === "receipt_unavailable") {
        toast.error("Банк тимчасово не надав квитанцію. Спробуйте пізніше.");
      } else {
        toast.error(error instanceof Error ? error.message : "Не вдалося завантажити квитанцію.");
      }
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

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
                  {["Дата", "Опис", "Сума", "Статус", "Квитанція"].map((heading) => (
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
                  <PaymentRow
                    key={payment.id}
                    payment={payment}
                    isDownloading={downloadingInvoiceId === payment.invoice_id}
                    onDownload={handleDownload}
                  />
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
  isDownloading: boolean;
  onDownload: (invoiceId: string) => Promise<void>;
}

const PaymentRow = ({ payment, isDownloading, onDownload }: PaymentRowProps) => {
  const displayUsd = payment.price_usd != null ? `$${payment.price_usd}` : null;
  const receiptLabel = `INV-${payment.id.toString().padStart(4, "0")}`;
  const invoiceId = payment.invoice_id;
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
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground text-xs">{receiptLabel}</span>
          {payment.has_receipt && invoiceId && (
            <button
              type="button"
              onClick={() => onDownload(invoiceId)}
              disabled={isDownloading}
              className="text-primary hover:text-primary/80 hover:bg-primary/5 cursor-pointer rounded p-1 transition-colors disabled:opacity-50"
              aria-label={`Завантажити квитанцію ${receiptLabel}`}
              title="Завантажити квитанцію"
            >
              {isDownloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
