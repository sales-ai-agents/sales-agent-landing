import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api-client";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import type {
  Webhook,
  WebhooksResponse,
  CreateWebhookParams,
  CreateWebhookResponse,
  UpdateWebhookParams,
  TestWebhookResponse,
  ReissueSecretResponse,
  WebhookDelivery,
  WebhookDeliveriesResponse,
} from "@dashboard/types";

export const useWebhooks = () => {
  return useQuery<Webhook[]>({
    queryKey: ["webhooks"],
    queryFn: async () => {
      const data = await apiGet<WebhooksResponse>(API_ENDPOINTS.APP_WEBHOOKS);
      return data.webhooks;
    },
  });
};

export const useCreateWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateWebhookResponse, Error, CreateWebhookParams>({
    mutationFn: (params) => apiPost<CreateWebhookResponse>(API_ENDPOINTS.APP_WEBHOOKS, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
  });
};

export const useUpdateWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateWebhookParams & { id: number }) => {
      return apiPatch(apiUrl.webhook(id), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
  });
};

export const useDeleteWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return apiDelete(apiUrl.webhook(id));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
  });
};

export const useTestWebhook = () => {
  return useMutation<TestWebhookResponse, Error, number>({
    mutationFn: (id) => apiPost<TestWebhookResponse>(apiUrl.webhookTest(id)),
  });
};

export const useReissueWebhookSecret = () => {
  return useMutation<ReissueSecretResponse, Error, number>({
    mutationFn: (id) => apiPost<ReissueSecretResponse>(apiUrl.webhookSecret(id)),
  });
};

export const useWebhookDeliveries = (webhookId?: number, limit?: number) => {
  return useQuery<WebhookDelivery[]>({
    queryKey: ["webhook-deliveries", webhookId, limit],
    queryFn: async () => {
      const data = await apiGet<WebhookDeliveriesResponse>(
        apiUrl.webhookDeliveries(webhookId, limit)
      );
      return data.deliveries;
    },
  });
};
