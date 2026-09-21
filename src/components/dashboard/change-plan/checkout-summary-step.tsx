import { Check, ShieldCheck } from "lucide-react";

import { Badge, Button, Checkbox, DialogTitle, Separator } from "@/components/ui";
import { cn } from "@/lib/utils";
import { getPlanFeatures, POPULAR_PLAN_KEY } from "@dashboard/billing";
import type { BillingPeriod, BillingPlan } from "@dashboard/types";

interface CheckoutSummaryStepProps {
  plan: BillingPlan;
  period: BillingPeriod;
  saveCard: boolean;
  autoRenew: boolean;
  isProcessing: boolean;
  onSaveCardChange: (value: boolean) => void;
  onAutoRenewChange: (value: boolean) => void;
  onProceed: () => void;
  onBack: () => void;
}

const resolvePriceUsd = (plan: BillingPlan, isYear: boolean): number =>
  isYear && plan.year ? plan.year.price_usd : plan.price_usd;

export const CheckoutSummaryStep = ({
  plan,
  period,
  saveCard,
  autoRenew,
  isProcessing,
  onSaveCardChange,
  onAutoRenewChange,
  onProceed,
  onBack,
}: CheckoutSummaryStepProps) => {
  const isYear = period === "year";
  const priceUsd = resolvePriceUsd(plan, isYear);

  return (
    <div className="space-y-6 p-4">
      <DialogTitle className="sr-only">Оплата тарифу {plan.title}</DialogTitle>
      <div className="grid gap-4 md:grid-cols-3">
        <SelectedPlanCard plan={plan} priceUsd={priceUsd} isYear={isYear} onChange={onBack} />
        <div className="md:col-span-2">
          <PaymentPanel
            priceUsd={priceUsd}
            isYear={isYear}
            saveCard={saveCard}
            autoRenew={autoRenew}
            isProcessing={isProcessing}
            onSaveCardChange={onSaveCardChange}
            onAutoRenewChange={onAutoRenewChange}
            onProceed={onProceed}
          />
        </div>
      </div>
      <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
        ← Назад
      </Button>
    </div>
  );
};

interface SelectedPlanCardProps {
  plan: BillingPlan;
  priceUsd: number;
  isYear: boolean;
  onChange: () => void;
}

const SelectedPlanCard = ({ plan, priceUsd, isYear, onChange }: SelectedPlanCardProps) => {
  const features = getPlanFeatures(plan);
  const isPopular = plan.key === POPULAR_PLAN_KEY;

  return (
    <div className="border-border/60 bg-muted/20 flex flex-col rounded-xl border p-6">
      <div className="flex items-start justify-between">
        <span className="text-foreground text-lg font-medium">Обраний тариф</span>
        <Button variant="link" onClick={onChange} className="text-primary h-auto p-0 text-sm">
          Змінити
        </Button>
      </div>

      <h3 className="mt-4 text-2xl font-bold tracking-wide uppercase">{plan.title}</h3>

      {isPopular && (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/10 mt-3 w-fit rounded-full px-4 font-normal">
          Найпопулярніший
        </Badge>
      )}

      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold">${priceUsd}</span>
        <span className="text-muted-foreground text-sm">/ {isYear ? "рік" : "місяць"}</span>
      </div>

      <ul className="mt-5 space-y-2 text-sm">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="text-foreground mt-0.5 h-4 w-4 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface PaymentPanelProps {
  priceUsd: number;
  isYear: boolean;
  saveCard: boolean;
  autoRenew: boolean;
  isProcessing: boolean;
  onSaveCardChange: (value: boolean) => void;
  onAutoRenewChange: (value: boolean) => void;
  onProceed: () => void;
}

const PaymentPanel = ({
  priceUsd,
  isYear,
  saveCard,
  autoRenew,
  isProcessing,
  onSaveCardChange,
  onAutoRenewChange,
  onProceed,
}: PaymentPanelProps) => {
  const autoRenewDescription = `Я погоджуюсь, що з цієї картки буде автоматично списуватись оплата відповідно до обраного тарифу ($${priceUsd}/${isYear ? "рік" : "місяць"}) до моменту скасування підписки.`;

  return (
    <div className="border-border/60 bg-muted/20 flex flex-col rounded-xl border p-6">
      <div className="flex items-center justify-between">
        <span className="text-foreground text-lg font-medium">Оплата</span>
        <span className="text-muted-foreground flex items-center gap-1 text-xs">
          <ShieldCheck className="h-3.5 w-3.5" />
          Безпечна оплата
        </span>
      </div>

      <div className="bg-primary/10 mt-4 flex items-start gap-3 rounded-lg p-3">
        <ShieldCheck className="text-primary mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="text-foreground text-sm font-medium">Оплата відбувається через WayForPay</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Ваші платіжні дані захищені та обробляються сервісом WayForPay
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <PaymentOption
          checked={saveCard}
          disabled={isProcessing}
          onChange={onSaveCardChange}
          title="Зберегти картку для майбутніх платежів"
          description="Я погоджуюсь на збереження платіжної картки в WayForPay, щоб швидко оплачувати наступні рахунки."
        />
        <PaymentOption
          checked={autoRenew}
          disabled={isProcessing || !saveCard}
          onChange={onAutoRenewChange}
          title="Даю згоду на автоматичне списання коштів"
          description={autoRenewDescription}
        />
      </div>

      <Separator className="my-5" />

      <TotalRow priceUsd={priceUsd} isYear={isYear} />

      <Button size="lg" className="mt-5 w-full gap-2" onClick={onProceed} disabled={isProcessing}>
        <ShieldCheck className="h-4 w-4" />
        {isProcessing ? "Перенаправлення..." : "Оплата через WayForPay"}
      </Button>

      <p className="text-muted-foreground mt-3 text-center text-xs">
        Після натискання ви будете перенаправлені
        <br />
        на захищену сторінку WayForPay
      </p>
    </div>
  );
};

interface PaymentOptionProps {
  checked: boolean;
  disabled: boolean;
  onChange: (value: boolean) => void;
  title: string;
  description: string;
}

const PaymentOption = ({ checked, disabled, onChange, title, description }: PaymentOptionProps) => (
  <label className={cn("flex gap-3", disabled && "cursor-not-allowed opacity-60")}>
    <Checkbox
      checked={checked}
      disabled={disabled}
      onCheckedChange={(value) => onChange(value)}
      className="mt-0.5"
    />
    <div>
      <p className="text-foreground text-sm font-medium">{title}</p>
      <p className="text-muted-foreground mt-1 text-xs">{description}</p>
    </div>
  </label>
);

interface TotalRowProps {
  priceUsd: number;
  isYear: boolean;
}

const TotalRow = ({ priceUsd, isYear }: TotalRowProps) => (
  <div className="flex items-end justify-between">
    <div>
      <p className="text-foreground text-sm font-medium">До сплати</p>
      <p className="mt-1 text-2xl font-semibold">${priceUsd}</p>
    </div>
    <div className="text-left">
      <p className="text-foreground text-sm">Періодний платіж</p>
      <p className="text-muted-foreground text-sm">{isYear ? "Щорічно" : "Щомісячно"}</p>
    </div>
  </div>
);
