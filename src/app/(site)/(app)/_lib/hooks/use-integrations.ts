import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { IntegrationsResponse } from "@dashboard/types";

export const useIntegrations = () => {
  return useQuery<IntegrationsResponse>({
    queryKey: ["integrations"],
    queryFn: () => apiGet<IntegrationsResponse>(API_ENDPOINTS.APP_INTEGRATIONS),
  });
};
