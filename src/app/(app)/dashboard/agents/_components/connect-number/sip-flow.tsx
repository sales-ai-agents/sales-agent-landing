"use client";

import { useState } from "react";

import { Button } from "@/components/ui";

import { InfoNote } from "./info-note";
import { PhonePulse, SuccessMark } from "./flow-visuals";
import { SipSetupStep } from "./sip-setup-step";
import { Stepper } from "./stepper";
import { useSipConnect } from "./use-sip-connect";

interface SipFlowProps {
  agentId?: number;
  onDone: (numberId: number) => void;
  onCancel: () => void;
}

const STEPS = ["Налаштування", "Перевірка", "Готово"];

export const SipFlow = ({ agentId, onDone, onCancel }: SipFlowProps) => {
  const [step, setStep] = useState(0);
  const sip = useSipConnect({
    agentId,
    onVerified: () => setStep(2),
  });

  const handleVerify = (): void => {
    setStep(1);
    sip.startVerify();
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

      {step === 0 && (
        <SipSetupStep
          sipUri={sip.sipUri}
          sipHost={sip.sipHost}
          username={sip.username}
          password={sip.password}
          hasTrunk={sip.hasTrunk}
          phone={sip.phone}
          onPhoneChange={sip.setPhone}
          onProvision={sip.provision}
          isProvisioning={sip.isProvisioning}
          canProvision={sip.isPhoneValid}
          onVerify={handleVerify}
          onCancel={onCancel}
        />
      )}

      {step === 1 && (
        <div className="space-y-4 text-center">
          <PhonePulse animated={sip.isPolling} />
          <p className="font-medium">
            {sip.isPolling ? "Перевіряємо підключення..." : "Ще не бачили дзвінка"}
          </p>
          <p className="text-muted-foreground text-sm">{sip.verifyHint}</p>
          <InfoNote>
            Подзвоніть на <b>{sip.normalizedPhone}</b> з будь-якого іншого телефону — ваша АТС
            переадресує дзвінок нам, і ми його побачимо.
          </InfoNote>
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Скасувати
            </Button>
            <Button type="button" onClick={sip.startVerify} disabled={sip.isPolling}>
              {sip.isPolling ? "Перевіряємо..." : "Перевірити ще раз"}
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 text-center">
          <SuccessMark />
          <p className="font-medium">Номер {sip.normalizedPhone} підключено!</p>
          <p className="text-muted-foreground mx-auto max-w-sm text-sm">
            Дзвінки на цей номер тепер прийматиме агент. Ви можете призначити агента та налаштувати
            напрямок дзвінків у таблиці «Номери».
          </p>
          <div className="flex justify-end">
            <Button type="button" onClick={() => sip.numberId && onDone(sip.numberId)}>
              Готово
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
