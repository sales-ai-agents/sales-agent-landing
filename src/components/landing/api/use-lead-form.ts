import { useMutation } from "@tanstack/react-query";
import { ApiError, apiPost } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import { resolveApiError } from "@/components/landing/api/errors";
import type { LeadParams } from "@/components/landing/api/types";
import type { ApiErrors } from "@/components/landing/copy/client-types";
import { useLandingCopy } from "@/components/landing/copy/provider";

interface LeadResponse {
  ok?: boolean;
  id?: number;
  error?: string;
}

const submitLead = async (params: LeadParams, errors: ApiErrors): Promise<void> => {
  try {
    const body = await apiPost<LeadResponse>(API_ENDPOINTS.LEAD, {
      ...params,
      referrer: document.referrer || undefined,
    });
    if (body?.ok) return;
    throw new Error(resolveApiError(errors, body?.error));
  } catch (error) {
    if (error instanceof ApiError) throw new Error(resolveApiError(errors, error.code));
    throw error;
  }
};

export function useLeadForm() {
  const { copy } = useLandingCopy();
  const { mutateAsync, status, error, reset } = useMutation<void, Error, LeadParams>({
    mutationFn: (params) => submitLead(params, copy.errors),
    throwOnError: false,
  });

  return {
    submitLeadAsync: mutateAsync,
    isLoading: status === "pending",
    errorMessage: error?.message ?? null,
    reset,
  };
}
