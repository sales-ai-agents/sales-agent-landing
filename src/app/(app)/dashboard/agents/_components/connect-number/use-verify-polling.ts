"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { NUMBER_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { useVerifySip } from "@dashboard/hooks";

const POLL_INTERVAL_MS = 4000;
const POLL_TIMEOUT_MS = 120000;

interface UseVerifyPollingOptions {
  defaultHint?: string;
  useServerHint?: boolean;
  onVerified?: () => void;
}

interface UseVerifyPollingResult {
  isPolling: boolean;
  isVerified: boolean;
  hint: string;
  start: (phone: string) => void;
  reset: () => void;
}

export const useVerifyPolling = ({
  defaultHint = "",
  useServerHint = false,
  onVerified,
}: UseVerifyPollingOptions = {}): UseVerifyPollingResult => {
  const verifySip = useVerifySip();

  const resolveHint = useCallback(
    (serverHint?: string): string => (useServerHint && serverHint ? serverHint : defaultHint),
    [defaultHint, useServerHint]
  );

  const [isPolling, setIsPolling] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [hint, setHint] = useState(defaultHint);

  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollDeadline = useRef(0);
  const sinceRef = useRef<string | undefined>(undefined);
  const phoneRef = useRef("");

  const stopPolling = useCallback((): void => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
    setIsPolling(false);
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  const settleVerified = useCallback((): void => {
    stopPolling();
    setIsVerified(true);
    onVerified?.();
  }, [onVerified, stopPolling]);

  const pollOnce = useCallback((): void => {
    verifySip.mutate(
      { phone: phoneRef.current, since: sinceRef.current },
      {
        onSuccess: (result) => {
          if (result.verified) {
            settleVerified();
            return;
          }
          setHint(resolveHint(result.hint));
          if (Date.now() >= pollDeadline.current) stopPolling();
        },
        onError: (error) => {
          stopPolling();
          handleMutationError(error, NUMBER_ERROR_MESSAGES);
        },
      }
    );
  }, [resolveHint, settleVerified, stopPolling, verifySip]);

  const start = useCallback(
    (phone: string): void => {
      if (isPolling) return;

      stopPolling();
      setIsVerified(false);
      setIsPolling(true);
      phoneRef.current = phone;
      sinceRef.current = undefined;
      pollDeadline.current = Date.now() + POLL_TIMEOUT_MS;

      verifySip.mutate(
        { phone, start: true },
        {
          onSuccess: (result) => {
            sinceRef.current = result.since;
            if (result.verified) {
              settleVerified();
              return;
            }
            setHint(resolveHint(result.hint));
            pollTimer.current = setInterval(pollOnce, POLL_INTERVAL_MS);
          },
          onError: (error) => {
            stopPolling();
            handleMutationError(error, NUMBER_ERROR_MESSAGES);
          },
        }
      );
    },
    [isPolling, pollOnce, resolveHint, settleVerified, stopPolling, verifySip]
  );

  const reset = useCallback((): void => {
    stopPolling();
    setIsVerified(false);
    setHint(defaultHint);
    sinceRef.current = undefined;
    phoneRef.current = "";
  }, [defaultHint, stopPolling]);

  return { isPolling, isVerified, hint, start, reset };
};
