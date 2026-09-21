import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api-client";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import type {
  AgentNumber,
  NumbersResponse,
  NumberPool,
  NumberPoolResponse,
  ClaimNumberParams,
  ClaimNumberResponse,
  ConnectNumberParams,
  ConnectNumberResponse,
  ProvisionSipTrunkParams,
  SipTrunkCredentials,
  SipAddress,
  SipAddressesResponse,
  VerifySipParams,
  VerifySipResponse,
  UpdateNumberParams,
} from "@dashboard/types";

const NUMBERS_KEY = ["numbers"] as const;
const NUMBERS_POOL_KEY = ["numbers", "pool"] as const;
const SIP_ADDRESSES_KEY = ["numbers", "sip"] as const;

export const useNumbers = () => {
  return useQuery<AgentNumber[]>({
    queryKey: NUMBERS_KEY,
    queryFn: async () => {
      const data = await apiGet<NumbersResponse>(API_ENDPOINTS.APP_NUMBERS);
      return data.numbers;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useNumberPool = (enabled = true) => {
  return useQuery<NumberPool>({
    queryKey: NUMBERS_POOL_KEY,
    queryFn: async () => {
      const data = await apiGet<NumberPoolResponse>(API_ENDPOINTS.APP_NUMBERS_POOL);
      return { available: data.available, available_by_kind: data.available_by_kind };
    },
    staleTime: 60 * 1000,
    enabled,
  });
};

export const useSipAddresses = (enabled = true) => {
  return useQuery<SipAddressesResponse>({
    queryKey: SIP_ADDRESSES_KEY,
    queryFn: async () => apiGet<SipAddressesResponse>(API_ENDPOINTS.APP_NUMBERS_SIP),
    enabled,
  });
};

export const useClaimNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: ClaimNumberParams): Promise<ClaimNumberResponse> => {
      return apiPost<ClaimNumberResponse>(API_ENDPOINTS.APP_NUMBERS_CLAIM, params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NUMBERS_KEY });
    },
  });
};

export const useConnectNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: ConnectNumberParams): Promise<ConnectNumberResponse> => {
      return apiPost<ConnectNumberResponse>(API_ENDPOINTS.APP_NUMBERS, params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NUMBERS_KEY });
    },
  });
};

export const useProvisionSipTrunk = () => {
  return useMutation({
    mutationFn: async (params: ProvisionSipTrunkParams): Promise<SipTrunkCredentials> => {
      return apiPost<SipTrunkCredentials>(API_ENDPOINTS.APP_NUMBERS_SIP, params);
    },
  });
};

export const useVerifySip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: VerifySipParams): Promise<VerifySipResponse> => {
      return apiPost<VerifySipResponse>(API_ENDPOINTS.APP_NUMBERS_SIP_VERIFY, params);
    },
    onSuccess: (data) => {
      if (!data.verified) return;
      queryClient.invalidateQueries({ queryKey: NUMBERS_KEY });
      queryClient.invalidateQueries({ queryKey: SIP_ADDRESSES_KEY });
    },
  });
};

export const useUpdateNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...params }: UpdateNumberParams & { id: number }) => {
      return apiPatch(apiUrl.number(id), params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NUMBERS_KEY });
    },
  });
};

export const useDeleteNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return apiDelete(apiUrl.number(id));
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NUMBERS_KEY });
      const previousNumbers = queryClient.getQueryData<AgentNumber[]>(NUMBERS_KEY);

      queryClient.setQueryData<AgentNumber[]>(NUMBERS_KEY, (old) =>
        old?.filter((number) => number.id !== id)
      );

      return { previousNumbers };
    },
    onError: (_error, _id, context) => {
      if (context?.previousNumbers) {
        queryClient.setQueryData(NUMBERS_KEY, context.previousNumbers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NUMBERS_KEY });
    },
  });
};

export type { SipAddress };
