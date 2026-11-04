import { useMutation } from "@tanstack/react-query";
import { apiPost } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import { resolveApiError } from "@/components/landing/api/errors";
import type { StartWebAgentParams, WebAgentSession } from "@/components/landing/api/types";
import type { ApiErrors } from "@/components/landing/copy/client-types";
import { useLandingCopy } from "@/components/landing/copy/provider";

interface WebAgentResponse extends Partial<WebAgentSession> {
  ok?: boolean;
  error?: string;
}

const startWebAgent = async (
  params: StartWebAgentParams,
  errors: ApiErrors
): Promise<WebAgentSession> => {
  const body = await apiPost<WebAgentResponse>(API_ENDPOINTS.WEB_AGENT, params);
  const { ok, room, token, url, identity } = body ?? {};
  if (ok && room && token && url && identity) return { room, token, url, identity };
  throw new Error(resolveApiError(errors, body?.error));
};

export function useWebAgent() {
  const { copy } = useLandingCopy();
  const { mutate, status, data, error, reset } = useMutation<
    WebAgentSession,
    Error,
    StartWebAgentParams
  >({
    mutationFn: (params) => startWebAgent(params, copy.errors),
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
