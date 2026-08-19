import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { StatsResponse } from "@/types";

export function useStats() {
  return useQuery<StatsResponse>({
    queryKey: ["stats"],
    queryFn: () => apiGet<StatsResponse>(API_ENDPOINTS.APP_STATS),
  });
}
