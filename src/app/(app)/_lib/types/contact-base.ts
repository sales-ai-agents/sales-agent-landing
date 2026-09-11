export type ContactBaseSource = "all" | "manual" | "csv" | "google_sheets";

export interface ContactBase {
  id: number;
  title: string;
  source: ContactBaseSource;
  contacts: number;
  created_at?: string;
}

export interface ContactBasesResponse {
  ok: boolean;
  bases: ContactBase[];
}
