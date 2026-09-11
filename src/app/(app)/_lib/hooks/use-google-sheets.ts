import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiDelete, apiGet, apiPost } from "@/lib/api-client";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import type {
  GoogleSheetsAuthUrlResponse,
  GoogleSheetsConnectResponse,
  GoogleSheetsImportParams,
  GoogleSheetsImportResponse,
  GoogleSheetsPreviewResponse,
} from "@dashboard/types";

export const useGoogleSheetsAuthUrl = () => {
  return useMutation<GoogleSheetsAuthUrlResponse, Error, string>({
    mutationFn: (state) => {
      const endpoint = `${API_ENDPOINTS.APP_INTEGRATIONS_GOOGLE_SHEETS_AUTH_URL}?state=${encodeURIComponent(state)}`;
      return apiGet<GoogleSheetsAuthUrlResponse>(endpoint);
    },
  });
};

export const useConnectGoogleSheets = () => {
  const queryClient = useQueryClient();

  return useMutation<GoogleSheetsConnectResponse, Error, { code: string }>({
    mutationFn: ({ code }) =>
      apiPost<GoogleSheetsConnectResponse>(API_ENDPOINTS.APP_INTEGRATIONS_GOOGLE_SHEETS, { code }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
  });
};

export const useDisconnectGoogleSheets = () => {
  const queryClient = useQueryClient();

  return useMutation<{ ok: boolean }, Error>({
    mutationFn: () => apiDelete<{ ok: boolean }>(API_ENDPOINTS.APP_INTEGRATIONS_GOOGLE_SHEETS),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
  });
};

export const useGoogleSheetsPreview = (spreadsheetId: string | null, sheet?: string) => {
  return useQuery<GoogleSheetsPreviewResponse>({
    queryKey: ["google-sheets-preview", spreadsheetId, sheet ?? ""],
    queryFn: () =>
      apiGet<GoogleSheetsPreviewResponse>(apiUrl.googleSheetsPreview(spreadsheetId!, sheet)),
    enabled: Boolean(spreadsheetId),
    staleTime: 60 * 1000,
    retry: false,
  });
};

export const useImportGoogleSheets = () => {
  const queryClient = useQueryClient();

  return useMutation<GoogleSheetsImportResponse, Error, GoogleSheetsImportParams>({
    mutationFn: (params) =>
      apiPost<GoogleSheetsImportResponse>(
        API_ENDPOINTS.APP_INTEGRATIONS_GOOGLE_SHEETS_IMPORT,
        params
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contact-bases"] });
    },
  });
};
