"use client";

import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@/components/ui";
import { useNumbers } from "@dashboard/hooks";
import type { AgentNumber } from "@dashboard/types";

import { OPERATOR_FORWARD_HINTS } from "./constants";
import { NumberSelect } from "./number-select";
import { CopyField } from "./copy-field";
import { PhonePulse, SuccessMark } from "./flow-visuals";
import { Stepper } from "./stepper";
import { useVerifyPolling } from "./use-verify-polling";

interface ForwardFlowProps {
  onDone: (numberId: number) => void;
  onCancel: () => void;
}

const STEPS = ["Інструкція", "Перевірка"];

const isAssignedNumber = (number: AgentNumber): boolean => number.source === "assigned";

export const ForwardFlow = ({ onDone, onCancel }: ForwardFlowProps) => {
  const [step, setStep] = useState(0);
  const [targetNumberId, setTargetNumberId] = useState("");

  const { data: numbers = [] } = useNumbers();
  const verify = useVerifyPolling();

  const availableNumbers = useMemo(() => numbers.filter(isAssignedNumber), [numbers]);
  const selectedNumber = availableNumbers.find((number) => String(number.id) === targetNumberId);

  const handleNext = (): void => {
    if (!selectedNumber) {
      toast.error("Оберіть номер Calls4U для переадресації");
      return;
    }

    setStep(1);
    verify.start(selectedNumber.phone);
  };

  const handleRetry = (): void => {
    if (selectedNumber) verify.start(selectedNumber.phone);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-lg font-bold">Налаштувати переадресацію</h2>
      </header>

      <Stepper steps={STEPS} current={step} />

      {step === 0 && (
        <ForwardSetupStep
          numbers={availableNumbers}
          selectedNumberId={targetNumberId}
          selectedPhone={selectedNumber?.phone ?? ""}
          onNumberChange={setTargetNumberId}
          onNext={handleNext}
          onCancel={onCancel}
        />
      )}

      {step === 1 && !verify.isVerified && (
        <ForwardVerifyStep
          targetPhone={selectedNumber?.phone ?? ""}
          isPolling={verify.isPolling}
          onRetry={handleRetry}
          onCancel={onCancel}
        />
      )}

      {step === 1 && verify.isVerified && (
        <div className="space-y-4 text-center">
          <SuccessMark />
          <p className="font-medium">Переадресація працює!</p>
          <p className="text-muted-foreground text-sm">
            Дзвінки успішно надходять на номер. Тепер потрібно призначити агента та налаштувати
            напрямок дзвінків
          </p>
          <div className="flex justify-end">
            <Button type="button" onClick={() => selectedNumber && onDone(selectedNumber.id)}>
              Готово
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

interface ForwardVerifyStepProps {
  targetPhone: string;
  isPolling: boolean;
  onRetry: () => void;
  onCancel: () => void;
}

const ForwardVerifyStep = ({
  targetPhone,
  isPolling,
  onRetry,
  onCancel,
}: ForwardVerifyStepProps) => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-3 text-center">
        <PhonePulse animated={isPolling} tone={isPolling ? "active" : "idle"} />
        {isPolling ? (
          <>
            <p className="font-medium">Чекаємо на тестовий дзвінок</p>
            <p className="text-muted-foreground max-w-sm text-sm">
              Зателефонуйте на свій номер з іншого телефону. Якщо переадресацію налаштовано, дзвінок
              надійде на номер Calls4U і ми одразу це побачимо.
            </p>
          </>
        ) : (
          <>
            <p className="font-medium">Дзвінка так і не було</p>
            <p className="text-muted-foreground max-w-sm text-sm">
              За хвилину очікування дзвінок на номер Calls4U не надійшов. Перевірте, що
              переадресацію увімкнено у вашого оператора, і спробуйте ще раз.
            </p>
          </>
        )}
      </div>

      {targetPhone && (
        <div className="border-border bg-muted/40 flex items-center justify-between rounded-lg border px-4 py-3">
          <span className="text-muted-foreground text-xs">Номер Calls4U</span>
          <span className="text-sm font-medium">{targetPhone}</span>
        </div>
      )}

      {isPolling && (
        <div
          className="text-muted-foreground flex items-center justify-center gap-2 text-xs"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Перевіряємо автоматично — це може зайняти до 1 хвилини</span>
        </div>
      )}

      <div className="flex justify-between gap-4">
        <Button type="button" variant="outline" className="w-1/3" onClick={onCancel}>
          Скасувати
        </Button>
        <Button type="button" className="w-1/3" onClick={onRetry} disabled={isPolling}>
          {isPolling ? "Перевіряємо..." : "Перевірити ще раз"}
        </Button>
      </div>
    </div>
  );
};

interface ForwardSetupStepProps {
  numbers: AgentNumber[];
  selectedNumberId: string;
  selectedPhone: string;
  onNumberChange: (value: string) => void;
  onNext: () => void;
  onCancel: () => void;
}

const ForwardSetupStep = ({
  numbers,
  selectedNumberId,
  selectedPhone,
  onNumberChange,
  onNext,
  onCancel,
}: ForwardSetupStepProps) => {
  if (numbers.length === 0) {
    return <EmptyNumbers onCancel={onCancel} />;
  }

  const canSubmit = Boolean(selectedNumberId);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <NumberSelect
          id="forward-target-number"
          label="Номер Calls4U (куди переадресувати)"
          numbers={numbers}
          value={selectedNumberId}
          onValueChange={onNumberChange}
        />
        <p className="text-muted-foreground text-sm">
          Переадресуйте дзвінки зі свого поточного номера на обраний номер. Це займе близько 5 хв.
        </p>
      </div>

      {selectedPhone && <CopyField label="Номер для переадресації" value={selectedPhone} />}

      <ol className="space-y-3">
        <ForwardStepItem index={1} title="Скопіюйте номер" note="Натисніть «Копіювати»." />
        <li className="flex gap-3">
          <StepBullet index={2} />
          <div className="space-y-1">
            <p className="text-sm font-medium">Увімкніть переадресацію у вашого оператора</p>
            <p className="text-muted-foreground text-sm">
              Додайте цей номер як номер для переадресації.
            </p>
            <Accordion>
              <AccordionItem value="operators">
                <AccordionTrigger className="text-primary font-body **:data-[slot=accordion-trigger-icon]:text-primary justify-start p-0 text-xs **:data-[slot=accordion-trigger-icon]:ml-1">
                  Інструкція для основних операторів
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="text-muted-foreground space-y-1 text-xs">
                    {OPERATOR_FORWARD_HINTS.map((hint) => (
                      <li key={hint}>{hint}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </li>
        <ForwardStepItem index={3} title="Поверніться сюди та перевірте підключення" />
      </ol>

      <div className="flex justify-between gap-4">
        <Button type="button" className="w-1/3" variant="outline" onClick={onCancel}>
          Скасувати
        </Button>
        <Button type="button" className="w-1/3" onClick={onNext} disabled={!canSubmit}>
          Далі
        </Button>
      </div>
    </div>
  );
};

const EmptyNumbers = ({ onCancel }: { onCancel: () => void }) => (
  <div className="space-y-4">
    <div className="border-border bg-muted/40 space-y-1 rounded-lg border p-4">
      <p className="text-sm font-medium">Немає доступних номерів</p>
      <p className="text-muted-foreground text-sm">
        Щоб налаштувати переадресацію, спершу отримайте номер у розділі «Підключити номер».
      </p>
    </div>
    <div className="flex justify-start">
      <Button type="button" variant="outline" onClick={onCancel}>
        Скасувати
      </Button>
    </div>
  </div>
);

const StepBullet = ({ index }: { index: number }) => (
  <span className="bg-primary/10 text-muted-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
    {index}
  </span>
);

const ForwardStepItem = ({
  index,
  title,
  note,
}: {
  index: number;
  title: string;
  note?: string;
}) => (
  <li className="flex gap-3">
    <StepBullet index={index} />
    <div>
      <p className="text-sm font-medium">{title}</p>
      {note && <p className="text-muted-foreground text-sm">{note}</p>}
    </div>
  </li>
);
