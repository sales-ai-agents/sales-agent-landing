"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

import { Button, Card, CardContent } from "@/components/ui";
import PaymentStatusChecker from "./_components/payment-status-checker";

const BillingSuccessPage = () => {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoice_id");

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

  return <PaymentStatusChecker invoiceId={invoiceId} />;
};

export default BillingSuccessPage;
