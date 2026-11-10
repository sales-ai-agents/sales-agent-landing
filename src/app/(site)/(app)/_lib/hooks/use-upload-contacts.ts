import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiPostFormData } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type {
  ContactsUploadPreviewResponse,
  UploadContactsParams,
  UploadContactsResponse,
} from "@dashboard/types";

const CONSENT_GRANTED = "granted";

const buildUploadFormData = ({
  file,
  phoneColumn,
  nameColumn,
  emailColumn,
  baseTitle,
  consentSource,
}: UploadContactsParams): FormData => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("phone_column", String(phoneColumn));
  formData.append("name_column", String(nameColumn));
  formData.append("email_column", String(emailColumn));
  if (baseTitle) formData.append("base_title", baseTitle);
  if (consentSource) {
    formData.append("consent", CONSENT_GRANTED);
    formData.append("consent_source", consentSource);
  }

  return formData;
};

export const usePreviewContacts = () => {
  return useMutation<ContactsUploadPreviewResponse, Error, File>({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiPostFormData<ContactsUploadPreviewResponse>(
        API_ENDPOINTS.APP_CONTACTS_UPLOAD_PREVIEW,
        formData
      );
    },
  });
};

export const useUploadContacts = () => {
  const queryClient = useQueryClient();

  return useMutation<UploadContactsResponse, Error, UploadContactsParams>({
    mutationFn: (params) =>
      apiPostFormData<UploadContactsResponse>(
        API_ENDPOINTS.APP_CONTACTS_UPLOAD,
        buildUploadFormData(params)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contact-bases"] });
    },
  });
};
