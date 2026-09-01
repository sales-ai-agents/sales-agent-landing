export interface AvailableIntegration {
  id: string;
  name: string;
  connected: boolean;
  ready: boolean;
  status?: string;
  error?: string;
  account_email?: string;
  email?: string;
  spreadsheet_id?: string;
  spreadsheet_url?: string;
}

export interface IntegrationsResponse {
  ok: boolean;
  webhooks: object[];
  api_keys: object[];
  available: AvailableIntegration[];
}

export interface GoogleSheetsAuthUrlResponse {
  ok: boolean;
  url: string;
}

export interface GoogleSheetsConnectResponse {
  ok: boolean;
  account_email?: string;
  email?: string;
  spreadsheet_id?: string;
  spreadsheet_url?: string;
}
