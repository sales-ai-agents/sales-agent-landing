"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, Copy, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Label,
} from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import { NUMBER_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { formatUaPhoneDigits } from "@/lib/utils";
import { useConnectNumber, useProvisionSipTrunk, useVerifySip } from "@dashboard/hooks";

import { isValidUaPhone, normalizeUaPhone } from "../../_components/connect-number/constants";

interface StepNumberConnectProps {
  onConnected: (numberId: number) => void;
}

const SIP_HINTS = [
  "Скопіюйте SIP-адресу вище.",
  "Додайте її у своє АТС як напрямок для вихідних дзвінків.",
  "Збережіть налаштування.",
];

const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 120000;

export const StepNumberConnect = ({ onConnected }: StepNumberConnectProps) => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [numberId, setNumberId] = useState<number | null>(null);
  const [sipUri, setSipUri] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [verifyHint, setVerifyHint] = useState("");

  const connectNumber = useConnectNumber();
  const provisionTrunk = useProvisionSipTrunk();
  const verifySip = useVerifySip();

  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollDeadline = useRef(0);

  const normalizedPhone = normalizeUaPhone(phone);
  const canSubmit = isValidUaPhone(phone);
  const isProvisioning = connectNumber.isPending || provisionTrunk.isPending;

  const stopPolling = (): void => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
    setIsPolling(false);
  };

  useEffect(() => stopPolling, []);

  const handleCopy = async (): Promise<void> => {
    if (!sipUri) return;
    try {
      await navigator.clipboard.writeText(sipUri);
      toast.success("SIP-адресу скопійовано");
    } catch {
      toast.error("Не вдалося скопіювати");
    }
  };

  const provision = (): void => {
    connectNumber.mutate(
      { source: "sip", phone: normalizedPhone, direction: "inbound" },
      {
        onSuccess: (created) => {
          setNumberId(created.id);
          provisionTrunk.mutate(
            { number_id: created.id },
            {
              onSuccess: (trunk) => setSipUri(trunk.sip_uri),
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
            setIsVerified(true);
            toast.success("Підключення успішне");
            if (numberId) onConnected(numberId);
            return;
          }
          setVerifyHint(result.hint ?? "Ще не бачили вхідного дзвінка з вашого номера.");
          if (Date.now() >= pollDeadline.current) stopPolling();
        },
        onError: (error) => {
          stopPolling();
          handleMutationError(error, NUMBER_ERROR_MESSAGES);
        },
      }
    );
  };

  const handleVerify = (): void => {
    if (!canSubmit || isPolling) return;
    if (!sipUri) {
      provision();
      return;
    }

    setIsPolling(true);
    pollDeadline.current = Date.now() + POLL_TIMEOUT_MS;
    runVerifyOnce();
    pollTimer.current = setInterval(runVerifyOnce, POLL_INTERVAL_MS);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Підключення АТС (SIP)</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Після цього агент зможе телефонувати з вашого номера
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="sip-address">SIP-адреса</Label>
          {isVerified && (
            <span className="flex items-center gap-1 text-xs font-medium text-green-600">
              <Check className="h-3.5 w-3.5" />
              Підключення успішне
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            id="sip-address"
            className="h-9"
            placeholder="sip:example.sip.livekit.cloud"
            value={sipUri}
            readOnly
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleCopy}
            disabled={!sipUri}
            aria-label="Скопіювати SIP-адресу"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={handleVerify}
            disabled={!canSubmit || isProvisioning || isPolling || isVerified}
          >
            {(isProvisioning || isPolling) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPolling ? "Перевіряємо..." : "Перевірити"}
          </Button>
        </div>
        {isPolling && verifyHint && <p className="text-muted-foreground text-xs">{verifyHint}</p>}
      </div>

      <div className="text-muted-foreground space-y-1 text-sm">
        <p className="text-foreground flex items-center gap-1.5 font-medium">
          <Info className="text-primary h-4 w-4" />
          Як підключити номер
        </p>
        <ol className="list-inside list-decimal space-y-0.5 text-xs">
          {SIP_HINTS.map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ol>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="connect-phone">Вкажіть номер, який підключаєте</Label>
        <InputGroup>
          <InputGroupAddon>
            <Image src="/image/ua-flag.svg" alt="" width={24} height={16} aria-hidden="true" />
            <span className="text-sm">+380</span>
          </InputGroupAddon>
          <InputGroupInput
            id="connect-phone"
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(formatUaPhoneDigits(event.target.value))}
            placeholder="32 245 11 90"
            disabled={!!sipUri}
          />
        </InputGroup>
        <p className="text-muted-foreground text-xs">Вводьте у форматі +380 XX XXX XX XX</p>
      </div>

      <div className="bg-primary/5 text-muted-foreground rounded-lg p-3 text-xs">
        <p className="text-foreground flex items-center gap-1.5 font-medium">
          <Info className="text-primary h-4 w-4" />
          Важливо
        </p>
        <p className="mt-1">
          Дані надає ваш оператор (Binotel, Ringostat, Phonet, Київстар тощо). Якщо виникнуть
          питання, зверніться до їхньої підтримки.
        </p>
      </div>
    </div>
  );
};
