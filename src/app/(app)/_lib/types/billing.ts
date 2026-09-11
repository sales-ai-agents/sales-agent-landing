export interface BillingPlanYear {
  price_usd: number;
  price_uah: number | null;
  months_free: number;
  saving_usd: number;
}

export type BillingCurrency = "USD";

export interface BillingPlan {
  key: string;
  title: string;
  price_usd: number;
  currency: BillingCurrency;
  price_uah: number | null;
  usd_rate?: number | null;
  year?: BillingPlanYear;
  minutes: number;
  agents: number;
}

export interface BillingPlansResponse {
  ok: boolean;
  current: string;
  expires_at: string | null;
  days_left: number | null;
  expired: boolean;
  minutes: number;
  plans: BillingPlan[];
}

export type BillingPeriod = "month" | "year";

export interface CheckoutRequest {
  plan: string;
  period?: BillingPeriod;
}

export interface CheckoutResponse {
  ok: boolean;
  invoice_id: string;
  payment_url: string;
  amount_uah: number;
  price_usd: number;
  usd_rate: number;
  plan: string;
  period: BillingPeriod;
}

export type PaymentStatus =
  "created" | "processing" | "hold" | "success" | "failure" | "reversed" | "expired";

export interface PaymentStatusResponse {
  ok: boolean;
  paid: boolean;
  status: PaymentStatus;
  plan: string;
  amount_uah: number;
  current_plan: string;
  expires_at: string | null;
  days_left: number | null;
  minutes: number;
}

export interface PaymentMethodCard {
  saved: boolean;
  masked?: string;
  brand?: string;
  saved_at?: string | null;
}

export interface BillingPaymentMethodResponse {
  ok: boolean;
  card: PaymentMethodCard;
  auto_charge: boolean;
}

export type PaymentHistoryStatus = "created" | "success" | "failure" | "reversed" | "expired";

export interface PaymentHistoryItem {
  id: number;
  plan: string;
  amount_uah: number;
  price_usd: number | null;
  usd_rate: number | null;
  status: PaymentHistoryStatus;
  created_at: string;
  paid_at: string | null;
  invoice_id: string;
  has_receipt: boolean;
}

export interface PaymentHistoryResponse {
  ok: boolean;
  payments: PaymentHistoryItem[];
}
