import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { AgentTemplatesResponse } from "@dashboard/types";

export const useAgentTemplates = () => {
  return useQuery<AgentTemplatesResponse>({
    queryKey: ["agent-templates"],
    queryFn: () => apiGet<AgentTemplatesResponse>(API_ENDPOINTS.APP_AGENT_TEMPLATES),
    staleTime: 30 * 60 * 1000,
  });
};
