import { useMutation } from "@tanstack/react-query";
import { ApiError, apiPost } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { FeedbackParams } from "@/components/landing/api/types";

const FALLBACK_ERROR = "Щось пішло не так. Спробуйте ще раз.";

const ERROR_MESSAGES: Readonly<Record<string, string>> = {
  message_too_short: "Опишіть детальніше, щонайменше 10 символів.",
  invalid_email: "Введіть коректну електронну адресу.",
  consent_required: "Щоб продовжити, підтвердіть згоду на отримання повідомлень.",
  invalid_json: "Невірний формат запиту. Спробуйте ще раз.",
  too_many_requests: "Забагато запитів. Спробуйте через пару хв.",
  network_error: "Не вдалося з'єднатися з сервером. Перевірте інтернет.",
  internal_error: "Сервер тимчасово недоступний. Спробуйте пізніше.",
};

interface FeedbackResponse {
  ok?: boolean;
  id?: number;
  error?: string;
}

const resolveMessage = (code: string): string => ERROR_MESSAGES[code] ?? FALLBACK_ERROR;

const submitFeedback = async (params: FeedbackParams): Promise<void> => {
  try {
    const body = await apiPost<FeedbackResponse>(API_ENDPOINTS.FEEDBACK, params);
    if (body?.ok) return;
    throw new Error(resolveMessage(body?.error ?? ""));
  } catch (error) {
    if (error instanceof ApiError) throw new Error(resolveMessage(error.code));
    throw error;
  }
};

export function useFeedbackForm() {
  const { mutateAsync, status, error, reset } = useMutation<void, Error, FeedbackParams>({
    mutationFn: submitFeedback,
    throwOnError: false,
  });

  return {
    submitFeedbackAsync: mutateAsync,
    isLoading: status === "pending",
    errorMessage: error?.message ?? null,
    reset,
  };
}
