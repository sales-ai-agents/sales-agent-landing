import Link from "next/link";
import { ArrowRight, CardSim, Clock, Grid3x3, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui";
import { formatUsd } from "@/lib/utils";
import { LowBalanceAlert } from "./low-balance-alert";

interface SpendHeadProps {
  icon: LucideIcon;
  title: string;
  description: string;
  price: string;
  priceNote: string;
}

const SpendHead = ({ icon: Icon, title, description, price, priceNote }: SpendHeadProps) => (
  <div className="flex flex-wrap items-start gap-4">
    <span className="bg-primary/10 text-primary grid size-11 shrink-0 place-items-center rounded-full">
      <Icon className="size-5" aria-hidden="true" />
    </span>
    <span className="flex min-w-48 flex-1 flex-col gap-1">
      <b className="font-heading text-lg">{title}</b>
      <span className="text-muted-foreground text-sm">{description}</span>
    </span>
    <span className="flex flex-col items-end">
      <b className="font-heading text-2xl tabular-nums">{price}</b>
      <span className="caption text-muted-foreground">{priceNote}</span>
    </span>
  </div>
);

interface SpendOptionsProps {
  minutePriceUsd: number;
  extraNumberPriceUsd: number;
  alertBelowUsd: number;
  alertOptionsUsd: number[];
}

export const SpendOptions = ({
  minutePriceUsd,
  extraNumberPriceUsd,
  alertBelowUsd,
  alertOptionsUsd,
}: SpendOptionsProps) => (
  <div className="grid gap-4 lg:grid-cols-2">
    <Card className="flex flex-col gap-5 p-6">
      <SpendHead
        icon={Clock}
        title="Хвилини понад тариф"
        description="Коли хвилини тарифу закінчаться, агенти дзвонять далі. Кожна хвилина списується з рахунку сама, нічого купувати не треба"
        price={formatUsd(minutePriceUsd)}
        priceNote="за 1 хвилину"
      />
      <LowBalanceAlert current={alertBelowUsd} options={alertOptionsUsd} />
    </Card>
    <Card className="hover:ring-primary/30 flex flex-col gap-5 p-6 transition-shadow">
      <Link href="/dashboard/numbers" className="flex flex-1 flex-col gap-5">
        <SpendHead
          icon={CardSim}
          title="Номер понад тариф"
          description="Кожен додатковий номер списується з рахунку раз на 30 днів. Якщо не вистачить на продовження, номер зупиниться й запрацює після поповнення"
          price={formatUsd(extraNumberPriceUsd)}
          priceNote="за 30 днів"
        />
        <span className="border-border mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            <Grid3x3 className="size-4" aria-hidden="true" />
            Номери та підключення
          </span>
          <span className="text-primary flex items-center gap-1 font-medium">
            Перейти до номерів <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </span>
      </Link>
    </Card>
  </div>
);
