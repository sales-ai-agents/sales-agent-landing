import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPost, apiDelete } from "@/lib/api-client";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import { resolvePaymentOutcome } from "@dashboard/payment-status";
import type {
  BillingPlansResponse,
  CheckoutRequest,
  CheckoutResponse,
  PaymentStatusResponse,
  PaymentHistoryResponse,
  BillingPaymentMethodResponse,
} from "@dashboard/types";

const POLL_INTERVAL_MS = 3000;

export const useBillingPlans = () => {
  return useQuery<BillingPlansResponse>({
    queryKey: ["billing", "plans"],
    queryFn: () => apiGet<BillingPlansResponse>(API_ENDPOINTS.APP_BILLING_PLANS),
  });
};

export const usePaymentMethod = () => {
  return useQuery<BillingPaymentMethodResponse>({
    queryKey: ["billing", "payment-method"],
    queryFn: () => apiGet<BillingPaymentMethodResponse>(API_ENDPOINTS.APP_BILLING_PAYMENT_METHOD),
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation<{ ok: boolean }, Error>({
    mutationFn: () => apiDelete<{ ok: boolean }>(API_ENDPOINTS.APP_BILLING_PAYMENT_METHOD),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "payment-method"] });
    },
  });
};

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation<CheckoutResponse, Error, CheckoutRequest>({
    mutationFn: (params) => apiPost<CheckoutResponse>(API_ENDPOINTS.APP_BILLING_CHECKOUT, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "history"] });
    },
  });
};

export const usePaymentStatus = (invoiceId: string | null) => {
  return useQuery<PaymentStatusResponse>({
    queryKey: ["billing", "status", invoiceId],
    queryFn: () => apiGet<PaymentStatusResponse>(apiUrl.billingStatus(invoiceId!)),
    enabled: !!invoiceId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return POLL_INTERVAL_MS;
      return resolvePaymentOutcome(data) === "pending" ? POLL_INTERVAL_MS : false;
    },
  });
};

export const useBillingHistory = () => {
  return useQuery<PaymentHistoryResponse>({
    queryKey: ["billing", "history"],
    queryFn: () => apiGet<PaymentHistoryResponse>(API_ENDPOINTS.APP_BILLING_HISTORY),
  });
};
