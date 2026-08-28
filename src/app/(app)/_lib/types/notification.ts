export type NotificationKind = "escalation" | "limit_exhausted";

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
