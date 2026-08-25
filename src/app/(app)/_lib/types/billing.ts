export interface BillingPlan {
  key: string;
  title: string;
  price_uah: number;
  currency: "UAH";
  minutes: number;
  agents: number;
}

export interface BillingPlansResponse {
  ok: boolean;
  current: string;
  expires_at: string | null;
  minutes: number;
  plans: BillingPlan[];
}

export interface CheckoutResponse {
  ok: boolean;
  invoice_id: string;
  payment_url: string;
  amount_uah: number;
  plan: string;
}

export interface PaymentStatusResponse {
  ok: boolean;
  paid: boolean;
  status: "created" | "processing" | "hold" | "success" | "failure" | "reversed" | "expired";
  plan: string;
  amount_uah: number;
  current_plan: string;
  expires_at: string | null;
  minutes: number;
}

export interface PaymentHistoryItem {
  id: number;
  plan: string;
  amount_uah: number;
  status: string;
  created_at: string;
  paid_at: string | null;
}

export interface PaymentHistoryResponse {
  ok: boolean;
  payments: PaymentHistoryItem[];
}
