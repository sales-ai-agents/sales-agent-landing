// ===========================
// Domain Types — VoiceAgent
// ===========================

// --- Agent ---
export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  voice: string;
  instructions: string;
  totalCalls: number;
  successRate: number;
  lastActive: string;
  createdAt: string;
}

export type AgentStatus = "active" | "paused";

// --- Contact ---
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  dateAdded: string;
}

// --- Call Log ---
export interface CallLog {
  id: string;
  customerName: string;
  phone: string;
  status: CallStatus;
  summary: string;
  duration: string;
  date: string;
  time: string;
  agentName: string;
  crmSynced: boolean;
}

export type CallStatus = "completed" | "missed" | "transferred" | "failed";

// --- User ---
export interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  createdAt: string;
}
