export interface Agent {
  id: number;
  account_id: number;
  name: string;
  voice: string;
  instructions: string;
  is_active: number;
  created_at: string;
  updated_at: string;
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

export interface UpdateAgentParams {
  name: string;
  voice?: string;
  instructions?: string;
}

export interface TestCallParams {
  agent_id: number;
  phone: string;
}
