import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { CallsResponse } from "@/types";

export function useCallLogs(limit?: number, offset?: number) {
  const params = new URLSearchParams();
  if (limit !== undefined) params.set("limit", String(limit));
  if (offset !== undefined) params.set("offset", String(offset));

  const url = params.toString()
    ? `${API_ENDPOINTS.APP_CALLS}?${params.toString()}`
    : API_ENDPOINTS.APP_CALLS;

  return useQuery<CallsResponse>({
    queryKey: ["call-logs", limit, offset],
    queryFn: () => apiGet<CallsResponse>(url),
  });
}
