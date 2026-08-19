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
  total: number;
}

export interface CreateContactParams {
  phone: string;
  name?: string;
  email?: string;
  note?: string;
}
