export interface AvailableIntegration {
  id: string;
  name: string;
  connected: boolean;
  ready: boolean;
}

export interface IntegrationsResponse {
  ok: boolean;
  webhooks: object[];
  api_keys: object[];
  available: AvailableIntegration[];
}
