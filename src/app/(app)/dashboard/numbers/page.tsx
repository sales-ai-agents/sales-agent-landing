"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui";
import { PageError, PageLoading } from "@/components/dashboard";
import { useNumbers, useAgents, useStats } from "@dashboard/hooks";
import { getPlanNumberAllowance } from "@/app/(app)/_lib/billing/plan-capabilities";

import { ConnectNumberDialog } from "../agents/_components/connect-number";
import { NumbersTable } from "./_components/numbers-table";
import { TariffBanner } from "./_components/tariff-banner";
import { ConnectMethods } from "./_components/connect-methods";

const NumbersPage = () => {
  const { data: numbers = [], isLoading, error, refetch } = useNumbers();
  const { data: agents = [] } = useAgents();
  const { data: stats } = useStats();

  const allowance = getPlanNumberAllowance(stats?.plan);

  if (isLoading) return <PageLoading />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold">Номери</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Номери, на які дзвонять ваші клієнти, і з яких дзвонить агент. Вхідний дзвінок потрапляє
            до того агента, що прив&apos;язаний до набраного номера
          </p>
        </div>
        <ConnectNumberDialog
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Підключити номер
            </Button>
          }
        />
      </header>

      {numbers.length > 0 && <NumbersTable numbers={numbers} agents={agents} />}

      <TariffBanner allowance={allowance} />

      <ConnectMethods onConnected={() => refetch()} />
    </div>
  );
};

export default NumbersPage;
