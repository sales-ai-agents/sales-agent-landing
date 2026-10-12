"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import { NUMBER_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { useConnectNumber, useNumbers, useVerifySip } from "@dashboard/hooks";
import type { AgentNumber } from "@dashboard/types";

import { OPERATOR_FORWARD_HINTS, isValidUaPhone, normalizeUaPhone } from "./constants";
import { NumberSelect } from "./number-select";
import { CopyField } from "./copy-field";
import { PhoneField } from "./phone-field";
import { PhonePulse, SuccessMark } from "./flow-visuals";
import { Stepper } from "./stepper";

interface ForwardFlowProps {
  agentId?: number;
  onDone: (numberId: number) => void;
  onCancel: () => void;
}

const STEPS = ["Інструкція", "Перевірка"];

const DEFAULT_VERIFY_HINT =
  "Ми чекаємо вхідний дзвінок на обраний номер. Це може зайняти до 1 хвилини.";

const isAssignedNumber = (number: AgentNumber): boolean => number.source === "assigned";

export const ForwardFlow = ({ agentId, onDone, onCancel }: ForwardFlowProps) => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [targetNumberId, setTargetNumberId] = useState("");
  const [numberId, setNumberId] = useState<number | null>(null);
  const [verified, setVerified] = useState(false);
  const [verifyHint, setVerifyHint] = useState(DEFAULT_VERIFY_HINT);

  const { data: numbers = [] } = useNumbers();
  const connectNumber = useConnectNumber();
  const verifySip = useVerifySip();

  const availableNumbers = useMemo(() => numbers.filter(isAssignedNumber), [numbers]);

  const selectedNumber = availableNumbers.find((number) => String(number.id) === targetNumberId);

  const normalizedPhone = normalizeUaPhone(phone);

  const handleNext = (): void => {
    if (!selectedNumber) {
      toast.error("Оберіть номер для переадресації");
      return;
    }

    if (!isValidUaPhone(phone)) {
      toast.error(NUMBER_ERROR_MESSAGES.number_unavailable ?? "Введіть коректний номер");
      return;
    }

    connectNumber.mutate(
      { source: "forward", phone: normalizedPhone, agent_id: agentId },
      {
        onSuccess: (created) => {
          setNumberId(created.id);
          setStep(1);
          runVerify();
        },
        onError: (error) => {
          if (error instanceof ApiError && error.code === "number_limit") {
            toast.error(NUMBER_ERROR_MESSAGES.number_limit ?? error.hint);
            router.push("/dashboard/billing");
            return;
          }
          handleMutationError(error, NUMBER_ERROR_MESSAGES);
        },
      }
    );
  };

  const runVerify = (): void => {
    verifySip.mutate(
      { phone: normalizedPhone },
      {
        onSuccess: (result) => {
          setVerified(result.verified);
          if (!result.verified) setVerifyHint(result.hint ?? DEFAULT_VERIFY_HINT);
        },
        onError: (error) => handleMutationError(error, NUMBER_ERROR_MESSAGES),
      }
    );
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
          phone={phone}
          onPhoneChange={setPhone}
          onNext={handleNext}
          onCancel={onCancel}
          isSubmitting={connectNumber.isPending}
        />
      )}

      {step === 1 && !verified && (
        <div className="space-y-4 text-center">
          <PhonePulse animated={verifySip.isPending} />
          <p className="font-medium">
            {verifySip.isPending ? "Перевіряємо переадресацію..." : "Ще не бачили дзвінка"}
          </p>
          <p className="text-muted-foreground text-sm">{verifyHint}</p>
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Скасувати
            </Button>
            <Button type="button" onClick={runVerify} disabled={verifySip.isPending}>
              {verifySip.isPending ? "Перевіряємо..." : "Перевірити ще раз"}
            </Button>
          </div>
        </div>
      )}

      {step === 1 && verified && (
        <div className="space-y-4 text-center">
          <SuccessMark />
          <p className="font-medium">Переадресація працює!</p>
          <p className="text-muted-foreground text-sm">
            Дзвінки успішно надходять на номер. Тепер потрібно призначити агента та налаштувати
            напрямок дзвінків
          </p>
          <div className="flex justify-end">
            <Button type="button" onClick={() => numberId && onDone(numberId)}>
              Готово
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

interface ForwardSetupStepProps {
  numbers: AgentNumber[];
  selectedNumberId: string;
  selectedPhone: string;
  onNumberChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  onNext: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ForwardSetupStep = ({
  numbers,
  selectedNumberId,
  selectedPhone,
  onNumberChange,
  phone,
  onPhoneChange,
  onNext,
  onCancel,
  isSubmitting,
}: ForwardSetupStepProps) => {
  if (numbers.length === 0) {
    return <EmptyNumbers onCancel={onCancel} />;
  }

  const canSubmit = Boolean(selectedNumberId) && isValidUaPhone(phone);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <NumberSelect
          id="forward-target-number"
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

      <PhoneField id="forward-phone" label="Ваш номер" value={phone} onChange={onPhoneChange} />

      <div className="flex justify-between gap-4">
        <Button type="button" className="w-1/3" variant="outline" onClick={onCancel}>
          Скасувати
        </Button>
        <Button
          type="button"
          className="w-1/3"
          onClick={onNext}
          disabled={!canSubmit || isSubmitting}
        >
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
