import { useMutation } from "@tanstack/react-query";

import { apiPost, ApiError } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { LeadFormParams, LeadFormResult } from "@marketing/types";

const FALLBACK_ERROR_MESSAGE = "Щось пішло не так. Спробуйте ще раз.";

const LEAD_ERROR_MESSAGES: Record<string, string> = {
  name_and_phone_required: "Ім'я та номер телефону обов'язкові.",
  invalid_json: "Невірний формат запиту. Спробуйте ще раз.",
  too_many_requests: "Забагато запитів. Спробуйте через пару хв.",
  network_error: "Не вдалося з'єднатися з сервером. Перевірте інтернет.",
  internal_error: "Сервер тимчасово недоступний. Спробуйте пізніше.",
};

interface LeadResponse {
  ok?: boolean;
  id?: number;
  error?: string;
}

const resolveErrorMessage = (code: string): string =>
  LEAD_ERROR_MESSAGES[code] ?? FALLBACK_ERROR_MESSAGE;

async function submitLead(params: LeadFormParams): Promise<LeadFormResult> {
  const payload = {
    ...params,
    referrer: document.referrer || undefined,
  };

  try {
    const body = await apiPost<LeadResponse>(API_ENDPOINTS.LEAD, payload);

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

export function useLeadForm() {
  const { mutate, mutateAsync, status, data, error, reset } = useMutation<
    LeadFormResult,
    Error,
    LeadFormParams
  >({
    mutationFn: submitLead,
    throwOnError: false,
  });

  return {
    submitLead: mutate,
    submitLeadAsync: mutateAsync,
    isLoading: status === "pending",
    isSuccess: status === "success",
    result: data ?? null,
    errorMessage: error?.message ?? null,
    reset,
  };
}
