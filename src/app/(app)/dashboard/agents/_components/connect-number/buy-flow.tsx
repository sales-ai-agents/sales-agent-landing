"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import { NUMBER_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { cn } from "@/lib/utils";
import {
  useClaimNumber,
  useNumberPool,
  useNumbersMeta,
  useNumbersClaimMeta,
} from "@dashboard/hooks";
import type { NumberKind } from "@dashboard/types";

import { CopyField } from "./copy-field";
import { InfoNote } from "./info-note";
import { SuccessMark } from "./flow-visuals";
import { Stepper } from "./stepper";

const POOL_EMPTY_TEXT =
  "Вільних номерів зараз немає — ми вже замовляємо. Поки можна підключити свій номер через переадресацію.";

const LIMIT_REACHED_TEXT = "У вашому тарифі більше номерів немає";

interface BuyFlowProps {
  agentId?: number;
  onDone: (numberId: number) => void;
  onCancel: () => void;
}

const KIND_META: Partial<Record<string, { title: string; description: string }>> = {
  city: { title: "Міський номер", description: "Підходить для більшості бізнесів" },
  mobile: { title: "Мобільний номер", description: "Мобільний номер Speednet" },
  tollfree: { title: "Безкоштовний 0 800", description: "Для великих компаній" },
};

const STEPS = ["Тип номера", "Готово"];

interface NumberOption {
  kind: NumberKind;
  title: string;
  description: string;
}

const buildOptions = (availableByKind: Record<string, number>): NumberOption[] => {
  const fromPool = Object.keys(availableByKind)
    .filter((k) => availableByKind[k] > 0)
    .map((k) => ({
      kind: k as NumberKind,
      title: KIND_META[k]?.title ?? k,
      description: KIND_META[k]?.description ?? "",
    }));
  if (fromPool.length > 0) return fromPool;
  return [{ kind: "mobile", title: "Мобільний номер", description: "" }];
};

export const BuyFlow = ({ agentId, onDone, onCancel }: BuyFlowProps) => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedKind, setSelectedKind] = useState<NumberKind | null>(null);
  const [claimed, setClaimed] = useState<{ id: number; phone: string } | null>(null);
  const [poolEmpty, setPoolEmpty] = useState(false);

  const { data: pool } = useNumberPool();
  const { data: allowance } = useNumbersMeta();
  const { data: claimMeta } = useNumbersClaimMeta();
  const claimNumber = useClaimNumber();

  const availableByKind = pool?.available_by_kind ?? {};
  const options = buildOptions(availableByKind);
  const selected = options.find((opt) => opt.kind === selectedKind) ?? options[0];

  const availableForKind = availableByKind[selected.kind] ?? 0;
  const isPoolEmpty = poolEmpty || pool?.available === 0;
  const isLimitReached = allowance?.can_add === false;
  const isPoolLimitReached = claimMeta?.can_claim === false;

  const handleClaim = (): void => {
    claimNumber.mutate(
      { kind: selected.kind, agent_id: agentId },
      {
        onSuccess: (data) => {
          setClaimed({ id: data.id, phone: data.phone });
          setStep(1);
        },
        onError: (error) => {
          if (error instanceof ApiError && error.code === "number_limit") {
            const poolLimit = (error as ApiError & { pool_limit?: number }).pool_limit;
            const scope = (error as ApiError & { scope?: string }).scope;
            if (scope === "pool" && poolLimit != null) {
              toast.error(
                `Номерів від Calls4U у тарифі — до ${poolLimit}. Підключіть свій номер через переадресацію.`
              );
            } else {
              toast.error(NUMBER_ERROR_MESSAGES.number_limit ?? error.hint);
              router.push("/dashboard/billing");
            }
            return;
          }
          if (error instanceof ApiError && error.code === "pool_empty") {
            setPoolEmpty(true);
            toast.error(NUMBER_ERROR_MESSAGES.pool_empty ?? error.hint);
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
        <p className="text-muted-foreground text-sm">Номер із вашого тарифу для дзвінків агента</p>
      </header>

      <Stepper steps={STEPS} current={step} />

      {step === 0 && isLimitReached && (
        <div className="space-y-4">
          <InfoNote>
            {LIMIT_REACHED_TEXT}.{" "}
            <Link href="/dashboard/billing" className="text-primary underline">
              Переглянути тарифи
            </Link>
          </InfoNote>
          <div className="flex justify-start">
            <Button type="button" variant="outline" onClick={onCancel}>
              Скасувати
            </Button>
          </div>
        </div>
      )}

      {step === 0 && !isLimitReached && isPoolLimitReached && claimMeta && (
        <div className="space-y-4">
          <InfoNote>
            {claimMeta.pool_limit > 0
              ? `Номерів від Calls4U у тарифі — до ${claimMeta.pool_limit}. Підключено: ${claimMeta.pool_used}. Щоб отримати більше, підключіть свій номер через переадресацію.`
              : "Номери від Calls4U у цьому тарифі недоступні. Підключіть свій номер через переадресацію."}
          </InfoNote>
          <div className="flex justify-start">
            <Button type="button" variant="outline" onClick={onCancel}>
              Скасувати
            </Button>
          </div>
        </div>
      )}

      {step === 0 && !isLimitReached && !isPoolLimitReached && isPoolEmpty && (
        <div className="space-y-4">
          <InfoNote>{POOL_EMPTY_TEXT}</InfoNote>
          <div className="flex justify-start">
            <Button type="button" variant="outline" onClick={onCancel}>
              Скасувати
            </Button>
          </div>
        </div>
      )}

      {step === 0 && !isLimitReached && !isPoolLimitReached && !isPoolEmpty && (
        <div className="space-y-4">
          <p className="text-sm font-medium">Оберіть тип номера</p>
          <div className="space-y-2">
            {options.map((option) => {
              const available = availableByKind[option.kind] ?? 0;
              return (
                <button
                  key={option.kind}
                  type="button"
                  onClick={() => setSelectedKind(option.kind)}
                  aria-pressed={selected.kind === option.kind}
                  disabled={available === 0}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors disabled:opacity-50",
                    selected.kind === option.kind
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-full border",
                        selected.kind === option.kind ? "border-primary" : "border-input-border"
                      )}
                    >
                      {selected.kind === option.kind && (
                        <span className="bg-primary h-2 w-2 rounded-full" />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{option.title}</p>
                      {option.description && (
                        <p className="text-muted-foreground text-xs">{option.description}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {available > 0 ? `Доступно: ${available}` : "Немає"}
                  </span>
                </button>
              );
            })}
          </div>

          <InfoNote>
            Номер входить у ваш тариф і буде автоматично призначено з доступних. Вибір конкретного
            номера недоступний.
          </InfoNote>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Скасувати
            </Button>
            <Button
              type="button"
              onClick={handleClaim}
              disabled={availableForKind === 0 || claimNumber.isPending}
            >
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
