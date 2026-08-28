import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPost, apiDelete } from "@/lib/api-client";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import type {
  ApiKey,
  ApiKeysResponse,
  CreateApiKeyParams,
  CreateApiKeyResponse,
} from "@dashboard/types";

export const useApiKeys = () => {
  return useQuery<ApiKey[]>({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const data = await apiGet<ApiKeysResponse>(API_ENDPOINTS.APP_API_KEYS);
      return data.keys;
    },
  });
};

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateApiKeyResponse, Error, CreateApiKeyParams>({
    mutationFn: (params) => apiPost<CreateApiKeyResponse>(API_ENDPOINTS.APP_API_KEYS, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
  });
};

export const useDeleteApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return apiDelete(apiUrl.apiKey(id));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
  });
};
