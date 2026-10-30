"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui";

import { SIP_ACTIVATION_DELAY_SECONDS } from "./constants";
import { CopyField } from "./copy-field";
import { InfoNote } from "./info-note";
import { PhoneField } from "./phone-field";

interface SipSetupStepProps {
  sipUri: string;
  sipHost: string;
  username: string;
  password: string | null;
  hasTrunk: boolean;
  phone: string;
  onPhoneChange: (value: string) => void;
  onProvision: () => void;
  isProvisioning: boolean;
  canProvision: boolean;
  onVerify: () => void;
  isVerifying?: boolean;
  verifyHint?: string;
  onCancel?: () => void;
}

export const SipSetupStep = ({
  sipUri,
  sipHost,
  username,
  password,
  hasTrunk,
  phone,
  onPhoneChange,
  onProvision,
  isProvisioning,
  canProvision,
  onVerify,
  isVerifying = false,
  verifyHint,
  onCancel,
}: SipSetupStepProps) => {
  return (
    <div className="space-y-4">
      <PhoneSection
        phone={phone}
        onPhoneChange={onPhoneChange}
        hasTrunk={hasTrunk}
        canProvision={canProvision}
        isProvisioning={isProvisioning}
        onProvision={onProvision}
      />

      {hasTrunk && (
        <>
          <CredentialsSection
            sipUri={sipUri}
            sipHost={sipHost}
            username={username}
            password={password}
          />
          <VerifySection
            onVerify={onVerify}
            isVerifying={isVerifying}
            verifyHint={isVerifying ? verifyHint : undefined}
          />
        </>
      )}

      {onCancel && (
        <div className="flex justify-start">
          <Button type="button" variant="outline" onClick={onCancel}>
            Скасувати
          </Button>
        </div>
      )}
    </div>
  );
};

interface PhoneSectionProps {
  phone: string;
  onPhoneChange: (value: string) => void;
  hasTrunk: boolean;
  canProvision: boolean;
  isProvisioning: boolean;
  onProvision: () => void;
}

const PhoneSection = ({
  phone,
  onPhoneChange,
  hasTrunk,
  canProvision,
  isProvisioning,
  onProvision,
}: PhoneSectionProps) => {
  return (
    <section className="border-border space-y-3 rounded-lg border p-4">
      <div className="space-y-1">
        <h3 className="font-medium">Вкажіть номер, який підключаєте</h3>
        <p className="text-muted-foreground text-sm">
          Введіть номер телефону, який надсилатиме дзвінки на Calls4U — і ми видамо дані для вашої
          АТС.
        </p>
      </div>

      <PhoneField
        id="sip-verify-phone"
        label="Номер телефону"
        value={phone}
        onChange={onPhoneChange}
        hint="Вводьте у форматі +380 XX XXX XX XX"
      />

      <Button
        type="button"
        variant={hasTrunk ? "outline" : "default"}
        className="w-full"
        onClick={onProvision}
        disabled={!canProvision || isProvisioning}
      >
        {isProvisioning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {hasTrunk ? "Видати новий пароль" : "Отримати дані для АТС"}
      </Button>
    </section>
  );
};

interface CredentialsSectionProps {
  sipUri: string;
  sipHost: string;
  username: string;
  password: string | null;
}

const CredentialsSection = ({ sipUri, sipHost, username, password }: CredentialsSectionProps) => {
  return (
    <section className="border-border space-y-3 rounded-lg border p-4">
      <div className="space-y-1">
        <h3 className="font-medium">Дані для вашої АТС</h3>
        <p className="text-muted-foreground text-sm">
          Налаштуйте в АТС переадресацію вхідних дзвінків на цю адресу, з логіном і паролем нижче.
        </p>
      </div>

      <CopyField label="SIP-адреса" value={sipUri} />
      <CopyField label="Сервер" value={sipHost} />
      <CopyField label="Логін" value={username} />
      <CopyField
        label="Пароль"
        value={password ?? ""}
        masked
        placeholder="Збережено лише у вашій АТС"
      />

      {password ? (
        <InfoNote>
          <b>Збережіть пароль — ми його не зберігаємо.</b> Після внесення логіна й пароля в АТС
          зачекайте до {SIP_ACTIVATION_DELAY_SECONDS} секунд — стільки потрібно, щоб підключення
          запрацювало.
        </InfoNote>
      ) : (
        <InfoNote>
          Пароль видається один раз при видачі й у нас не зберігається. Якщо ви його не зберегли —
          натисніть «Видати новий пароль», старий перестане діяти.
        </InfoNote>
      )}
    </section>
  );
};

interface VerifySectionProps {
  onVerify: () => void;
  isVerifying: boolean;
  verifyHint?: string;
}

const VerifySection = ({ onVerify, isVerifying, verifyHint }: VerifySectionProps) => {
  return (
    <section className="border-border space-y-3 rounded-lg border p-4">
      <div className="space-y-1">
        <h3 className="font-medium">Перевірте підключення</h3>
        <p className="text-muted-foreground text-sm">
          Коли налаштуєте АТС, натисніть кнопку нижче. Ми перевіримо, чи надходять дзвінки на ваш
          номер.
        </p>
      </div>
      <Button type="button" className="w-full" onClick={onVerify} disabled={isVerifying}>
        {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isVerifying ? "Перевіряємо..." : "Перевірити підключення"}
      </Button>
      {verifyHint && <p className="text-muted-foreground text-center text-xs">{verifyHint}</p>}
      <InfoNote>
        Для перевірки ми чекаємо вхідний дзвінок на ваш номер. Це може зайняти до 1 хвилини.
      </InfoNote>
    </section>
  );
};
