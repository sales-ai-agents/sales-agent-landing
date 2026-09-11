export type NumberSource = "sip" | "forward" | "assigned";
export type NumberDirection = "inbound" | "outbound" | "both";
export type NumberStatus = "disabled" | "verification_required" | "ready";

export interface AgentNumber {
  id: number;
  phone: string;
  agent_id: number;
  agent_name: string | null;
  source: NumberSource;
  direction: NumberDirection;
  provider: string;
  is_active: boolean;
  note: string;
  created_at: string;
  hour_from: number;
  hour_to: number;
  daily_cap: number;
  working_days: string;
  verified_at: string;
  status: NumberStatus;
  registered: boolean;
  sip_username: string;
}

export interface NumbersResponse {
  ok: boolean;
  numbers: AgentNumber[];
}
