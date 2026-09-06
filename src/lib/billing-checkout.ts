const PENDING_BILLING_INVOICE_KEY = "pending_billing_invoice_id";

export function savePendingBillingInvoiceId(invoiceId: string): boolean {
  try {
    window.sessionStorage.setItem(PENDING_BILLING_INVOICE_KEY, invoiceId);
    return window.sessionStorage.getItem(PENDING_BILLING_INVOICE_KEY) === invoiceId;
  } catch {
    return false;
  }
}

export function getPendingBillingInvoiceId(): string | null {
  try {
    return window.sessionStorage.getItem(PENDING_BILLING_INVOICE_KEY);
  } catch {
    return null;
  }
}

export function clearPendingBillingInvoiceId(): void {
  try {
    window.sessionStorage.removeItem(PENDING_BILLING_INVOICE_KEY);
  } catch {
    // Storage can be unavailable when the browser blocks site data.
  }
}
