import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiGet, apiPost, ApiRequestError } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { Contact, ContactsResponse, CreateContactParams } from "@/types";

export function useContacts(search?: string) {
  const url = search
    ? `${API_ENDPOINTS.APP_CONTACTS}?search=${encodeURIComponent(search)}`
    : API_ENDPOINTS.APP_CONTACTS;

  return useQuery<Contact[]>({
    queryKey: ["contacts", search ?? ""],
    queryFn: async () => {
      const data = await apiGet<ContactsResponse>(url);
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
      toast.success("Контакт додано");
    },
    onError: (error: ApiRequestError) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return apiPost(`${API_ENDPOINTS.APP_CONTACTS}/${id}/delete`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Контакт видалено");
    },
    onError: (error: ApiRequestError) => {
      toast.error(error.message);
    },
  });
}
