export interface LeadFormParams {
  name: string;
  phone: string;
  niche?: string;
  contact?: string;
  email?: string;
  telegram?: string;
  company?: string;
  message?: string;
  source_page?: string;
}

export interface LeadFormResult {
  id: number;
}
