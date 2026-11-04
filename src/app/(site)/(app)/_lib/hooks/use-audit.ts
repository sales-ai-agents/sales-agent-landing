import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/api-client";
import { apiUrl } from "@/lib/api-config";
import type { AuditEvent, AuditResponse } from "@dashboard/types";

interface AuditData {
  events: AuditEvent[];
  total: number;
}

export const useAuditLog = (params?: { limit?: number; offset?: number }) => {
  return useQuery<AuditData>({
    queryKey: ["audit", params?.limit, params?.offset],
    queryFn: async () => {
      const data = await apiGet<AuditResponse>(apiUrl.audit(params));
      return { events: data.events, total: data.total };
    },
  });
};
