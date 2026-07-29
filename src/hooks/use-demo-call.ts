import { useMutation } from "@tanstack/react-query";

const DEMO_CALL_URL = "https://api.calls4u.ai/webhook/demo-call";
const UA_COUNTRY_CODE = "+380";

const DEMO_CALL_ERROR_MESSAGES: Record<string, string> = {
  invalid_phone: "Невірний формат номера. Перевірте і спробуйте ще раз.",
  invalid_json: "Невірний формат запиту. Спробуйте ще раз.",
  phone_cooldown: "Ми вже телефонували на цей номер. Спробуйте пізніше.",
  ip_limit: "Забагато запитів. Спробуйте через годину.",
  busy_try_later: "Зараз багато заявок. Спробуйте за кілька хвилин.",
} as const;

const FALLBACK_ERROR_MESSAGE = "Щось пішло не так. Спробуйте ще раз.";
const NETWORK_ERROR_MESSAGE =
  "Не вдалося з'єднатися з сервером. Перевірте інтернет і спробуйте ще раз.";

async function requestDemoCall(subscriberDigits: string): Promise<void> {
  const phone = `${UA_COUNTRY_CODE}${subscriberDigits}`;

  let response: Response;
  try {
    response = await fetch(DEMO_CALL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  const body = await response.json().catch(() => ({}));

  if (response.ok && body?.ok) return;

  const errorCode: string = body?.error ?? "unknown";
  throw new Error(DEMO_CALL_ERROR_MESSAGES[errorCode] ?? FALLBACK_ERROR_MESSAGE);
}

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
