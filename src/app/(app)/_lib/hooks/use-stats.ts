import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { StatsResponse } from "@dashboard/types";

export function useStats(days: number = 7) {
  return useQuery<StatsResponse>({
    queryKey: ["stats", days],
    queryFn: () => apiGet<StatsResponse>(`${API_ENDPOINTS.APP_STATS}?days=${days}`),
  });
}
