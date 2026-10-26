"use client";

import Link from "next/link";
import { Info } from "lucide-react";

import { Button } from "@/components/ui";
import { pluralizeUk } from "@/lib/utils";

interface TariffBannerProps {
  limit: number;
  used: number;
  canAdd: boolean;
  poolLimit?: number;
  poolUsed?: number;
  canClaim?: boolean;
}

const formatCount = (count: number): string =>
  `${count} ${pluralizeUk(count, ["номер", "номери", "номерів"])}`;

export const TariffBanner = ({
  limit,
  used,
  canAdd,
  poolLimit,
  poolUsed,
  canClaim,
}: TariffBannerProps) => {
  const isUnlimited = limit === 0;

  const title = isUnlimited
    ? "Тариф не обмежує кількість власних номерів"
    : `У вашому тарифі включено ${formatCount(limit)}`;

  const subtitle = isUnlimited
    ? `Підключено ${formatCount(used)}`
    : canAdd
      ? `Підключено ${used} з ${limit}. Ви можете додати ще ${formatCount(limit - used)}`
      : `Підключено ${used} з ${limit}. Щоб додати більше, оберіть вищий тариф`;

  const showPool = typeof poolLimit === "number" && poolLimit > 0;
  const poolSubtitle = showPool
    ? canClaim
      ? `Номерів від Calls4U: ${poolUsed ?? 0} з ${poolLimit}`
      : `Номерів від Calls4U у тарифі — до ${poolLimit}. Ліміт досягнуто`
    : null;

  return (
    <div className="bg-primary/10 flex items-center justify-between gap-4 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="text-primary mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-muted-foreground text-xs">{subtitle}</p>
          {poolSubtitle && <p className="text-muted-foreground mt-0.5 text-xs">{poolSubtitle}</p>}
        </div>
      </div>
      <Button variant="outline" size="sm" render={<Link href="/dashboard/billing" />}>
        Налаштувати
      </Button>
    </div>
  );
};
