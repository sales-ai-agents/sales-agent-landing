import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPost, apiDelete } from "@/lib/api-client";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import type {
  BillingPlansResponse,
  CheckoutRequest,
  CheckoutResponse,
  PaymentStatusResponse,
  PaymentHistoryResponse,
  BillingPaymentMethodResponse,
  ReceiptResponse,
} from "@dashboard/types";

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
      if (!data) return 3000;
      if (
        data.paid ||
        data.status === "failure" ||
        data.status === "reversed" ||
        data.status === "expired"
      ) {
        return false;
      }
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

export const downloadReceipt = async (invoiceId: string): Promise<void> => {
  const data = await apiGet<ReceiptResponse>(apiUrl.billingReceipt(invoiceId));
  const base64 = data.file?.trim();

  if (base64) {
    const binary = atob(base64.replace(/^data:application\/pdf;base64,/, ""));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const objectUrl = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = `receipt-${invoiceId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
    return;
  }

  const receiptUrl = data.url?.trim();
  if (receiptUrl) {
    const link = document.createElement("a");
    link.href = receiptUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = `receipt-${invoiceId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    return;
  }

  throw new Error("Банк повернув порожню квитанцію.");
};
