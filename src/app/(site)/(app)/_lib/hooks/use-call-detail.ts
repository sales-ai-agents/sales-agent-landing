import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPut, apiPost } from "@/lib/api-client";
import { apiUrl } from "@/lib/api-config";
import type {
  CallDetail,
  CallDetailResponse,
  CrmStatus,
  CrmStatusResponse,
} from "@dashboard/types";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: string) => {
      return apiPut(apiUrl.callNote(callId), { note });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["call-detail", callId] });
    },
  });
};

export const useCrmStatus = (callId: string | undefined) => {
  return useQuery<CrmStatus | null>({
    queryKey: ["crm-status", callId],
    queryFn: async () => {
      if (!callId) return null;
      const data = await apiGet<CrmStatusResponse>(apiUrl.callCrmStatus(callId));
      return data.crm;
    },
    enabled: !!callId,
  });
};

export const useCrmRetry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (callId: string) => {
      return apiPost(apiUrl.callCrmRetry(callId));
    },
    onSuccess: (_data, callId) => {
      queryClient.invalidateQueries({ queryKey: ["crm-status", callId] });
    },
  });
};
