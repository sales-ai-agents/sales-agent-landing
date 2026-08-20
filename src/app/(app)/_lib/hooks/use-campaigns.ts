import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPost } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type {
  Campaign,
  CampaignsResponse,
  CreateCampaignParams,
  CreateCampaignResponse,
  ControlCampaignParams,
} from "@dashboard/types";

export function useCampaigns() {
  return useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const data = await apiGet<CampaignsResponse>(API_ENDPOINTS.APP_CAMPAIGNS);
      return data.campaigns;
    },
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCampaignParams): Promise<CreateCampaignResponse> => {
      return apiPost<CreateCampaignResponse>(API_ENDPOINTS.APP_CAMPAIGNS, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useControlCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: ControlCampaignParams) => {
      return apiPost(API_ENDPOINTS.APP_CAMPAIGNS_CONTROL, params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}
