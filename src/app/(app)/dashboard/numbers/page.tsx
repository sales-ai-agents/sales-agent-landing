"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui";
import { PageError, PageLoading } from "@/components/dashboard";
import {
  useNumbers,
  useNumbersMeta,
  useNumbersClaimMeta,
  useOutboundCallerId,
  useAgents,
} from "@dashboard/hooks";

import { ConnectNumberDialog } from "../agents/_components/connect-number";
import { CallerIdBanner } from "./_components/caller-id-banner";
import { NumbersTable } from "./_components/numbers-table";
import { TariffBanner } from "./_components/tariff-banner";
import { ConnectMethods } from "./_components/connect-methods";

const NumbersPage = () => {
  const { data: numbers = [], isLoading, error, refetch } = useNumbers();
  const { data: allowance } = useNumbersMeta();
  const { data: claimMeta } = useNumbersClaimMeta();
  const { data: callerId } = useOutboundCallerId();
  const { data: agents = [] } = useAgents();

  if (isLoading) return <PageLoading message="Завантажуємо номери..." />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold">Номери</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Номери, на які дзвонять ваші клієнти, і з яких дзвонить агент. Вхідний дзвінок потрапляє
            до того агента, що прив&apos;язаний до набраного номера
          </p>
        </div>
        <ConnectNumberDialog
          trigger={
            <Button className="w-full shrink-0 lg:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Підключити номер
            </Button>
          }
        />
      </header>

      {callerId && (
        <CallerIdBanner
          phone={callerId.phone}
          isOwn={callerId.isOwn}
          used={callerId.used}
          onConnected={() => refetch()}
        />
      )}

      {numbers.length > 0 && <NumbersTable numbers={numbers} agents={agents} />}

      {allowance && (
        <TariffBanner
          limit={allowance.limit}
          used={allowance.used}
          canAdd={allowance.can_add}
          poolLimit={claimMeta?.pool_limit}
          poolUsed={claimMeta?.pool_used}
          canClaim={claimMeta?.can_claim}
        />
      )}

      <ConnectMethods onConnected={() => refetch()} />
    </div>
  );
};

export default NumbersPage;
