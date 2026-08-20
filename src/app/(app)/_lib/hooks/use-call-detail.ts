import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/api-client";
import { apiUrl } from "@/lib/api-config";
import type { CallDetail, CallDetailResponse } from "@dashboard/types";

export function useCallDetail(callId: string | undefined) {
  return useQuery<CallDetail | null>({
    queryKey: ["call-detail", callId],
    queryFn: async () => {
      if (!callId) return null;
      const data = await apiGet<CallDetailResponse>(apiUrl.call(callId));
      return data.call;
    },
    enabled: !!callId,
  });
}
