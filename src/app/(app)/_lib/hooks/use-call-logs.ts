import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/api-client";
import { apiUrl } from "@/lib/api-config";
import type { CallsResponse, CallsFilter } from "@dashboard/types";

export const useCallLogs = (filters?: CallsFilter) => {
  return useQuery<CallsResponse>({
    queryKey: ["call-logs", filters],
    queryFn: () => apiGet<CallsResponse>(apiUrl.calls(filters)),
  });
};
