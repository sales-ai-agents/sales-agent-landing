export interface Contact {
  id: number;
  account_id: number;
  name: string;
  phone: string;
  email: string;
  note: string;
  created_at: string;
}

export interface ContactsResponse {
  ok: boolean;
  contacts: Contact[];
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

export interface UploadContactsResponse {
  ok: boolean;
  added: number;
  duplicates: number;
}
