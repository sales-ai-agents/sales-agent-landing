import { useMutation } from "@tanstack/react-query";

const WEB_AGENT_URL = "https://api.calls4u.ai/webhook/web-agent/start";

const NETWORK_ERROR_MESSAGE =
  "Не вдалося з'єднатися з сервером. Перевірте інтернет і спробуйте ще раз.";
const FALLBACK_ERROR_MESSAGE = "Щось пішло не так. Спробуйте ще раз.";

export interface WebAgentSession {
  room: string;
  token: string;
  url: string;
}

export interface StartWebAgentParams {
  instruction: string;
  voice: string;
  agent_name: string;
}

async function startWebAgent(params: StartWebAgentParams): Promise<WebAgentSession> {
  let response: Response;
  try {
    response = await fetch(WEB_AGENT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  if (response.ok) {
    const body = await response.json();
    return body as WebAgentSession;
  }

  const body = await response.json().catch(() => ({}));
  const errorCode: string = body?.error ?? body?.code ?? "unknown";
  throw new Error(body?.message ?? errorCode ?? FALLBACK_ERROR_MESSAGE);
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
