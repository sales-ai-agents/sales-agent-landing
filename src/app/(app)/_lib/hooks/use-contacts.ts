import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPost } from "@/lib/api-client";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import type { Contact, ContactsResponse, CreateContactParams } from "@dashboard/types";

export function useContacts(search?: string) {
  return useQuery<Contact[]>({
    queryKey: ["contacts", search ?? ""],
    queryFn: async () => {
      const data = await apiGet<ContactsResponse>(apiUrl.contacts(search));
      return data.contacts;
    },
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateContactParams): Promise<Contact> => {
      return apiPost<Contact>(API_ENDPOINTS.APP_CONTACTS, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return apiPost(apiUrl.contactDelete(id), {});
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["contacts"] });
      const previousContacts = queryClient.getQueryData<Contact[]>(["contacts", ""]);

      queryClient.setQueryData<Contact[]>(["contacts", ""], (old) =>
        old?.filter((contact) => contact.id !== id)
      );

      return { previousContacts };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousContacts) {
        queryClient.setQueryData(["contacts", ""], context.previousContacts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}
