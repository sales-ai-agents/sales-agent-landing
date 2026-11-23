"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui";
import { PageError, PageHead, PageLoading } from "@/components/dashboard";
import {
  useNumbers,
  useNumbersMeta,
  useNumbersClaimMeta,
  useOutboundCallerId,
  useExtraNumberPrice,
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
  const extraNumberPrice = useExtraNumberPrice();
  const { data: agents = [] } = useAgents();

  if (isLoading) return <PageLoading message="Завантажуємо номери..." />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      <PageHead
        word="номери"
        title="Номери"
        description="Номери, на які дзвонять ваші клієнти, і з яких дзвонить агент. Вхідний дзвінок потрапляє до того агента, що прив'язаний до набраного номера"
        actions={
          <ConnectNumberDialog
            trigger={
              <Button>
                <Plus aria-hidden="true" />
                Підключити номер
              </Button>
            }
          />
        }
      />

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
          nextIsExtra={claimMeta?.next_is_extra}
          extraPriceUsd={extraNumberPrice}
        />
      )}

      <ConnectMethods onConnected={() => refetch()} />
    </div>
  );
};

export default NumbersPage;
