import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/api-client";
import { apiUrl } from "@/lib/api-config";
import type { CallsResponse } from "@dashboard/types";

export function useCallLogs(limit?: number, offset?: number) {
  return useQuery<CallsResponse>({
    queryKey: ["call-logs", limit, offset],
    queryFn: () => apiGet<CallsResponse>(apiUrl.calls({ limit, offset })),
  });
}
