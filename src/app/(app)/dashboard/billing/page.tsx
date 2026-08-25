"use client";

import { useState } from "react";
import { CreditCard, Clock, Receipt, Sparkles, Check } from "lucide-react";

import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageLoading, PageError } from "@/components/dashboard/page-states";
import { ChangePlanDialog } from "@/components/dashboard/change-plan-dialog";
import { useBillingPlans, useBillingHistory } from "@dashboard/hooks/use-billing";
import type { BillingPlan, PaymentHistoryItem } from "@dashboard/types";

export default function BillingPage() {
  const { data: billing, isLoading, isError, refetch } = useBillingPlans();
  const { data: historyData } = useBillingHistory();
  const [showChangePlan, setShowChangePlan] = useState(false);

  if (isLoading) return <PageLoading />;
  if (isError || !billing) return <PageError onRetry={() => refetch()} />;

  const currentPlanData = billing.plans.find((p) => p.key === billing.current);
  const payments = historyData?.payments ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Тарифи і Оплата</h1>
        <p className="text-muted-foreground">Керуйте підпискою та переглядайте історію платежів</p>
      </div>

      <CurrentPlanCard
        current={billing.current}
        plan={currentPlanData}
        expiresAt={billing.expires_at}
        minutes={billing.minutes}
        onChangePlan={() => setShowChangePlan(true)}
      />

      <PlansGrid
        plans={billing.plans}
        currentKey={billing.current}
        onSelect={() => setShowChangePlan(true)}
      />

      {payments.length > 0 && <PaymentHistorySection payments={payments} />}

      {showChangePlan && (
        <ChangePlanDialog
          plans={billing.plans}
          currentPlanKey={billing.current}
          onClose={() => setShowChangePlan(false)}
        />
      )}
    </div>
  );
}

interface CurrentPlanCardProps {
  current: string;
  plan: BillingPlan | undefined;
  expiresAt: string | null;
  minutes: number;
  onChangePlan: () => void;
}

function CurrentPlanCard({
  current,
  plan,
  expiresAt,
  minutes,
  onChangePlan,
}: CurrentPlanCardProps) {
  const isTrial = current === "trial";

  return (
    <Card className="border-border rounded-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CreditCard className="text-primary h-5 w-5" />
          <h2 className="font-display text-2xl font-semibold">Поточний тариф</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold">{plan?.title ?? (isTrial ? "Пробний" : current)}</p>
            {plan && (
              <p className="text-muted-foreground text-sm">
                {plan.price_uah} грн/міс &middot; {plan.minutes} хвилин
                {plan.agents > 0 ? ` · ${plan.agents} агентів` : " · без обмежень агентів"}
              </p>
            )}
            {isTrial && (
              <p className="text-muted-foreground text-sm">
                Безкоштовний пробний період &middot; {minutes} хвилин
              </p>
            )}
          </div>
          <Badge variant="success">{isTrial ? "Тріал" : "Активний"}</Badge>
        </div>

        {expiresAt && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>Наступне списання: {formatDate(expiresAt)}</span>
          </div>
        )}

        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span>Ліміт хвилин</span>
            <span className="font-medium">{minutes} хв</span>
          </div>
          <Progress value={0} className="h-3" />
          <p className="text-muted-foreground mt-1 text-xs">
            Дані з&apos;являться після першого дзвінка
          </p>
        </div>

        <Button onClick={onChangePlan}>{isTrial ? "Обрати тариф" : "Змінити тариф"}</Button>
      </CardContent>
    </Card>
  );
}

interface PlansGridProps {
  plans: BillingPlan[];
  currentKey: string;
  onSelect: () => void;
}

function PlansGrid({ plans, currentKey, onSelect }: PlansGridProps) {
  return (
    <Card className="border-border rounded-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Sparkles className="text-primary h-5 w-5" />
          <h2 className="font-display text-2xl font-semibold">Доступні тарифи</h2>
        </div>
        <CardDescription>Оберіть тариф, що підходить вашому бізнесу</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.key === currentKey;
            return (
              <div
                key={plan.key}
                className="border-border hover:border-primary/50 flex flex-col rounded-xl border p-5 transition-colors"
              >
                <h3 className="font-display mb-1 text-lg font-semibold">{plan.title}</h3>
                <div className="mb-3">
                  <span className="text-2xl font-bold">{plan.price_uah} грн</span>
                  <span className="text-muted-foreground text-sm">/міс</span>
                </div>
                <ul className="mb-4 space-y-1.5 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="text-primary h-3.5 w-3.5" />
                    {plan.minutes} хвилин
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-primary h-3.5 w-3.5" />
                    {plan.agents === 0 ? "Необмежено агентів" : `${plan.agents} агентів`}
                  </li>
                </ul>
                <div className="mt-auto">
                  {isCurrent ? (
                    <Badge variant="success">Поточний</Badge>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full" onClick={onSelect}>
                      Обрати
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

interface PaymentHistorySectionProps {
  payments: PaymentHistoryItem[];
}

function PaymentHistorySection({ payments }: PaymentHistorySectionProps) {
  return (
    <Card className="border-border rounded-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Receipt className="text-primary h-5 w-5" />
          <h2 className="font-display text-2xl font-semibold">Історія платежів</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="border-border flex items-center justify-between border-b pb-3 last:border-0"
            >
              <div>
                <p className="text-sm font-medium">{payment.plan}</p>
                <p className="text-muted-foreground text-xs">{formatDate(payment.created_at)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{payment.amount_uah} грн</span>
                <PaymentStatusBadge status={payment.status} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "success":
      return <Badge variant="success">Оплачено</Badge>;
    case "processing":
    case "hold":
    case "created":
      return <Badge variant="outline">В процесі</Badge>;
    case "failure":
    case "reversed":
    case "expired":
      return <Badge variant="destructive">Невдалий</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
