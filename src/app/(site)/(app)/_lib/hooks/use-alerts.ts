import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPost } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { AlertsResponse, MarkAlertSeenParams, MarkAlertSeenResponse } from "@dashboard/types";

const ALERTS_QUERY_KEY = ["alerts"] as const;

export const useAlerts = () => {
  return useQuery<AlertsResponse>({
    queryKey: ALERTS_QUERY_KEY,
    queryFn: () => apiGet<AlertsResponse>(API_ENDPOINTS.APP_ALERTS),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
};

export const useMarkAlertsSeen = () => {
  const queryClient = useQueryClient();

  return useMutation<MarkAlertSeenResponse, Error, MarkAlertSeenParams | undefined>({
    mutationFn: (params) => apiPost<MarkAlertSeenResponse>(API_ENDPOINTS.APP_ALERTS_SEEN, params),
    onSuccess: (data, params) => {
      queryClient.setQueryData<AlertsResponse>(ALERTS_QUERY_KEY, (prev) => {
        if (!prev) return prev;

        const keys = params?.keys;

        if (!keys) {
          return {
            ...prev,
            unread: 0,
            items: prev.items.map((item) => ({ ...item, unread: false })),
          };
        }

        const keySet = new Set(keys);
        return {
          ...prev,
          unread: Math.max(0, prev.unread - data.marked),
          items: prev.items.map((item) =>
            keySet.has(item.key) ? { ...item, unread: false } : item
          ),
        };
      });
    },
  });
};
