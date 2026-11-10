import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPost } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type {
  SubmitVerificationParams,
  Verification,
  VerificationResponse,
} from "@dashboard/types";

const VERIFICATION_KEY = ["verification"] as const;

export const useVerification = () => {
  return useQuery<Verification>({
    queryKey: VERIFICATION_KEY,
    queryFn: async () => {
      const data = await apiGet<VerificationResponse>(API_ENDPOINTS.APP_VERIFICATION);
      return data.verification;
    },
  });
};

export const useSubmitVerification = () => {
  const queryClient = useQueryClient();

  return useMutation<VerificationResponse, Error, SubmitVerificationParams>({
    mutationFn: (params) => apiPost<VerificationResponse>(API_ENDPOINTS.APP_VERIFICATION, params),
    onSuccess: ({ verification }) => queryClient.setQueryData(VERIFICATION_KEY, verification),
  });
};
