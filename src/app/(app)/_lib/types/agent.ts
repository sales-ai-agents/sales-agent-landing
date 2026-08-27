export interface AgentStats {
  total_calls: number;
  meetings: number;
  efficiency_pct: number | null;
  minutes_used: number;
  minutes_share_pct: number | null;
  talk_minutes_saved: number;
}

export interface Agent {
  id: number;
  account_id: number;
  name: string;
  voice: string;
  instructions: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  stats?: AgentStats;
}

export interface AgentsResponse {
  ok: boolean;
  agents: Agent[];
}

export interface CreateAgentParams {
  name: string;
  voice?: string;
  instructions?: string;
}

export interface CreateAgentResponse {
  ok: boolean;
  id: number;
}

export interface UpdateAgentParams {
  name?: string;
  voice?: string;
  instructions?: string;
  is_active?: boolean;
}

export interface UpdateAgentResponse {
  ok: boolean;
  agent: Agent;
}

export interface TestCallParams {
  phone: string;
  agent_id?: number;
  name?: string;
  voice?: string;
  instructions?: string;
}

export interface Voice {
  key: string;
  name: string;
  gender: "male" | "female";
  lang: string;
  label: string;
}

export interface VoicesResponse {
  ok: boolean;
  voices: Voice[];
}
