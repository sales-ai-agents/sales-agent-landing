export type BillingPeriod = "month" | "year";

export interface AutoRenewState {
  auto_renew: boolean;
  auto_charge: boolean;
  next_charge_at: string | null;
  auto_renew_period: BillingPeriod;
  auto_renew_consent_at: string | null;
}

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
  numbers?: number;
  pool_numbers?: number;
}

export type TopUpPackKey = "100" | "250" | "500" | "1000" | "2500";

export interface MinutesPack {
  key: TopUpPackKey;
  minutes: number;
  price_uah: number;
  currency: "UAH";
  per_minute_uah: number;
}

export interface BillingPlansResponse extends Partial<AutoRenewState> {
  ok: boolean;
  current: string;
  expires_at: string | null;
  days_left: number | null;
  expired: boolean;
  minutes: number;
  bonus_minutes: number;
  packs: MinutesPack[];
  plans: BillingPlan[];
}

export interface CheckoutRequest {
  plan: string;
  period?: BillingPeriod;
  save_card?: boolean;
  auto_renew?: boolean;
}

export interface CheckoutResponse {
  ok: boolean;
  invoice_id: string;
  payment_url: string;
  return_url: string;
  amount_uah: number;
  price_usd: number;
  usd_rate: number;
  plan: string;
  period: BillingPeriod;
}

export interface TopUpRequest {
  pack: TopUpPackKey;
}

export interface TopUpResponse {
  ok: boolean;
  invoice_id: string;
  payment_url: string;
  amount_uah: number;
  minutes: number;
  pack: TopUpPackKey;
}

export interface AutoRenewRequest {
  enabled: boolean;
}

export interface AutoRenewResponse extends AutoRenewState {
  ok: boolean;
}

export type PaymentStatus =
  | "created"
  | "success"
  | "Declined"
  | "Expired"
  | "Refunded"
  | "InProcessing"
  | "Pending"
  | "RefundInProcessing"
  | "WaitingAuthComplete"
  | (string & {});

export type BillingState = "paid" | "pending" | "failed" | "refunded";

export interface PaymentStatusResponse extends Partial<AutoRenewState> {
  ok: boolean;
  paid: boolean;
  state: BillingState;
  pending: boolean;
  status: PaymentStatus;
  plan: string;
  amount_uah: number;
  current_plan: string;
  current_plan_title?: string;
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

export interface BillingPaymentMethodResponse extends AutoRenewState {
  ok: boolean;
  card: PaymentMethodCard;
}

export interface PaymentHistoryItem {
  id: number;
  plan: string;
  amount_uah: number;
  price_usd: number | null;
  usd_rate: number | null;
  status: PaymentStatus;
  state: BillingState;
  created_at: string;
  paid_at: string | null;
  invoice_id: string;
  has_receipt: boolean;
}

export interface PaymentHistoryResponse {
  ok: boolean;
  payments: PaymentHistoryItem[];
}
