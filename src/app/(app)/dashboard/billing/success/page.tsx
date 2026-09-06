"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, ArrowLeft, Loader2 } from "lucide-react";

import { Button, Card, CardContent } from "@/components/ui";
import { clearPendingBillingInvoiceId, getPendingBillingInvoiceId } from "@/lib/billing-checkout";
import PaymentStatusChecker from "./_components/payment-status-checker";

const subscribeToNothing = () => () => {};
const getClientReady = () => true;
const getServerReady = () => false;
const getServerInvoiceId = () => null;

const BillingSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceIdFromUrl = searchParams.get("invoice_id") ?? searchParams.get("invoiceId");
  const storedInvoiceId = useSyncExternalStore(
    subscribeToNothing,
    getPendingBillingInvoiceId,
    getServerInvoiceId
  );
  const hasReadStorage = useSyncExternalStore(subscribeToNothing, getClientReady, getServerReady);
  const invoiceId = invoiceIdFromUrl ?? storedInvoiceId;

  useEffect(() => {
    if (!invoiceIdFromUrl && storedInvoiceId) {
      router.replace(
        `/dashboard/billing/success?invoice_id=${encodeURIComponent(storedInvoiceId)}`,
        { scroll: false }
      );
    }
  }, [invoiceIdFromUrl, router, storedInvoiceId]);

  if (!invoiceIdFromUrl && !hasReadStorage) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="text-primary h-12 w-12 animate-spin" aria-label="Завантаження" />
      </div>
    );
  }

  if (!invoiceId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="border-border w-full max-w-md rounded-2xl">
          <CardContent className="flex flex-col items-center gap-4 pt-8 text-center">
            <XCircle className="text-destructive h-12 w-12" />
            <h1 className="font-display text-2xl font-bold">Помилка</h1>
            <p className="text-muted-foreground">Відсутній ідентифікатор рахунку.</p>
            <Link href="/dashboard/billing">
              <Button variant="outline" className="mt-2 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Назад до тарифів
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PaymentStatusChecker
      invoiceId={invoiceId}
      onTerminalStatus={invoiceIdFromUrl ? clearPendingBillingInvoiceId : undefined}
    />
  );
};

export default BillingSuccessPage;
