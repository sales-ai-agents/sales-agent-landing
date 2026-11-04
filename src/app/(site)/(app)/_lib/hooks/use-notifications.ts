import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPatch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type {
  NotificationSetting,
  NotificationsResponse,
  UpdateNotificationsParams,
  UpdateNotificationsResponse,
} from "@dashboard/types";

export const useNotifications = () => {
  return useQuery<NotificationSetting[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const data = await apiGet<NotificationsResponse>(API_ENDPOINTS.APP_NOTIFICATIONS);
      return data.notifications;
    },
  });
};

export const useUpdateNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateNotificationsResponse, Error, UpdateNotificationsParams>({
    mutationFn: (params) =>
      apiPatch<UpdateNotificationsResponse>(API_ENDPOINTS.APP_NOTIFICATIONS, params),
    onSuccess: (data) => {
      queryClient.setQueryData<NotificationSetting[]>(["notifications"], data.notifications);
    },
  });
};
