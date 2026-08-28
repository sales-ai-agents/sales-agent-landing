export interface Webhook {
  id: number;
  url: string;
  is_active: boolean;
  created_at: string;
  failed: number;
  last_delivered_at: string | null;
}

export interface WebhooksResponse {
  ok: boolean;
  webhooks: Webhook[];
}

export interface CreateWebhookParams {
  url: string;
}

export interface CreateWebhookResponse {
  ok: boolean;
  id: number;
  url: string;
  secret: string;
}

export interface UpdateWebhookParams {
  url?: string;
  is_active?: boolean;
}

export interface TestWebhookResponse {
  ok: boolean;
  response_code: number | null;
  error?: string;
}

export interface ReissueSecretResponse {
  ok: boolean;
  secret: string;
}

export type DeliveryStatus = "pending" | "delivered" | "failed" | "cancelled";

export interface WebhookDelivery {
  id: number;
  webhook_id: number;
  event: string;
  call_id: string | null;
  status: DeliveryStatus;
  attempts: number;
  response_code: number | null;
  error: string | null;
  created_at: string;
  delivered_at: string | null;
}

export interface WebhookDeliveriesResponse {
  ok: boolean;
  deliveries: WebhookDelivery[];
}
