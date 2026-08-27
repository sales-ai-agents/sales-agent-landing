"use client";

import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button, Card, CardContent } from "@/components/ui";
import { usePaymentStatus } from "@dashboard/hooks";
import { formatDateLong } from "@/lib/utils";

interface PaymentStatusCheckerProps {
  invoiceId: string;
}

export function PaymentStatusChecker({ invoiceId }: PaymentStatusCheckerProps) {
  const { data, isLoading, isError } = usePaymentStatus(invoiceId);

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

  if (data.paid) {
    return (
      <StatusLayout>
        <CheckCircle className="text-primary h-12 w-12" />
        <h1 className="font-display text-2xl font-bold">Оплата пройшла</h1>
        <p className="text-muted-foreground">
          Тариф <span className="font-medium">{data.current_plan}</span> активовано.
          {data.minutes > 0 && ` Ліміт: ${data.minutes} хвилин.`}
          {data.expires_at && ` Наступне списання: ${formatDateLong(data.expires_at)}.`}
        </p>
        <BackButton label="До тарифів" />
      </StatusLayout>
    );
  }

  if (data.status === "failure" || data.status === "expired" || data.status === "reversed") {
    return (
      <StatusLayout>
        <XCircle className="text-destructive h-12 w-12" />
        <h1 className="font-display text-2xl font-bold">Оплата не пройшла</h1>
        <p className="text-muted-foreground">
          {data.status === "expired" && "Час оплати минув. Спробуйте створити новий рахунок."}
          {data.status === "failure" && "Платіж відхилено. Перевірте картку або спробуйте ще раз."}
          {data.status === "reversed" && "Платіж було повернено."}
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
}

function StatusLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="border-border w-full max-w-md rounded-2xl">
        <CardContent className="flex flex-col items-center gap-4 pt-8 text-center">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}

function BackButton({ label = "Назад до тарифів" }: { label?: string }) {
  return (
    <Link href="/dashboard/billing">
      <Button variant="outline" className="mt-2 gap-2">
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Button>
    </Link>
  );
}
