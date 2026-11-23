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
  balance_usd?: number;
  chatbot?: boolean;
  coming_soon?: boolean;
}

export interface BillingPlansResponse extends Partial<AutoRenewState> {
  ok: boolean;
  current: string;
  expires_at: string | null;
  days_left: number | null;
  expired: boolean;
  minutes: number;
  bonus_minutes: number;
  balance_usd?: number;
  plans: BillingPlan[];
}

export interface CheckoutRequest {
  plan: string;
  period?: BillingPeriod;
  save_card?: boolean;
  auto_renew?: boolean;
  return_url?: string;
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

export type LedgerKind = "plan_refill" | "topup" | "minutes" | "number" | "admin";

export interface LedgerEntry {
  id: number;
  amount_usd: number;
  kind: LedgerKind;
  minutes: number | null;
  note: string;
  balance_after_usd: number;
  created_at: string;
}

export type AlertBelowUsd = 0 | 2 | 5 | 10;

export interface BalanceResponse {
  ok: boolean;
  balance_usd: number;
  minute_price_usd: number;
  extra_number_price_usd: number;
  plan_balance_usd: number;
  topup_options_usd: number[];
  topup_min_usd: number;
  topup_max_usd: number;
  alert_below_usd: number;
  alert_options_usd: number[];
  ledger: LedgerEntry[];
}

export interface BalanceAlertRequest {
  alert_below_usd: AlertBelowUsd;
}

export interface BalanceTopUpRequest {
  amount_usd: number;
  return_url?: string;
}

export interface BalanceTopUpResponse {
  ok: boolean;
  invoice_id: string;
  payment_url: string;
  amount_usd: number;
  amount_uah: number;
  usd_rate: number;
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
