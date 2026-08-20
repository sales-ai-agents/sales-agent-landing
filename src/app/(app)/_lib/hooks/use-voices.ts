import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { Voice, VoicesResponse } from "@dashboard/types";

export function useVoices() {
  return useQuery<Voice[]>({
    queryKey: ["voices"],
    queryFn: async () => {
      const data = await apiGet<VoicesResponse>(API_ENDPOINTS.APP_VOICES);
      return data.voices;
    },
    staleTime: 10 * 60 * 1000,
  });
}
