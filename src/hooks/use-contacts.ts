import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { mockContacts } from "@/lib/mock-data";
import type { Contact } from "@/types";

async function fetchContacts(): Promise<Contact[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return mockContacts;
}

export function useContacts() {
  return useQuery<Contact[]>({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; phone: string; email: string }): Promise<Contact> => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        id: String(Date.now()),
        ...data,
        dateAdded: new Date().toISOString().split("T")[0],
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}
