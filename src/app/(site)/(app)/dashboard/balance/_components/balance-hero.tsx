import { Plus } from "lucide-react";
import { Badge, Button, Card, buttonVariants } from "@/components/ui";
import { cn, formatNumber, formatUsd } from "@/lib/utils";

interface BalanceHeroProps {
  balanceUsd: number;
  extraMinutes: number;
  extraNumbers: number;
  extraNumberPriceUsd: number;
  onTopUp: () => void;
}

export const BalanceHero = ({
  balanceUsd,
  extraMinutes,
  extraNumbers,
  extraNumberPriceUsd,
  onTopUp,
}: BalanceHeroProps) => (
  <Card className="bg-primary text-primary-foreground flex flex-col gap-6 p-8">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="caption text-primary-foreground/70">Рахунок</span>
      <Badge className="bg-primary-foreground/15 text-primary-foreground">
        Для хвилин і номерів
      </Badge>
    </div>
    <b className="font-heading text-6xl tabular-nums">{formatUsd(balanceUsd)}</b>
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <span className="caption text-primary-foreground/70">Вистачить понад тариф</span>
        <b className="text-lg tabular-nums">≈ {formatNumber(extraMinutes)} хв</b>
      </div>
      <div className="flex flex-col gap-1">
        <span className="caption text-primary-foreground/70">Або на номери</span>
        <b className="text-lg tabular-nums">
          {extraNumbers} × {formatUsd(extraNumberPriceUsd)}
        </b>
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      <Button className="bg-card text-primary hover:bg-card/90" onClick={onTopUp}>
        <Plus aria-hidden="true" />
        Поповнити
      </Button>
      <a
        href="#history"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25"
        )}
      >
        Історія операцій
      </a>
    </div>
  </Card>
);
