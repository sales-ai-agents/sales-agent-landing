"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import { NUMBER_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { cn, formatUaPhone, formatUsd } from "@/lib/utils";
import {
  useClaimNumber,
  useExtraNumberPrice,
  useNumberPool,
  useNumbersClaimMeta,
  useNumbersMeta,
} from "@dashboard/hooks";
import type { NumberKind } from "@dashboard/types";
import { CopyField } from "./copy-field";
import { InfoNote } from "./info-note";
import { SuccessMark } from "./flow-visuals";
import { Stepper } from "./stepper";

const CLAIM_KIND: NumberKind = "mobile";
const STEPS = ["Вибір номера", "Готово"];

const POOL_EMPTY_TEXT =
  "Вільних номерів зараз немає — ми вже замовляємо. Поки можна підключити свій номер через переадресацію.";
const LIMIT_REACHED_TEXT =
  "Досягнуто ліміт номерів. Видаліть непотрібний номер, щоб підключити інший.";
const NUMBER_TAKEN_TEXT = "Цей номер щойно зайняли. Ми оновили список, оберіть інший.";

interface BuyFlowProps {
  agentId?: number;
  onDone: (numberId: number) => void;
  onCancel: () => void;
}

const CancelRow = ({ onCancel }: { onCancel: () => void }) => (
  <div className="flex justify-start">
    <Button type="button" variant="outline" onClick={onCancel}>
      Скасувати
    </Button>
  </div>
);

export const BuyFlow = ({ agentId, onDone, onCancel }: BuyFlowProps) => {
  const [step, setStep] = useState(0);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [claimed, setClaimed] = useState<{ id: number; phone: string } | null>(null);

  const { data: pool, isLoading: isPoolLoading } = useNumberPool();
  const { data: allowance } = useNumbersMeta();
  const { data: claimMeta } = useNumbersClaimMeta();
  const extraPrice = useExtraNumberPrice();
  const claimNumber = useClaimNumber();

  const phones = pool?.numbers_by_kind[CLAIM_KIND] ?? [];
  const phone = selectedPhone && phones.includes(selectedPhone) ? selectedPhone : phones[0];
  const isLimitReached = allowance?.can_add === false;
  const isPoolLimitReached = claimMeta?.can_claim === false;
  const isPoolEmpty = !isPoolLoading && phones.length === 0;

  const handleClaim = (): void => {
    if (!phone) return;
    claimNumber.mutate(
      { kind: CLAIM_KIND, phone, agent_id: agentId },
      {
        onSuccess: (data) => {
          setClaimed({ id: data.id, phone: data.phone });
          setStep(1);
        },
        onError: (error) => {
          if (error instanceof ApiError && error.code === "number_unavailable") {
            setSelectedPhone(null);
            toast.error(NUMBER_TAKEN_TEXT);
            return;
          }
          handleMutationError(error, NUMBER_ERROR_MESSAGES);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-lg font-bold">Отримати номер</h2>
        <p className="text-muted-foreground text-sm">Номер Calls4U для дзвінків агента</p>
      </header>

      <Stepper steps={STEPS} current={step} />

      {step === 0 && isLimitReached && (
        <div className="space-y-4">
          <InfoNote>{LIMIT_REACHED_TEXT}</InfoNote>
          <CancelRow onCancel={onCancel} />
        </div>
      )}

      {step === 0 && !isLimitReached && isPoolLimitReached && claimMeta && (
        <div className="space-y-4">
          <InfoNote>
            {claimMeta.pool_limit > 0
              ? `Номерів від Calls4U: ${claimMeta.pool_used} з ${claimMeta.pool_limit}. Щоб підключити ще один номер, використайте свій через переадресацію.`
              : "Номери від Calls4U недоступні. Підключіть свій номер через переадресацію."}
          </InfoNote>
          <CancelRow onCancel={onCancel} />
        </div>
      )}

      {step === 0 && !isLimitReached && !isPoolLimitReached && isPoolEmpty && (
        <div className="space-y-4">
          <InfoNote>{POOL_EMPTY_TEXT}</InfoNote>
          <CancelRow onCancel={onCancel} />
        </div>
      )}

      {step === 0 && !isLimitReached && !isPoolLimitReached && !isPoolEmpty && (
        <div className="space-y-4">
          <p className="text-sm font-medium">Оберіть номер</p>
          <div className="space-y-2" role="radiogroup" aria-label="Вільні номери">
            {phones.map((item) => (
              <button
                key={item}
                type="button"
                role="radio"
                aria-checked={phone === item}
                onClick={() => setSelectedPhone(item)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                  phone === item
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border",
                    phone === item ? "border-primary" : "border-input-border"
                  )}
                >
                  {phone === item && <span className="bg-primary h-2 w-2 rounded-full" />}
                </span>
                <span className="text-sm font-medium">{formatUaPhone(item)}</span>
              </button>
            ))}
          </div>

          {claimMeta?.next_is_extra ? (
            <InfoNote>
              Цей номер понад тариф:{" "}
              {extraPrice ? `${formatUsd(extraPrice)}/міс` : "оплата щомісяця"} спишеться з вашого
              балансу.{" "}
              <Link href="/dashboard/balance" className="text-primary underline">
                Баланс
              </Link>
            </InfoNote>
          ) : (
            <InfoNote>Номер входить у ваш тариф і підключається одразу.</InfoNote>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Скасувати
            </Button>
            <Button type="button" onClick={handleClaim} disabled={!phone || claimNumber.isPending}>
              {claimNumber.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Отримати номер
            </Button>
          </div>
        </div>
      )}

      {step === 1 && claimed && (
        <div className="space-y-4">
          <div className="text-center">
            <SuccessMark />
            <p className="mt-3 font-medium">Номер {claimed.phone} підключено!</p>
            <p className="text-muted-foreground text-sm">Статус: готовий до роботи</p>
          </div>

          <CopyField label="Ваш номер" value={claimed.phone} />

          <div className="bg-success/15 flex items-center gap-2 rounded-lg p-3">
            <CheckCircle2 className="text-success h-4 w-4 shrink-0" />
            <p className="text-muted-foreground text-xs">
              Номер працює одразу. Ви можете призначити агента та напрямок у таблиці «Номери».
            </p>
          </div>

          <Button type="button" className="w-full" onClick={() => onDone(claimed.id)}>
            Готово
          </Button>
        </div>
      )}
    </div>
  );
};
