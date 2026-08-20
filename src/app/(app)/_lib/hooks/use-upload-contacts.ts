import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiPostFormData } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";

export interface UploadContactsResponse {
  ok: boolean;
  added: number;
  duplicates: number;
}

export function useUploadContacts() {
  const queryClient = useQueryClient();

  return useMutation<UploadContactsResponse, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      console.log("formData entries:", [...formData.entries()]);

      return apiPostFormData<UploadContactsResponse>(API_ENDPOINTS.APP_CONTACTS_UPLOAD, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}
