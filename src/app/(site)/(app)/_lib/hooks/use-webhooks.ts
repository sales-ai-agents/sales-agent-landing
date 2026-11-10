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

const WEBHOOKS_KEY = ["webhooks"] as const;
const INTEGRATIONS_KEY = ["integrations"] as const;

interface WebhookDeliveriesOptions {
  webhookId: number;
  limit?: number;
  enabled?: boolean;
}

const useInvalidateWebhooks = () => {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: WEBHOOKS_KEY }),
      queryClient.invalidateQueries({ queryKey: INTEGRATIONS_KEY }),
    ]);
};

export const useWebhooks = () => {
  return useQuery<Webhook[]>({
    queryKey: WEBHOOKS_KEY,
    queryFn: async () => {
      const data = await apiGet<WebhooksResponse>(API_ENDPOINTS.APP_WEBHOOKS);
      return data.webhooks;
    },
  });
};

export const useCreateWebhook = () => {
  const invalidateWebhooks = useInvalidateWebhooks();

  return useMutation<CreateWebhookResponse, Error, CreateWebhookParams>({
    mutationFn: (params) => apiPost<CreateWebhookResponse>(API_ENDPOINTS.APP_WEBHOOKS, params),
    onSuccess: invalidateWebhooks,
    gcTime: 0,
  });
};

export const useUpdateWebhook = () => {
  const invalidateWebhooks = useInvalidateWebhooks();

  return useMutation<unknown, Error, UpdateWebhookParams & { id: number }>({
    mutationFn: ({ id, ...data }) => apiPatch(apiUrl.webhook(id), data),
    onSuccess: invalidateWebhooks,
  });
};

export const useDeleteWebhook = () => {
  const invalidateWebhooks = useInvalidateWebhooks();

  return useMutation<unknown, Error, number>({
    mutationFn: (id) => apiDelete(apiUrl.webhook(id)),
    onSettled: invalidateWebhooks,
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
    gcTime: 0,
  });
};

export const useWebhookDeliveries = ({
  webhookId,
  limit,
  enabled = true,
}: WebhookDeliveriesOptions) => {
  return useQuery<WebhookDelivery[]>({
    queryKey: [...WEBHOOKS_KEY, "deliveries", webhookId, limit],
    queryFn: async () => {
      const data = await apiGet<WebhookDeliveriesResponse>(
        apiUrl.webhookDeliveries(webhookId, limit)
      );
      return data.deliveries;
    },
    enabled,
  });
};
