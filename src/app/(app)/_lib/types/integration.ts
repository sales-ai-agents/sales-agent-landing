export interface AvailableIntegration {
  id: string;
  name: string;
  connected: boolean;
  ready: boolean;
  contact_source?: boolean;
  requires_picker?: boolean;
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
