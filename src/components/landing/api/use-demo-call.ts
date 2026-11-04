import { useMutation } from "@tanstack/react-query";
import { apiPost } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import { resolveApiError } from "@/components/landing/api/errors";
import type { ApiErrors } from "@/components/landing/copy/client-types";
import { useLandingCopy } from "@/components/landing/copy/provider";

const COUNTRY_CODE = "+380";

interface DemoCallResponse {
  ok?: boolean;
  error?: string;
}

const requestDemoCall = async (subscriberDigits: string, errors: ApiErrors): Promise<void> => {
  const body = await apiPost<DemoCallResponse>(API_ENDPOINTS.DEMO_CALL, {
    phone: `${COUNTRY_CODE}${subscriberDigits}`,
  });
  if (body?.ok) return;
  throw new Error(resolveApiError(errors, body?.error));
};

export function useDemoCall() {
  const { copy } = useLandingCopy();
  const { mutate, status, error, reset } = useMutation<void, Error, string>({
    mutationFn: (subscriberDigits) => requestDemoCall(subscriberDigits, copy.errors),
    throwOnError: false,
  });

  return {
    requestCall: mutate,
    isLoading: status === "pending",
    isSuccess: status === "success",
    errorMessage: error?.message ?? null,
    reset,
  };
}
