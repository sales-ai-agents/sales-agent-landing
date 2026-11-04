import { useMutation } from "@tanstack/react-query";
import { apiPost } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { StartWebAgentParams, WebAgentSession } from "@/components/landing/api/types";

const FALLBACK_ERROR = "Щось пішло не так. Спробуйте ще раз.";

const ERROR_MESSAGES: Readonly<Record<string, string>> = {
  instruction_required: "Потрібно вказати інструкцію або обрати пресет.",
  invalid_json: "Невірний формат запиту. Спробуйте ще раз.",
  ip_limit: "Забагато запитів. Спробуйте через годину.",
  busy_try_later: "Зараз багато заявок. Спробуйте за кілька хвилин.",
  instruction_expand_failed: "Не вдалося згенерувати сценарій. Спробуйте ще раз.",
  dispatch_failed: "Сервіс дзвінків тимчасово недоступний. Спробуйте пізніше.",
  livekit_not_configured: "Сервіс голосового зв'язку тимчасово недоступний.",
};

interface WebAgentResponse extends Partial<WebAgentSession> {
  ok?: boolean;
  error?: string;
}

const startWebAgent = async (params: StartWebAgentParams): Promise<WebAgentSession> => {
  const body = await apiPost<WebAgentResponse>(API_ENDPOINTS.WEB_AGENT, params);
  const { ok, room, token, url, identity } = body ?? {};
  if (ok && room && token && url && identity) return { room, token, url, identity };
  throw new Error(ERROR_MESSAGES[body?.error ?? ""] ?? FALLBACK_ERROR);
};

export function useWebAgent() {
  const { mutate, status, data, error, reset } = useMutation<
    WebAgentSession,
    Error,
    StartWebAgentParams
  >({
    mutationFn: startWebAgent,
    throwOnError: false,
  });

  return {
    startAgent: mutate,
    isLoading: status === "pending",
    session: data ?? null,
    errorMessage: error?.message ?? null,
    reset,
  };
}
