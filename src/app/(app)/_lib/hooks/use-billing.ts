import { useQuery, useMutation } from "@tanstack/react-query";

import { apiGet, apiPost } from "@/lib/api-client";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import type {
  BillingPlansResponse,
  CheckoutResponse,
  PaymentStatusResponse,
  PaymentHistoryResponse,
} from "@dashboard/types";

export const useBillingPlans = () => {
  return useQuery<BillingPlansResponse>({
    queryKey: ["billing", "plans"],
    queryFn: () => apiGet<BillingPlansResponse>(API_ENDPOINTS.APP_BILLING_PLANS),
  });
};

export const useCheckout = () => {
  return useMutation<CheckoutResponse, Error, { plan: string }>({
    mutationFn: (params) => apiPost<CheckoutResponse>(API_ENDPOINTS.APP_BILLING_CHECKOUT, params),
  });
};

export const usePaymentStatus = (invoiceId: string | null) => {
  return useQuery<PaymentStatusResponse>({
    queryKey: ["billing", "status", invoiceId],
    queryFn: () => apiGet<PaymentStatusResponse>(apiUrl.billingStatus(invoiceId!)),
    enabled: !!invoiceId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 3000;
      if (data.paid || data.status === "failure" || data.status === "expired") return false;
      return 3000;
    },
  });
};

export const useBillingHistory = () => {
  return useQuery<PaymentHistoryResponse>({
    queryKey: ["billing", "history"],
    queryFn: () => apiGet<PaymentHistoryResponse>(API_ENDPOINTS.APP_BILLING_HISTORY),
  });
};
