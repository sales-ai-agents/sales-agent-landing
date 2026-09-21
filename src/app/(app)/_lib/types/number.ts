export type NumberSource = "sip" | "forward" | "assigned";
export type NumberDirection = "inbound" | "outbound" | "both";
export type NumberStatus = "disabled" | "verification_required" | "ready";
export type NumberKind = "city" | "mobile" | "tollfree";

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

export interface NumberPool {
  available: number;
  available_by_kind: Record<string, number>;
}

export interface NumberPoolResponse extends NumberPool {
  ok: boolean;
}

export interface ClaimNumberParams {
  kind?: NumberKind;
  agent_id?: number;
  direction?: NumberDirection;
}

export interface ClaimNumberResponse {
  ok: boolean;
  id: number;
  phone: string;
  kind: string;
  status: "ready";
  trunk_synced: boolean | null;
}

export interface ConnectNumberParams {
  source: NumberSource;
  phone?: string;
  kind?: NumberKind;
  agent_id?: number;
  direction?: NumberDirection;
  provider?: string;
  note?: string;
}

export interface ConnectNumberResponse {
  ok: boolean;
  id: number;
}

export interface ProvisionSipTrunkParams {
  number_id: number;
}

export interface SipTrunkCredentials {
  ok: boolean;
  number_id: number;
  phone: string;
  sip_uri: string;
  sip_host: string;
  username: string;
  password: string;
  password_shown_once: boolean;
}

export interface SipAddress {
  number_id: number;
  phone: string;
  sip_uri: string;
  verified: boolean;
}

export interface SipAddressesResponse {
  ok: boolean;
  host: string;
  addresses: SipAddress[];
}

export interface VerifySipParams {
  phone: string;
}

export interface VerifySipResponse {
  ok: boolean;
  verified: boolean;
  reason?: string;
  hint?: string;
  last_call_at?: string;
}

export interface UpdateNumberParams {
  agent_id?: number;
  direction?: NumberDirection;
  is_active?: boolean;
  note?: string;
  hour_from?: number;
  hour_to?: number;
  daily_cap?: number;
  working_days?: string | string[];
}
