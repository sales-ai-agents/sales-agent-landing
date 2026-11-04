import { useMutation } from "@tanstack/react-query";
import { ApiError, apiPost } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import { resolveApiError } from "@/components/landing/api/errors";
import type { FeedbackParams } from "@/components/landing/api/types";
import type { ApiErrors } from "@/components/landing/copy/client-types";
import { useLandingCopy } from "@/components/landing/copy/provider";

interface FeedbackResponse {
  ok?: boolean;
  id?: number;
  error?: string;
}

const submitFeedback = async (params: FeedbackParams, errors: ApiErrors): Promise<void> => {
  try {
    const body = await apiPost<FeedbackResponse>(API_ENDPOINTS.FEEDBACK, params);
    if (body?.ok) return;
    throw new Error(resolveApiError(errors, body?.error));
  } catch (error) {
    if (error instanceof ApiError) throw new Error(resolveApiError(errors, error.code));
    throw error;
  }
};

export function useFeedbackForm() {
  const { copy } = useLandingCopy();
  const { mutateAsync, status, error, reset } = useMutation<void, Error, FeedbackParams>({
    mutationFn: (params) => submitFeedback(params, copy.errors),
    throwOnError: false,
  });

  return {
    submitFeedbackAsync: mutateAsync,
    isLoading: status === "pending",
    errorMessage: error?.message ?? null,
    reset,
  };
}
