import { ChartColumn, Phone, Users } from "lucide-react";
import { StatCard } from "@/components/dashboard";
import { Progress } from "@/components/ui";
import { formatNumber } from "@/lib/utils";

interface ContactStatsProps {
  total: number;
  processedThisMonth: number;
  conversionPct: number | null | undefined;
}

const PERCENT = 100;

const formatConversion = (value: number | null | undefined): string =>
  value !== null && value !== undefined ? `${value.toFixed(1).replace(".", ",")}%` : "—";

export const ContactStats = ({ total, processedThisMonth, conversionPct }: ContactStatsProps) => {
  const share = total > 0 ? (processedThisMonth / total) * PERCENT : 0;
  const subtitle = total > 0 ? `${share.toFixed(1)}% від загальної бази` : "від загальної бази";
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        icon={Users}
        title="Усього контактів"
        value={formatNumber(total)}
        subtitle="Вся ваша база контактів"
      />
      <StatCard
        icon={Phone}
        title="Оброблено цього місяця"
        value={
          <>
            {formatNumber(processedThisMonth)} <small>/ {formatNumber(total)}</small>
          </>
        }
        subtitle={subtitle}
        footer={<Progress value={Math.min(PERCENT, share)} aria-label="Оброблено цього місяця" />}
      />
      <StatCard
        icon={ChartColumn}
        tone="warning"
        title="Конверсія в цільову дію"
        value={formatConversion(conversionPct)}
        subtitle="Цільові дії / Всі дзвінки"
      />
    </div>
  );
};
