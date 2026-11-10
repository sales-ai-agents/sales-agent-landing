import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPost } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type {
  Campaign,
  CampaignsResponse,
  ControlCampaignParams,
  StartCampaignParams,
  StartCampaignResponse,
} from "@dashboard/types";

const CAMPAIGNS_KEY = ["campaigns"] as const;
const CAMPAIGNS_POLL_MS = 10_000;

export const useCampaigns = () => {
  return useQuery<Campaign[]>({
    queryKey: CAMPAIGNS_KEY,
    queryFn: async () => {
      const data = await apiGet<CampaignsResponse>(API_ENDPOINTS.APP_CAMPAIGNS);
      return data.campaigns;
    },
    refetchInterval: (query) =>
      query.state.data?.some((campaign) => campaign.status === "running")
        ? CAMPAIGNS_POLL_MS
        : false,
  });
};

export const useStartCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation<StartCampaignResponse, Error, StartCampaignParams>({
    mutationFn: (params) => apiPost<StartCampaignResponse>(API_ENDPOINTS.APP_CAMPAIGNS, params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEY }),
  });
};

export const useControlCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, ControlCampaignParams>({
    mutationFn: (params) => apiPost(API_ENDPOINTS.APP_CAMPAIGNS_CONTROL, params),
    onSettled: () => queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEY }),
  });
};
