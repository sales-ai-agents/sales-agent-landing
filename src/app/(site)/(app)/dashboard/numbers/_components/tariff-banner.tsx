"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle, buttonVariants } from "@/components/ui";
import { cn, formatUsd, pluralizeNumbers } from "@/lib/utils";

interface TariffBannerProps {
  limit: number;
  used: number;
  canAdd: boolean;
  poolLimit?: number;
  poolUsed?: number;
  canClaim?: boolean;
  nextIsExtra?: boolean;
  extraPriceUsd?: number | null;
}

const formatCount = (count: number): string => `${count} ${pluralizeNumbers(count)}`;

export const TariffBanner = ({
  limit,
  used,
  canAdd,
  poolLimit,
  poolUsed,
  canClaim,
  nextIsExtra,
  extraPriceUsd,
}: TariffBannerProps) => {
  const isUnlimited = limit === 0;

  const title = isUnlimited
    ? "Тариф не обмежує кількість власних номерів"
    : `У вашому тарифі включено ${formatCount(limit)}`;

  const subtitle = isUnlimited
    ? `Підключено ${formatCount(used)}`
    : canAdd
      ? `Підключено ${used} з ${limit}. Ви можете додати ще ${formatCount(limit - used)}`
      : `Підключено ${used} з ${limit}`;

  const showPool = typeof poolLimit === "number" && poolLimit > 0;
  const poolSubtitle = showPool
    ? canClaim
      ? `Номерів від Calls4U: ${poolUsed ?? 0} з ${poolLimit}`
      : `Номерів від Calls4U у тарифі — до ${poolLimit}. Ліміт досягнуто`
    : null;

  const extraNote = nextIsExtra
    ? `Наступний номер коштує ${extraPriceUsd ? formatUsd(extraPriceUsd) : "окремо"}/міс і списується з балансу`
    : null;

  return (
    <Alert variant="info" className="flex items-center gap-3">
      <Info aria-hidden="true" />
      <div className="flex flex-1 flex-col gap-0.5">
        <AlertTitle className="line-clamp-none">{title}</AlertTitle>
        <AlertDescription>
          <p>{subtitle}</p>
          {poolSubtitle && <p>{poolSubtitle}</p>}
          {extraNote && <p className="text-foreground font-medium">{extraNote}</p>}
        </AlertDescription>
      </div>
      <Link
        className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
        href="/dashboard/balance"
      >
        Баланс
      </Link>
    </Alert>
  );
};
