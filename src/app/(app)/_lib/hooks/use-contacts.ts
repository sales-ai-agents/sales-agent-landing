import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api-client";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import type {
  Contact,
  ContactsExportPreviewResponse,
  ContactsResponse,
  ContactsStats,
  CreateContactParams,
  CreateContactResponse,
  UpdateContactParams,
} from "@dashboard/types";

interface ContactsData {
  contacts: Contact[];
  stats: ContactsStats;
}

const EMPTY_STATS: ContactsStats = {
  total_contacts: 0,
  processed_this_month: 0,
  converted_this_month: 0,
  conversion_pct: null,
};

export const useContacts = (search?: string) => {
  return useQuery<ContactsData>({
    queryKey: ["contacts", search ?? ""],
    queryFn: async () => {
      const data = await apiGet<ContactsResponse>(apiUrl.contacts(search));
      return {
        contacts: data.contacts,
        stats: data.stats ?? EMPTY_STATS,
      };
    },
  });
};

export const useContactsExportPreview = (search: string | undefined, enabled: boolean) => {
  return useQuery<ContactsExportPreviewResponse>({
    queryKey: ["contacts-export-preview", search ?? ""],
    queryFn: () => apiGet<ContactsExportPreviewResponse>(apiUrl.contactsExportPreview(search)),
    enabled,
    staleTime: 30 * 1000,
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateContactParams): Promise<CreateContactResponse> => {
      return apiPost<CreateContactResponse>(API_ENDPOINTS.APP_CONTACTS, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateContactParams & { id: number }) => {
      return apiPatch(apiUrl.contact(id), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return apiDelete(apiUrl.contact(id));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};
