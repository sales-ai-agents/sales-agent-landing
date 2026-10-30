"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-client";
import { NUMBER_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import {
  useConnectNumber,
  useNumbers,
  useProvisionSipTrunk,
  useSipAddresses,
} from "@dashboard/hooks";
import type { AgentNumber } from "@dashboard/types";

import { isValidUaPhone, normalizeUaPhone } from "./constants";
import { useVerifyPolling } from "./use-verify-polling";

const DEFAULT_VERIFY_HINT =
  "Для перевірки ми чекаємо вхідний дзвінок з вашого номера. Це може зайняти до 1 хвилини.";

interface UseSipConnectOptions {
  agentId?: number;
  onVerified?: (numberId: number) => void;
}

const findSipNumberByPhone = (numbers: AgentNumber[], phone: string): AgentNumber | undefined =>
  numbers.find((number) => number.source === "sip" && number.phone === phone);

export const useSipConnect = ({ agentId, onVerified }: UseSipConnectOptions = {}) => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [numberId, setNumberId] = useState<number | null>(null);

  const { data: numbers = [] } = useNumbers();
  const hasSipNumbers = numbers.some((number) => number.source === "sip");
  const { data: sipData } = useSipAddresses(hasSipNumbers);
  const connectNumber = useConnectNumber();
  const provisionTrunk = useProvisionSipTrunk();

  const normalizedPhone = normalizeUaPhone(phone);
  const isPhoneValid = isValidUaPhone(phone);
  const isProvisioning = connectNumber.isPending || provisionTrunk.isPending;

  const existingNumber = useMemo(
    () => (isPhoneValid ? findSipNumberByPhone(numbers, normalizedPhone) : undefined),
    [isPhoneValid, numbers, normalizedPhone]
  );
  const existingAddress = existingNumber
    ? sipData?.addresses.find((address) => address.number_id === existingNumber.id)
    : undefined;

  const activeNumberId = numberId ?? existingNumber?.id ?? null;

  const handleVerified = useCallback((): void => {
    if (activeNumberId) onVerified?.(activeNumberId);
  }, [activeNumberId, onVerified]);

  const verify = useVerifyPolling({
    defaultHint: DEFAULT_VERIFY_HINT,
    useServerHint: true,
    onVerified: handleVerified,
  });

  const credentials = provisionTrunk.data ?? null;
  const credentialsMatchNumber = credentials?.number_id === activeNumberId;
  const activeCredentials = credentialsMatchNumber ? credentials : null;

  const sipHost = activeCredentials?.sip_host ?? sipData?.host ?? "";
  const sipUri = activeCredentials?.sip_uri ?? existingAddress?.sip_uri ?? "";
  const username = activeCredentials?.username ?? existingNumber?.sip_username ?? "";
  const password = activeCredentials?.password ?? null;
  const hasTrunk = Boolean(activeCredentials) || Boolean(existingNumber?.registered);

  const handlePhoneChange = (value: string): void => {
    if (value === phone) return;
    verify.reset();
    setPhone(value);
    setNumberId(null);
    provisionTrunk.reset();
  };

  const issueTrunk = (targetNumberId: number): void => {
    setNumberId(targetNumberId);
    provisionTrunk.mutate(
      { number_id: targetNumberId },
      { onError: (error) => handleMutationError(error, NUMBER_ERROR_MESSAGES) }
    );
  };

  const provision = (): void => {
    if (!isPhoneValid) return;

    if (existingNumber) {
      issueTrunk(existingNumber.id);
      return;
    }

    connectNumber.mutate(
      { source: "sip", phone: normalizedPhone, agent_id: agentId, direction: "inbound" },
      {
        onSuccess: (created) => issueTrunk(created.id),
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

  const startVerify = (): void => verify.start(normalizedPhone);

  return {
    phone,
    setPhone: handlePhoneChange,
    normalizedPhone,
    numberId: activeNumberId,
    isPhoneValid,
    isProvisioning,
    isPolling: verify.isPolling,
    isVerified: verify.isVerified,
    verifyHint: verify.hint,
    sipUri,
    sipHost,
    username,
    password,
    hasTrunk,
    provision,
    startVerify,
  };
};
