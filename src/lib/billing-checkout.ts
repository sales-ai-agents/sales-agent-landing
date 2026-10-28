export const SAVE_INVOICE_ERROR =
  "Не вдалося зберегти дані рахунку для перевірки оплати. Дозвольте сайту зберігати дані та спробуйте ще раз.";

const PENDING_BILLING_KEY = "pending_billing_payment";
const BILLING_RETURN_PATH = "/dashboard/billing/success";

export interface PendingBillingPayment {
  invoiceId: string;
  accountId: number;
}

export function buildBillingReturnUrl(): string {
  return `${window.location.origin}${BILLING_RETURN_PATH}`;
}

export function savePendingBillingPayment(payment: PendingBillingPayment): boolean {
  try {
    const serialized = JSON.stringify(payment);
    window.sessionStorage.setItem(PENDING_BILLING_KEY, serialized);
    return window.sessionStorage.getItem(PENDING_BILLING_KEY) === serialized;
  } catch {
    return false;
  }
}

export function getPendingBillingPayment(): PendingBillingPayment | null {
  try {
    const raw = window.sessionStorage.getItem(PENDING_BILLING_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<PendingBillingPayment>;
    if (typeof parsed.invoiceId !== "string" || typeof parsed.accountId !== "number") return null;

    return { invoiceId: parsed.invoiceId, accountId: parsed.accountId };
  } catch {
    return null;
  }
}

export function clearPendingBillingPayment(): void {
  try {
    window.sessionStorage.removeItem(PENDING_BILLING_KEY);
  } catch {
    // Storage can be unavailable when the browser blocks site data.
  }
}
