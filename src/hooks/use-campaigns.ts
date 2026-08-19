import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiGet, apiPost, ApiRequestError } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type {
  Campaign,
  CampaignsResponse,
  CreateCampaignParams,
  ControlCampaignParams,
} from "@/types";

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
    mutationFn: async (data: CreateCampaignParams): Promise<Campaign> => {
      return apiPost<Campaign>(API_ENDPOINTS.APP_CAMPAIGNS, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Кампанію створено");
    },
    onError: (error: ApiRequestError) => {
      toast.error(error.message);
    },
  });
}

export function useControlCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: ControlCampaignParams) => {
      return apiPost(API_ENDPOINTS.APP_CAMPAIGNS_CONTROL, params);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      const labels: Record<string, string> = {
        pause: "призупинено",
        resume: "відновлено",
        stop: "зупинено",
      };
      toast.success(`Кампанію ${labels[variables.action]}`);
    },
    onError: (error: ApiRequestError) => {
      toast.error(error.message);
    },
  });
}
