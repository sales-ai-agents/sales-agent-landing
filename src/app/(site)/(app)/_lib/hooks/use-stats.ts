import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/api-client";
import { apiUrl } from "@/lib/api-config";
import type { StatsFilter, StatsResponse } from "@dashboard/types";

export const useStats = (days: number = 7, filter: StatsFilter = {}) => {
  return useQuery<StatsResponse>({
    queryKey: ["stats", days, filter.agent_id ?? 0, filter.number_id ?? 0],
    queryFn: () => apiGet<StatsResponse>(apiUrl.stats({ days, ...filter })),
    placeholderData: (previous) => previous,
  });
};
