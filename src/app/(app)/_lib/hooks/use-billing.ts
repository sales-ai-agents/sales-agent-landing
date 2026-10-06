import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryKey, UseQueryResult } from "@tanstack/react-query";

import { apiGet, apiPost, apiDelete } from "@/lib/api-client";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import { resolvePaymentOutcome } from "@dashboard/payment-status";
import type {
  AutoRenewRequest,
  AutoRenewResponse,
  BillingPlansResponse,
  CheckoutRequest,
  CheckoutResponse,
  PaymentStatusResponse,
  PaymentHistoryResponse,
  BillingPaymentMethodResponse,
  TopUpRequest,
  TopUpResponse,
} from "@dashboard/types";

const STATUS_POLL_INTERVAL_MS = 2000;
const STATUS_POLL_MAX_ATTEMPTS = 15;

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
      queryClient.invalidateQueries({ queryKey: ["billing", "plans"] });
    },
  });
};

export const useAutoRenew = () => {
  const queryClient = useQueryClient();
  return useMutation<AutoRenewResponse, Error, AutoRenewRequest>({
    mutationFn: (params) =>
      apiPost<AutoRenewResponse>(API_ENDPOINTS.APP_BILLING_AUTO_RENEW, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "payment-method"] });
      queryClient.invalidateQueries({ queryKey: ["billing", "plans"] });
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

export const useTopUp = () => {
  const queryClient = useQueryClient();
  return useMutation<TopUpResponse, Error, TopUpRequest>({
    mutationFn: (params) => apiPost<TopUpResponse>(API_ENDPOINTS.APP_BILLING_TOPUP, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "history"] });
    },
  });
};

export type UsePaymentStatusResult = UseQueryResult<PaymentStatusResponse, Error> & {
  hasTimedOut: boolean;
};

const attemptsSpent = (state: { dataUpdateCount: number; errorUpdateCount: number }): number =>
  state.dataUpdateCount + state.errorUpdateCount;

export const usePaymentStatus = (invoiceId: string | null): UsePaymentStatusResult => {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["billing", "status", invoiceId];

  const query = useQuery<PaymentStatusResponse, Error>({
    queryKey,
    queryFn: () => apiGet<PaymentStatusResponse>(apiUrl.billingStatus(invoiceId!)),
    enabled: Boolean(invoiceId),
    retry: false,
    refetchInterval: ({ state }) => {
      if (state.data && resolvePaymentOutcome(state.data) !== "pending") return false;
      if (attemptsSpent(state) >= STATUS_POLL_MAX_ATTEMPTS) return false;
      return STATUS_POLL_INTERVAL_MS;
    },
  });

  const state = queryClient.getQueryState<PaymentStatusResponse, Error>(queryKey);
  const budgetSpent = state ? attemptsSpent(state) >= STATUS_POLL_MAX_ATTEMPTS : false;
  const isPending = query.data ? resolvePaymentOutcome(query.data) === "pending" : false;
  const hasTimedOut = isPending && budgetSpent;

  return { ...query, hasTimedOut };
};

export const useBillingHistory = () => {
  return useQuery<PaymentHistoryResponse>({
    queryKey: ["billing", "history"],
    queryFn: () => apiGet<PaymentHistoryResponse>(API_ENDPOINTS.APP_BILLING_HISTORY),
  });
};
