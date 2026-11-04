import { useMutation } from "@tanstack/react-query";
import { ApiError, apiPost } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { LeadParams } from "@/components/landing/api/types";

const FALLBACK_ERROR = "Щось пішло не так. Спробуйте ще раз.";

const ERROR_MESSAGES: Readonly<Record<string, string>> = {
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

const resolveMessage = (code: string): string => ERROR_MESSAGES[code] ?? FALLBACK_ERROR;

const submitLead = async (params: LeadParams): Promise<void> => {
  try {
    const body = await apiPost<LeadResponse>(API_ENDPOINTS.LEAD, {
      ...params,
      referrer: document.referrer || undefined,
    });
    if (body?.ok) return;
    throw new Error(resolveMessage(body?.error ?? ""));
  } catch (error) {
    if (error instanceof ApiError) throw new Error(resolveMessage(error.code));
    throw error;
  }
};

export function useLeadForm() {
  const { mutateAsync, status, error, reset } = useMutation<void, Error, LeadParams>({
    mutationFn: submitLead,
    throwOnError: false,
  });

  return {
    submitLeadAsync: mutateAsync,
    isLoading: status === "pending",
    errorMessage: error?.message ?? null,
    reset,
  };
}
