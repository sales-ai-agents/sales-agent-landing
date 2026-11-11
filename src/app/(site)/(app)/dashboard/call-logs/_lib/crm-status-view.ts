import { CRM_ERROR_MESSAGES, resolveErrorMessage } from "@/lib/error-messages";
import { formatDateTime } from "@/lib/utils";
import { formatCrmReference } from "@dashboard/crm-reference";
import type { CrmStatus } from "@dashboard/types";

export type CrmStatusTone = "success" | "pending" | "warning" | "error" | "neutral";

export interface CrmStatusView {
  tone: CrmStatusTone;
  title: string;
  description: string | null;
  retryLabel: string | null;
  needsReconnect: boolean;
}

const CREDENTIAL_ERROR_CODES: ReadonlySet<string> = new Set([
  "auth_failed",
  "no_access",
  "leads_disabled",
]);

const DEFAULT_PROVIDER_NAME = "CRM";
const RETRY_LABEL = "Повторити";
const SEND_LABEL = "Надіслати в CRM";

const view = (
  tone: CrmStatusTone,
  title: string,
  description: string | null,
  retryLabel: string | null = null,
  needsReconnect = false
): CrmStatusView => ({ tone, title, description, retryLabel, needsReconnect });

const describeSynced = (crm: CrmStatus, providerName: string, timeZone?: string): CrmStatusView => {
  const reference = formatCrmReference(crm.external_id);
  const syncedAt = crm.synced_at ? formatDateTime(crm.synced_at, timeZone) : null;
  const noLink = crm.external_url ? null : `у ${providerName} прямого посилання немає`;
  const description = [syncedAt, noLink].filter(Boolean).join(" · ") || null;

  return view("success", reference ? `Надіслано — ${reference}` : "Надіслано", description);
};

const describeFailed = (crm: CrmStatus, providerName: string): CrmStatusView => {
  const retryLabel = crm.can_retry ? RETRY_LABEL : null;

  if (crm.will_retry) {
    return view(
      "warning",
      `${providerName} не відповів`,
      `Повторимо самі, кнопку тиснути не треба · спроба ${crm.attempts}`,
      crm.can_retry ? "Повторити зараз" : null
    );
  }

  if (crm.error && CREDENTIAL_ERROR_CODES.has(crm.error)) {
    return view(
      "error",
      "Не вдалося: доступ до CRM перестав діяти",
      `Перепідключіть ${providerName}, потім натисніть «${RETRY_LABEL}»`,
      retryLabel,
      true
    );
  }

  return view(
    "error",
    "Не вдалося надіслати",
    resolveErrorMessage(crm.error ?? "", CRM_ERROR_MESSAGES),
    retryLabel
  );
};

export const CALL_IN_PROGRESS_VIEW: CrmStatusView = view(
  "neutral",
  "Дзвінок ще триває",
  "Надішлемо самі, щойно розмова закінчиться",
  SEND_LABEL
);

export const describeCrmStatus = (crm: CrmStatus, timeZone?: string): CrmStatusView | null => {
  if (!crm.configured || crm.state === "not_configured") return null;

  const providerName = crm.provider_name ?? DEFAULT_PROVIDER_NAME;
  const sendLabel = crm.can_retry ? SEND_LABEL : null;

  switch (crm.state) {
    case "synced":
      return describeSynced(crm, providerName, timeZone);
    case "pending":
      return view("pending", "Надсилаємо...", "Зазвичай до 10 секунд");
    case "failed":
      return describeFailed(crm, providerName);
    case "skipped":
      return view(
        "neutral",
        "Не надсилали",
        "За налаштуванням у CRM ідуть лише важливі дзвінки",
        sendLabel
      );
    case "not_queued":
      return view("neutral", "Не надсилали", "Дзвінок був до підключення CRM", sendLabel);
    default:
      return null;
  }
};
