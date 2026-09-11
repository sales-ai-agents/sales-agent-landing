import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { AgentNumber, NumbersResponse } from "@dashboard/types";

export const useNumbers = () => {
  return useQuery<AgentNumber[]>({
    queryKey: ["numbers"],
    queryFn: async () => {
      const data = await apiGet<NumbersResponse>(API_ENDPOINTS.APP_NUMBERS);
      return data.numbers;
    },
    staleTime: 5 * 60 * 1000,
  });
};
