import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type {
  ConnectCrmParams,
  CrmIntegration,
  CrmIntegrationResponse,
  TestCrmResponse,
  UpdateCrmParams,
} from "@dashboard/types";

const CRM_KEY = ["crm-integration"] as const;
const INTEGRATIONS_KEY = ["integrations"] as const;
const CRM_STATUS_KEY = ["crm-status"] as const;

const useInvalidateCrm = () => {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: CRM_KEY }),
      queryClient.invalidateQueries({ queryKey: INTEGRATIONS_KEY }),
      queryClient.invalidateQueries({ queryKey: CRM_STATUS_KEY }),
    ]);
};

export const useCrmIntegration = () => {
  return useQuery<CrmIntegration>({
    queryKey: CRM_KEY,
    queryFn: async () => {
      const data = await apiGet<CrmIntegrationResponse>(API_ENDPOINTS.APP_INTEGRATIONS_CRM);
      return data.crm;
    },
  });
};

export const useConnectCrm = () => {
  const invalidateCrm = useInvalidateCrm();

  return useMutation<CrmIntegrationResponse, Error, ConnectCrmParams>({
    mutationFn: (params) =>
      apiPost<CrmIntegrationResponse>(API_ENDPOINTS.APP_INTEGRATIONS_CRM, params),
    onSuccess: invalidateCrm,
    gcTime: 0,
  });
};

export const useUpdateCrm = () => {
  const queryClient = useQueryClient();

  return useMutation<CrmIntegrationResponse, Error, UpdateCrmParams>({
    mutationFn: (params) =>
      apiPatch<CrmIntegrationResponse>(API_ENDPOINTS.APP_INTEGRATIONS_CRM, params),
    onSuccess: ({ crm }) => queryClient.setQueryData(CRM_KEY, crm),
  });
};

export const useDisconnectCrm = () => {
  const invalidateCrm = useInvalidateCrm();

  return useMutation<unknown, Error, void>({
    mutationFn: () => apiDelete(API_ENDPOINTS.APP_INTEGRATIONS_CRM),
    onSuccess: invalidateCrm,
  });
};

export const useTestCrm = () => {
  const invalidateCrm = useInvalidateCrm();

  return useMutation<TestCrmResponse, Error, void>({
    mutationFn: () => apiPost<TestCrmResponse>(API_ENDPOINTS.APP_INTEGRATIONS_CRM_TEST),
    onSuccess: invalidateCrm,
  });
};
