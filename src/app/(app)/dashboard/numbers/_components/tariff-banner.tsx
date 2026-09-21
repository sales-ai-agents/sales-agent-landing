"use client";

import Link from "next/link";
import { Info } from "lucide-react";

import { Button } from "@/components/ui";

interface TariffBannerProps {
  allowance: number;
}

const formatAllowance = (count: number): string => {
  if (count === 1) return "1 номер";
  if (count >= 2 && count <= 4) return `${count} номери`;
  return `${count} номерів`;
};

export const TariffBanner = ({ allowance }: TariffBannerProps) => {
  return (
    <div className="bg-primary/10 flex items-center justify-between gap-4 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="text-primary mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="text-sm font-medium">
            У вашому тарифі включено {formatAllowance(allowance)}
          </p>
          <p className="text-muted-foreground text-xs">
            Ви можете використовувати цей номер або додати додаткові
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" render={<Link href="/dashboard/billing" />}>
        Налаштувати
      </Button>
    </div>
  );
};
