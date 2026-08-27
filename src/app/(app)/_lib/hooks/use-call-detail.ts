import { useQuery, useMutation } from "@tanstack/react-query";

import { apiGet, apiPut } from "@/lib/api-client";
import { apiUrl } from "@/lib/api-config";
import type { CallDetail, CallDetailResponse } from "@dashboard/types";

export const useCallDetail = (callId: string | undefined) => {
  return useQuery<CallDetail | null>({
    queryKey: ["call-detail", callId],
    queryFn: async () => {
      if (!callId) return null;
      const data = await apiGet<CallDetailResponse>(apiUrl.call(callId));
      return data.call;
    },
    enabled: !!callId,
  });
};

export const useSaveNote = (callId: string) => {
  return useMutation({
    mutationFn: async (note: string) => {
      return apiPut(apiUrl.call(callId) + "/note", { note });
    },
  });
};
