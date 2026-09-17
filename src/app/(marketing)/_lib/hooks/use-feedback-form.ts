import { useMutation } from "@tanstack/react-query";

import { apiPost, ApiError } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { FeedbackFormParams, FeedbackFormResult } from "@marketing/types";

const FALLBACK_ERROR_MESSAGE = "Щось пішло не так. Спробуйте ще раз.";

const FEEDBACK_ERROR_MESSAGES: Record<string, string> = {
  message_too_short: "Опишіть детальніше, щонайменше 10 символів.",
  invalid_email: "Введіть коректну електронну адресу.",
  consent_required: "Щоб продовжити, підтвердіть згоду на отримання повідомлень.",
  invalid_json: "Невірний формат запиту. Спробуйте ще раз.",
  too_many_requests: "Забагато запитів. Спробуйте через 20 секунд.",
  network_error: "Не вдалося з'єднатися з сервером. Перевірте інтернет.",
  internal_error: "Сервер тимчасово недоступний. Спробуйте пізніше.",
};

const resolveErrorMessage = (code: string): string =>
  FEEDBACK_ERROR_MESSAGES[code] ?? FALLBACK_ERROR_MESSAGE;

interface FeedbackResponse {
  ok?: boolean;
  id?: number;
  error?: string;
}

async function submitFeedback(params: FeedbackFormParams): Promise<FeedbackFormResult> {
  try {
    const body = await apiPost<FeedbackResponse>(API_ENDPOINTS.FEEDBACK, params);

    if (body?.ok) {
      return { id: body.id! };
    }

    throw new Error(resolveErrorMessage(body?.error ?? "unknown"));
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(resolveErrorMessage(error.code));
    }
    throw error;
  }
}

export function useFeedbackForm() {
  const { mutate, mutateAsync, status, data, error, reset } = useMutation<
    FeedbackFormResult,
    Error,
    FeedbackFormParams
  >({
    mutationFn: submitFeedback,
    throwOnError: false,
  });

  return {
    submitFeedback: mutate,
    submitFeedbackAsync: mutateAsync,
    isLoading: status === "pending",
    isSuccess: status === "success",
    result: data ?? null,
    errorMessage: error?.message ?? null,
    reset,
  };
}
