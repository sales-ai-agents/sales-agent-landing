"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Info, Loader2 } from "lucide-react";

import { Button } from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import { NUMBER_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { useConnectNumber, useProvisionSipTrunk, useVerifySip } from "@dashboard/hooks";
import type { SipTrunkCredentials } from "@dashboard/types";

import { isValidUaPhone, normalizeUaPhone } from "./constants";
import { CopyField } from "./copy-field";
import { PhoneField } from "./phone-field";
import { PhonePulse, SuccessMark } from "./flow-visuals";
import { Stepper } from "./stepper";

interface SipFlowProps {
  agentId?: number;
  onDone: (numberId: number) => void;
  onCancel: () => void;
}

const STEPS = ["Налаштування", "Перевірка", "Готово"];
const DEFAULT_HINT =
  "Для перевірки ми чекаємо вхідний дзвінок з вашого номера. Це може зайняти до 1 хвилини.";

const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 120000;

export const SipFlow = ({ agentId, onDone, onCancel }: SipFlowProps) => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [numberId, setNumberId] = useState<number | null>(null);
  const [credentials, setCredentials] = useState<SipTrunkCredentials | null>(null);
  const [verifyHint, setVerifyHint] = useState(DEFAULT_HINT);
  const [isPolling, setIsPolling] = useState(false);

  const connectNumber = useConnectNumber();
  const provisionTrunk = useProvisionSipTrunk();
  const verifySip = useVerifySip();

  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollDeadline = useRef(0);

  const normalizedPhone = normalizeUaPhone(phone);
  const isProvisioning = connectNumber.isPending || provisionTrunk.isPending;

  const stopPolling = (): void => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
    setIsPolling(false);
  };

  useEffect(() => stopPolling, []);

  const handleProvision = (): void => {
    if (!isValidUaPhone(phone)) return;

    connectNumber.mutate(
      { source: "sip", phone: normalizedPhone, agent_id: agentId, direction: "inbound" },
      {
        onSuccess: (created) => {
          setNumberId(created.id);
          provisionTrunk.mutate(
            { number_id: created.id },
            {
              onSuccess: (trunk) => setCredentials(trunk),
              onError: (error) => handleMutationError(error, NUMBER_ERROR_MESSAGES),
            }
          );
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

  const runVerifyOnce = (): void => {
    verifySip.mutate(
      { phone: normalizedPhone },
      {
        onSuccess: (result) => {
          if (result.verified) {
            stopPolling();
            setStep(2);
            return;
          }
          setVerifyHint(result.hint ?? DEFAULT_HINT);
          if (Date.now() >= pollDeadline.current) stopPolling();
        },
        onError: (error) => {
          stopPolling();
          handleMutationError(error, NUMBER_ERROR_MESSAGES);
        },
      }
    );
  };

  const startVerify = (): void => {
    if (isPolling) return;
    stopPolling();
    setStep(1);
    setIsPolling(true);
    pollDeadline.current = Date.now() + POLL_TIMEOUT_MS;
    runVerifyOnce();
    pollTimer.current = setInterval(runVerifyOnce, POLL_INTERVAL_MS);
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-lg font-bold">Підключити номер через АТС</h2>
        <p className="text-muted-foreground text-sm">
          Налаштуйте з&apos;єднання між вашою телефонною системою та Calls4U
        </p>
      </header>

      <Stepper steps={STEPS} current={step} />

      {step === 0 && credentials && (
        <SipSetupStep
          credentials={credentials}
          phone={phone}
          onPhoneChange={setPhone}
          canVerify={isValidUaPhone(phone)}
          onVerify={startVerify}
          onCancel={onCancel}
        />
      )}

      {step === 0 && !credentials && (
        <div className="space-y-4">
          <PhoneField id="sip-phone" label="Ваш номер" value={phone} onChange={setPhone} />
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Скасувати
            </Button>
            <Button
              type="button"
              onClick={handleProvision}
              disabled={!isValidUaPhone(phone) || isProvisioning}
            >
              {isProvisioning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Отримати дані для АТС
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 text-center">
          <PhonePulse animated={isPolling} />
          <p className="font-medium">
            {isPolling ? "Перевіряємо підключення..." : "Ще не бачили дзвінка"}
          </p>
          <p className="text-muted-foreground text-sm">{verifyHint}</p>
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Скасувати
            </Button>
            <Button type="button" onClick={startVerify} disabled={isPolling}>
              {isPolling ? "Перевіряємо..." : "Перевірити ще раз"}
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 text-center">
          <SuccessMark />
          <p className="font-medium">Номер {credentials?.phone} підключено!</p>
          <p className="text-muted-foreground text-sm">
            Дзвінки з цього номера успішно надходять до Calls4U. Тепер ви можете призначити агента
            та налаштувати напрямок дзвінків у таблиці «Номери»
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

interface SipSetupStepProps {
  credentials: SipTrunkCredentials;
  phone: string;
  onPhoneChange: (value: string) => void;
  canVerify: boolean;
  onVerify: () => void;
  onCancel: () => void;
}

const SipSetupStep = ({
  credentials,
  phone,
  onPhoneChange,
  canVerify,
  onVerify,
  onCancel,
}: SipSetupStepProps) => {
  return (
    <div className="space-y-4">
      <section className="border-border space-y-2 rounded-lg border p-4">
        <h3 className="font-medium">Додати нашу SIP-адресу у вашу АТС</h3>
        <p className="text-muted-foreground text-sm">
          Скопіюйте адресу та використайте її в налаштуваннях вашої телефонної системи як напрямок
          для вхідних дзвінків
        </p>
        <CopyField label="SIP-адреса" value={credentials.sip_uri} />
        <p className="text-muted-foreground text-xs">
          Інструкції для популярних АТС (Binotel, Ringostat, 3CX, Asterisk)
        </p>
      </section>

      <section className="border-border space-y-2 rounded-lg border p-4">
        <h3 className="font-medium">Вкажіть номер, який підключаєте</h3>
        <p className="text-muted-foreground text-sm">
          Введіть номер телефону, який буде надсилати дзвінки на Calls4U
        </p>
        <PhoneField
          id="sip-verify-phone"
          label="Номер телефону"
          value={phone}
          onChange={onPhoneChange}
        />
      </section>

      <section className="border-border space-y-3 rounded-lg border p-4">
        <div>
          <h3 className="font-medium">Натисніть «Перевірити підключення»</h3>
          <p className="text-muted-foreground text-sm">
            Після того як налаштуєте АТС, натисніть кнопку нижче. Ми перевіримо, чи надходять
            дзвінки з вашого номера.
          </p>
        </div>
        <Button type="button" className="w-full" onClick={onVerify} disabled={!canVerify}>
          Перевірити підключення
        </Button>
        <div className="bg-primary/5 text-muted-foreground flex gap-2 rounded-lg p-3 text-xs">
          <Info className="text-primary h-4 w-4 shrink-0" />
          <p>
            Для перевірки ми будемо чекати вхідний дзвінок з вашого номера. Це може зайняти до 1
            хвилини.
          </p>
        </div>
      </section>

      <div className="flex justify-start">
        <Button type="button" variant="outline" onClick={onCancel}>
          Скасувати
        </Button>
      </div>
    </div>
  );
};
