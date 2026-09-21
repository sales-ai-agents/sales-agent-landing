"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button, Card, CardContent } from "@/components/ui";
import { formatDateLong } from "@/lib/utils";
import { usePaymentStatus } from "@dashboard/hooks";
import { resolvePaymentOutcome } from "@dashboard/payment-status";
import type { PaymentStatus } from "@dashboard/types";

interface PaymentStatusCheckerProps {
  invoiceId: string;
  onTerminalStatus?: () => void;
}

const FAILURE_MESSAGES: Partial<Record<PaymentStatus, string>> = {
  expired: "Час оплати минув. Спробуйте створити новий рахунок.",
  reversed: "Платіж було повернено.",
  failure: "Платіж відхилено. Перевірте картку або спробуйте ще раз.",
};

const FAILURE_TITLES: Partial<Record<PaymentStatus, string>> = {
  reversed: "Платіж повернено",
};

const DEFAULT_FAILURE_MESSAGE = "Платіж відхилено. Перевірте картку або спробуйте ще раз.";
const DEFAULT_FAILURE_TITLE = "Оплата не пройшла";

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
  <Link href="/dashboard/billing">
    <Button variant="outline" className="mt-2 gap-2">
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  </Link>
);

const PaymentStatusChecker = ({ invoiceId, onTerminalStatus }: PaymentStatusCheckerProps) => {
  const { data, isLoading, isError } = usePaymentStatus(invoiceId);
  const outcome = data ? resolvePaymentOutcome(data) : null;

  useEffect(() => {
    if (outcome === "paid" || outcome === "failed") {
      onTerminalStatus?.();
    }
  }, [outcome, onTerminalStatus]);

  if (isLoading || (!data && !isError)) {
    return (
      <StatusLayout>
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
        <h1 className="font-display text-2xl font-bold">Перевіряємо оплату...</h1>
        <p className="text-muted-foreground">Зачекайте, ми підтверджуємо ваш платіж</p>
      </StatusLayout>
    );
  }

  if (isError) {
    return (
      <StatusLayout>
        <XCircle className="text-destructive h-12 w-12" />
        <h1 className="font-display text-2xl font-bold">Помилка перевірки</h1>
        <p className="text-muted-foreground">
          Не вдалося перевірити статус оплати. Спробуйте оновити сторінку.
        </p>
        <BackButton />
      </StatusLayout>
    );
  }

  if (outcome === "paid") {
    return (
      <StatusLayout>
        <CheckCircle className="h-12 w-12 text-green-600" />
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold">Оплата успішна!</h1>
          <p className="text-muted-foreground">Ваш тариф змінено</p>
        </div>

        <div className="border-border mt-2 w-full rounded-xl border p-4 text-left">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-xs">Ваш новий тариф</p>
              <p className="text-primary text-xl font-bold tracking-wide uppercase">
                {data.current_plan}
              </p>
            </div>
            <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium">
              Активний
            </span>
          </div>
          {data.minutes > 0 && (
            <div className="border-border mt-3 flex items-center justify-between border-t pt-3 text-sm">
              <span className="text-muted-foreground">Ліміт розмов</span>
              <span className="font-medium">{data.minutes} хвилин / місяць</span>
            </div>
          )}
          {data.auto_charge && data.next_charge_at && (
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Наступне списання</span>
              <span className="font-medium">{formatDateLong(data.next_charge_at)}</span>
            </div>
          )}
          {!data.next_charge_at && data.expires_at && (
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Діє до</span>
              <span className="font-medium">{formatDateLong(data.expires_at)}</span>
            </div>
          )}
        </div>

        <BackButton label="Готово" />
      </StatusLayout>
    );
  }

  if (outcome === "failed") {
    return (
      <StatusLayout>
        <XCircle className="text-destructive h-12 w-12" />
        <h1 className="font-display text-2xl font-bold">
          {FAILURE_TITLES[data.status] ?? DEFAULT_FAILURE_TITLE}
        </h1>
        <p className="text-muted-foreground">
          {FAILURE_MESSAGES[data.status] ?? DEFAULT_FAILURE_MESSAGE}
        </p>
        <BackButton />
      </StatusLayout>
    );
  }

  return (
    <StatusLayout>
      <Loader2 className="text-primary h-12 w-12 animate-spin" />
      <h1 className="font-display text-2xl font-bold">Обробляється...</h1>
      <p className="text-muted-foreground">
        Платіж у процесі обробки. Сторінка оновиться автоматично.
      </p>
    </StatusLayout>
  );
};

export default PaymentStatusChecker;
