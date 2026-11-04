import { useMutation } from "@tanstack/react-query";

import { apiPost } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { WebAgentSession, StartWebAgentParams } from "@marketing/types";

const FALLBACK_ERROR_MESSAGE = "Щось пішло не так. Спробуйте ще раз.";

const WEB_AGENT_ERROR_MESSAGES: Record<string, string> = {
  instruction_required: "Потрібно вказати інструкцію або обрати пресет.",
  invalid_json: "Невірний формат запиту. Спробуйте ще раз.",
  ip_limit: "Забагато запитів. Спробуйте через годину.",
  busy_try_later: "Зараз багато заявок. Спробуйте за кілька хвилин.",
  instruction_expand_failed: "Не вдалося згенерувати сценарій. Спробуйте ще раз.",
  dispatch_failed: "Сервіс дзвінків тимчасово недоступний. Спробуйте пізніше.",
  livekit_not_configured: "Сервіс голосового зв'язку тимчасово недоступний.",
};

interface WebAgentResponse {
  ok?: boolean;
  room?: string;
  token?: string;
  url?: string;
  identity?: string;
  error?: string;
}

async function startWebAgent(params: StartWebAgentParams): Promise<WebAgentSession> {
  const body = await apiPost<WebAgentResponse>(API_ENDPOINTS.WEB_AGENT, params);

  if (body?.ok) {
    return {
      room: body.room!,
      token: body.token!,
      url: body.url!,
      identity: body.identity!,
    };
  }

  const errorCode: string = body?.error ?? "unknown";
  throw new Error(WEB_AGENT_ERROR_MESSAGES[errorCode] ?? FALLBACK_ERROR_MESSAGE);
}

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
    isSuccess: status === "success",
    session: data ?? null,
    errorMessage: error?.message ?? null,
    reset,
  };
}
