"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { ArrowLeft, CheckCircle, Clock, Loader2, RefreshCw, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, Card, CardContent } from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import { formatDateLong, formatNumber } from "@/lib/utils";
import { usePaymentStatus } from "@dashboard/hooks";
import { resolvePaymentOutcome } from "@dashboard/payment-status";
import type { PaymentStatusResponse } from "@dashboard/types";

interface PaymentStatusCheckerProps {
  invoiceId: string;
  onTerminalStatus?: () => void;
}

const BILLING_ROUTE = "/dashboard/billing";

const StatusLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Card className="border-border w-full max-w-md rounded-2xl">
      <CardContent className="flex flex-col items-center gap-4 pt-8 text-center">
        {children}
      </CardContent>
    </Card>
  </div>
);

const BackButton = ({ label = "Назад до тарифів" }: { label?: string }) => (
  <Link href={BILLING_ROUTE}>
    <Button variant="outline" className="mt-2 gap-2">
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  </Link>
);

const PaymentStatusChecker = ({ invoiceId, onTerminalStatus }: PaymentStatusCheckerProps) => {
  const router = useRouter();
  const { data, error, isError, hasTimedOut } = usePaymentStatus(invoiceId);

  const outcome = data ? resolvePaymentOutcome(data) : null;
  const isNotFound = error instanceof ApiError && error.status === 404;
  const isTerminal = outcome === "paid" || outcome === "failed";

  useEffect(() => {
    if (isNotFound) {
      onTerminalStatus?.();
      router.replace(BILLING_ROUTE);
    } else if (isTerminal) {
      onTerminalStatus?.();
    }
  }, [isNotFound, isTerminal, onTerminalStatus, router]);

  if (isNotFound) return <RedirectingState />;
  if (outcome === "paid" && data) return <PaidState data={data} />;
  if (outcome === "failed") return <FailedState />;
  if (hasTimedOut) return <ProcessingState />;
  if (isError) return <ErrorState />;
  return <ConfirmingState />;
};

const ConfirmingState = () => (
  <StatusLayout>
    <Loader2 className="text-primary h-12 w-12 animate-spin" aria-hidden="true" />
    <h1 className="font-display text-2xl font-bold">Підтверджуємо оплату…</h1>
    <p className="text-muted-foreground">Зачекайте, це займе кілька секунд.</p>
  </StatusLayout>
);

const RedirectingState = () => (
  <StatusLayout>
    <Loader2 className="text-primary h-12 w-12 animate-spin" aria-hidden="true" />
    <p className="text-muted-foreground">Переходимо до тарифів…</p>
  </StatusLayout>
);

const ProcessingState = () => (
  <StatusLayout>
    <Clock className="text-primary h-12 w-12" aria-hidden="true" />
    <h1 className="font-display text-2xl font-bold">Оплата обробляється</h1>
    <p className="text-muted-foreground">
      Тариф увімкнеться автоматично — оновіть сторінку за хвилину.
    </p>
    <BackButton />
  </StatusLayout>
);

const ErrorState = () => (
  <StatusLayout>
    <XCircle className="text-destructive h-12 w-12" aria-hidden="true" />
    <h1 className="font-display text-2xl font-bold">Не вдалося перевірити оплату</h1>
    <p className="text-muted-foreground">
      Статус оплати тимчасово недоступний. Спробуйте оновити сторінку за хвилину.
    </p>
    <BackButton />
  </StatusLayout>
);

const FailedState = () => (
  <StatusLayout>
    <XCircle className="text-destructive h-12 w-12" aria-hidden="true" />
    <h1 className="font-display text-2xl font-bold">Оплата не пройшла</h1>
    <p className="text-muted-foreground">Кошти не списано. Перевірте картку та спробуйте ще раз.</p>
    <Link href={BILLING_ROUTE}>
      <Button className="mt-2 gap-2">
        <RefreshCw className="h-4 w-4" />
        Спробувати ще раз
      </Button>
    </Link>
  </StatusLayout>
);

const PaidState = ({ data }: { data: PaymentStatusResponse }) => (
  <StatusLayout>
    <CheckCircle className="text-success h-12 w-12" aria-hidden="true" />
    <div className="space-y-1">
      <h1 className="font-display text-2xl font-bold">Оплата успішна</h1>
      <p className="text-muted-foreground">Тариф активовано.</p>
    </div>

    <div className="border-border mt-2 w-full rounded-xl border p-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs">Ваш тариф</p>
          <p className="text-primary text-xl font-bold tracking-wide uppercase">
            {data.current_plan_title ?? data.current_plan}
          </p>
        </div>
        <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium">
          Активний
        </span>
      </div>

      {data.minutes > 0 && (
        <div className="border-border mt-3 flex items-center justify-between border-t pt-3 text-sm">
          <span className="text-muted-foreground">Ліміт хвилин</span>
          <span className="font-medium">{formatNumber(data.minutes)} хв</span>
        </div>
      )}

      {data.expires_at && (
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Тариф діє до</span>
          <span className="font-medium">{formatDateLong(data.expires_at)}</span>
        </div>
      )}

      {data.auto_charge && data.next_charge_at && (
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Наступне списання</span>
          <span className="font-medium">{formatDateLong(data.next_charge_at)}</span>
        </div>
      )}
    </div>

    <BackButton label="Готово" />
  </StatusLayout>
);

export default PaymentStatusChecker;
