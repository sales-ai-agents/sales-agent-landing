export type NotificationKind = "escalation" | "limit_exhausted" | "call_result";

export interface NotificationSetting {
  kind: NotificationKind;
  email_enabled: boolean;
  telegram_enabled: boolean;
  email: string;
  telegram: string;
}

export interface NotificationsResponse {
  ok: boolean;
  notifications: NotificationSetting[];
}

export interface UpdateNotificationItem {
  kind: NotificationKind;
  email_enabled?: boolean;
  telegram_enabled?: boolean;
  email?: string;
  telegram?: string;
}

export interface UpdateNotificationsParams {
  notifications: UpdateNotificationItem[];
}

export interface UpdateNotificationsResponse {
  ok: boolean;
  notifications: NotificationSetting[];
}

export type AlertKind =
  | "calls_blocked"
  | "email_not_verified"
  | "sla"
  | "call_results"
  | "crm_failed"
  | "trial_ending"
  | "minutes"
  | "balance_low"
  | "numbers_suspended";

export type AlertLevel = "bad" | "warn" | "info";

export type AlertLink =
  "calls" | "calls?status=attention" | "integrations" | "billing" | "balance" | "profile";

export interface AlertItem {
  key: string;
  kind: AlertKind;
  level: AlertLevel;
  title: string;
  text: string;
  at: string | null;
  link: AlertLink;
  unread: boolean;
}

export interface AlertsResponse {
  ok: boolean;
  unread: number;
  items: AlertItem[];
}

export interface MarkAlertSeenParams {
  keys?: string[];
}

export interface MarkAlertSeenResponse {
  ok: boolean;
  marked: number;
}
