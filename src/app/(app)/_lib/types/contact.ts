export type ConsentStatus = "" | "granted" | "pending";

export interface Contact {
  id: number;
  account_id: number;
  name: string;
  phone: string;
  email: string;
  note: string;
  created_at: string;
  tags: string[];
  consent: ConsentStatus;
  do_not_call: boolean;
  last_call_at: string | null;
  last_call_result: string | null;
}

export interface ContactsStats {
  total_contacts: number;
  processed_this_month: number;
  converted_this_month: number;
  conversion_pct: number | null;
}

export interface ContactsResponse {
  ok: boolean;
  contacts: Contact[];
  total: number;
  stats: ContactsStats;
}

export interface CreateContactParams {
  phone: string;
  name?: string;
  email?: string;
}

export interface CreateContactResponse {
  ok: boolean;
  id: number | null;
}

export interface UpdateContactParams {
  name?: string;
  email?: string;
  note?: string;
  tags?: string[];
  consent?: ConsentStatus;
  do_not_call?: boolean;
}

export interface UploadContactsResponse {
  ok: boolean;
  added: number;
  duplicates: number;
}
