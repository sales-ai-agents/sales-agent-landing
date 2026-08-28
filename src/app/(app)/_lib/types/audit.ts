export interface AuditEvent {
  id: number;
  actor: string;
  action: string;
  details: string;
  created_at: string;
}

export interface AuditResponse {
  ok: boolean;
  total: number;
  events: AuditEvent[];
}
