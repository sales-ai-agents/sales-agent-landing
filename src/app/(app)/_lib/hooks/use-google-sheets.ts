import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiDelete, apiGet, apiPost } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { GoogleSheetsAuthUrlResponse, GoogleSheetsConnectResponse } from "@dashboard/types";

export const useGoogleSheetsAuthUrl = () => {
  return useMutation<GoogleSheetsAuthUrlResponse>({
    mutationFn: () =>
      apiGet<GoogleSheetsAuthUrlResponse>(API_ENDPOINTS.APP_INTEGRATIONS_GOOGLE_SHEETS_AUTH_URL),
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
