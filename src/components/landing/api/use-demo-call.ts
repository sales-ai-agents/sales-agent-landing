import { useMutation } from "@tanstack/react-query";
import { apiPost } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";

const COUNTRY_CODE = "+380";
const FALLBACK_ERROR = "Щось пішло не так. Спробуйте ще раз.";

const ERROR_MESSAGES: Readonly<Record<string, string>> = {
  invalid_phone: "Невірний формат номера. Перевірте і спробуйте ще раз.",
  invalid_json: "Невірний формат запиту. Спробуйте ще раз.",
  phone_cooldown: "Ми вже телефонували на цей номер. Спробуйте пізніше.",
  ip_limit: "Забагато запитів. Спробуйте через годину.",
  busy_try_later: "Зараз багато заявок. Спробуйте за кілька хвилин.",
};

interface DemoCallResponse {
  ok?: boolean;
  error?: string;
}

const requestDemoCall = async (subscriberDigits: string): Promise<void> => {
  const body = await apiPost<DemoCallResponse>(API_ENDPOINTS.DEMO_CALL, {
    phone: `${COUNTRY_CODE}${subscriberDigits}`,
  });
  if (body?.ok) return;
  throw new Error(ERROR_MESSAGES[body?.error ?? ""] ?? FALLBACK_ERROR);
};

export function useDemoCall() {
  const { mutate, status, error, reset } = useMutation<void, Error, string>({
    mutationFn: requestDemoCall,
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
