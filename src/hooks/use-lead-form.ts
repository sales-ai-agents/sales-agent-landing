import { useMutation } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/lib/api-config";

const NETWORK_ERROR_MESSAGE =
  "Не вдалося з'єднатися з сервером. Перевірте інтернет і спробуйте ще раз.";
const FALLBACK_ERROR_MESSAGE = "Щось пішло не так. Спробуйте ще раз.";

const LEAD_ERROR_MESSAGES: Record<string, string> = {
  name_and_phone_required: "Ім'я та номер телефону обов'язкові.",
  invalid_json: "Невірний формат запиту. Спробуйте ще раз.",
  too_many_requests: "Забагато запитів. Спробуйте через 20 секунд.",
  internal_error: "Сервер тимчасово недоступний. Спробуйте пізніше.",
} as const;

export interface LeadFormParams {
  name: string;
  phone: string;
  niche?: string;
  contact?: string;
  email?: string;
  telegram?: string;
  company?: string;
  message?: string;
  source_page?: string;
}

export interface LeadFormResult {
  id: number;
}

async function submitLead(params: LeadFormParams): Promise<LeadFormResult> {
  let response: Response;
  try {
    response = await fetch(API_ENDPOINTS.LEAD, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  const body = await response.json().catch(() => ({}));

  if (response.ok && body?.ok) {
    return { id: body.id };
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
