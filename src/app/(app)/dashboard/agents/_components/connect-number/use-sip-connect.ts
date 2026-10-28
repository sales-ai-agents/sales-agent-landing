"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  useVerifySip,
} from "@dashboard/hooks";
import type { AgentNumber } from "@dashboard/types";

import { isValidUaPhone, normalizeUaPhone } from "./constants";

const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 120000;
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
  const [verifyHint, setVerifyHint] = useState(DEFAULT_VERIFY_HINT);
  const [isPolling, setIsPolling] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const { data: numbers = [] } = useNumbers();
  const hasSipNumbers = numbers.some((number) => number.source === "sip");
  const { data: sipData } = useSipAddresses(hasSipNumbers);
  const connectNumber = useConnectNumber();
  const provisionTrunk = useProvisionSipTrunk();
  const verifySip = useVerifySip();

  const credentials = provisionTrunk.data ?? null;
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollDeadline = useRef(0);
  const verifySince = useRef<string | undefined>(undefined);

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
  const credentialsMatchNumber = credentials?.number_id === activeNumberId;
  const activeCredentials = credentialsMatchNumber ? credentials : null;

  const sipHost = activeCredentials?.sip_host ?? sipData?.host ?? "";
  const sipUri = activeCredentials?.sip_uri ?? existingAddress?.sip_uri ?? "";
  const username = activeCredentials?.username ?? existingNumber?.sip_username ?? "";
  const password = activeCredentials?.password ?? null;
  const hasTrunk = Boolean(activeCredentials) || Boolean(existingNumber?.registered);

  const stopPolling = (): void => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
    setIsPolling(false);
  };

  useEffect(() => stopPolling, []);

  const handlePhoneChange = (value: string): void => {
    if (value === phone) return;
    stopPolling();
    setPhone(value);
    setNumberId(null);
    setIsVerified(false);
    setVerifyHint(DEFAULT_VERIFY_HINT);
    verifySince.current = undefined;
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

  const settleVerified = (): void => {
    stopPolling();
    setIsVerified(true);
    if (activeNumberId) onVerified?.(activeNumberId);
  };

  const runVerifyOnce = (): void => {
    verifySip.mutate(
      { phone: normalizedPhone, since: verifySince.current },
      {
        onSuccess: (result) => {
          if (result.verified) {
            settleVerified();
            return;
          }
          setVerifyHint(result.hint ?? DEFAULT_VERIFY_HINT);
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
    setIsPolling(true);
    pollDeadline.current = Date.now() + POLL_TIMEOUT_MS;
    verifySince.current = undefined;

    verifySip.mutate(
      { phone: normalizedPhone, start: true },
      {
        onSuccess: (result) => {
          verifySince.current = result.since;
          if (result.verified) {
            settleVerified();
            return;
          }
          setVerifyHint(result.hint ?? DEFAULT_VERIFY_HINT);
          pollTimer.current = setInterval(runVerifyOnce, POLL_INTERVAL_MS);
        },
        onError: (error) => {
          stopPolling();
          handleMutationError(error, NUMBER_ERROR_MESSAGES);
        },
      }
    );
  };

  return {
    phone,
    setPhone: handlePhoneChange,
    normalizedPhone,
    numberId: activeNumberId,
    isPhoneValid,
    isProvisioning,
    isPolling,
    isVerified,
    verifyHint,
    sipUri,
    sipHost,
    username,
    password,
    hasTrunk,
    provision,
    startVerify,
  };
};
