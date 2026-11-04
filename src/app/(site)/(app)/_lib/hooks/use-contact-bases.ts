import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { ContactBase, ContactBasesResponse } from "@dashboard/types";

export const useContactBases = () => {
  return useQuery<ContactBase[]>({
    queryKey: ["contact-bases"],
    queryFn: async () => {
      const data = await apiGet<ContactBasesResponse>(API_ENDPOINTS.APP_CONTACT_BASES);
      return data.bases;
    },
    staleTime: 5 * 60 * 1000,
  });
};
