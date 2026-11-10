export interface AvailableIntegration {
  id: string;
  name: string;
  connected: boolean;
  ready: boolean;
  contact_source?: boolean;
  status?: string;
  error?: string;
  account_email?: string;
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
  email?: string;
  spreadsheet_id?: string;
  spreadsheet_url?: string;
}

export interface GoogleSheetsSheet {
  title: string;
  rows: number;
  columns: number;
}

export interface GoogleSheetsColumnGuess {
  phone: number;
  name: number;
  email: number;
  note: number;
}

export interface GoogleSheetsPreviewResponse {
  ok: boolean;
  sheets: GoogleSheetsSheet[];
  header: string[];
  sample: string[][];
  guess: GoogleSheetsColumnGuess;
}

export interface GoogleSheetsImportParams {
  spreadsheet_id: string;
  phone_column: number;
  sheet?: string;
  name_column?: number;
  email_column?: number;
  note_column?: number;
  has_header?: boolean;
  base_title?: string;
  consent?: "granted";
  consent_source?: string;
}

export interface GoogleSheetsImportResponse {
  ok: boolean;
  base_id: number;
  base_title: string;
  added: number;
  duplicates: number;
  invalid: number;
  total_rows: number;
}

export type CrmProvider = "keycrm" | "bitrix24";
export type CrmPushMode = "important" | "conversations" | "all";
export type CrmMode = "classic" | "simple";
export type CrmConnectionStatus = "connected" | "error";

export interface CrmOption {
  id: number;
  title: string;
}

export interface CrmIntegration {
  connected: boolean;
  provider?: CrmProvider;
  provider_name?: string;
  status?: CrmConnectionStatus;
  error?: string | null;
  account?: string;
  push?: CrmPushMode;
  mode?: CrmMode | null;
  pipeline_id?: number | null;
  source_id?: number | null;
  pipelines?: CrmOption[];
  sources?: CrmOption[];
  connected_at?: string | null;
}

export interface CrmIntegrationResponse {
  ok: boolean;
  crm: CrmIntegration;
}

export interface ConnectCrmParams {
  provider: CrmProvider;
  api_key?: string;
  webhook_url?: string;
  push?: CrmPushMode;
  pipeline_id?: number | null;
  source_id?: number | null;
}

export interface UpdateCrmParams {
  push?: CrmPushMode;
  pipeline_id?: number | null;
  source_id?: number | null;
}

export interface TestCrmResponse {
  ok: boolean;
  external_id: string;
  url: string;
}
