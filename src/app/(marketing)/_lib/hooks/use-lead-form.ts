import { useMutation } from "@tanstack/react-query";

import { apiPost } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { LeadFormParams, LeadFormResult } from "@marketing/types";

const FALLBACK_ERROR_MESSAGE = "Щось пішло не так. Спробуйте ще раз.";

const LEAD_ERROR_MESSAGES: Record<string, string> = {
  name_and_phone_required: "Ім'я та номер телефону обов'язкові.",
  invalid_json: "Невірний формат запиту. Спробуйте ще раз.",
  too_many_requests: "Забагато запитів. Спробуйте через 20 секунд.",
  internal_error: "Сервер тимчасово недоступний. Спробуйте пізніше.",
};

interface LeadResponse {
  ok?: boolean;
  id?: number;
  error?: string;
}

async function submitLead(params: LeadFormParams): Promise<LeadFormResult> {
  const payload = {
    ...params,
    page_url: window.location.href,
    referrer: document.referrer,
  };

  const body = await apiPost<LeadResponse>(API_ENDPOINTS.LEAD, payload);

  if (body?.ok) {
    return { id: body.id! };
  }

  const errorCode: string = body?.error ?? "unknown";
  throw new Error(LEAD_ERROR_MESSAGES[errorCode] ?? FALLBACK_ERROR_MESSAGE);
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
