"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Info, Loader2 } from "lucide-react";

import { Button } from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import { NUMBER_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { cn } from "@/lib/utils";
import { useClaimNumber, useNumberPool } from "@dashboard/hooks";
import type { NumberKind } from "@dashboard/types";

import { CopyField } from "./copy-field";
import { SuccessMark } from "./flow-visuals";
import { Stepper } from "./stepper";

interface BuyFlowProps {
  agentId?: number;
  onDone: (numberId: number) => void;
  onCancel: () => void;
}

interface NumberOption {
  kind: Extract<NumberKind, "city" | "tollfree">;
  title: string;
  description: string;
}

const STEPS = ["Тип номера", "Готово"];

const NUMBER_OPTIONS: NumberOption[] = [
  { kind: "city", title: "Міський номер", description: "Підходить для більшості бізнесів" },
  { kind: "tollfree", title: "Безкоштовний 0 800", description: "Для великих компаній" },
];

export const BuyFlow = ({ agentId, onDone, onCancel }: BuyFlowProps) => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<NumberOption>(NUMBER_OPTIONS[0]);
  const [claimed, setClaimed] = useState<{ id: number; phone: string } | null>(null);

  const { data: pool } = useNumberPool();
  const claimNumber = useClaimNumber();

  const availableForKind = pool?.available_by_kind?.[selected.kind] ?? pool?.available ?? 0;

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
            router.push("/dashboard/billing");
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

      {step === 0 && (
        <div className="space-y-4">
          <p className="text-sm font-medium">Оберіть тип номера</p>
          <div className="space-y-2">
            {NUMBER_OPTIONS.map((option) => {
              const available = pool?.available_by_kind?.[option.kind] ?? pool?.available ?? 0;
              return (
                <button
                  key={option.kind}
                  type="button"
                  onClick={() => setSelected(option)}
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
                      <p className="text-muted-foreground text-xs">{option.description}</p>
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

          <div className="flex items-center gap-2 rounded-lg bg-green-100 p-3 text-sm dark:bg-green-950/60">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
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

const InfoNote = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-primary/5 text-muted-foreground flex gap-2 rounded-lg p-3 text-xs">
    <Info className="text-primary h-4 w-4 shrink-0" />
    <p>{children}</p>
  </div>
);
