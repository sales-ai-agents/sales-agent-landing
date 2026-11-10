export type CallResultType =
  | "booking"
  | "payment"
  | "callback"
  | "request"
  | "refusal"
  | "do_not_call"
  | "needs_attention"
  | "not_reached";

export interface CallResultField {
  key: string;
  label: string;
  value: string;
}

export interface CallResult {
  version: number;
  type: CallResultType;
  title: string;
  action_required: boolean;
  unconfirmed?: boolean;
  summary?: string;
  next_step?: string;
  fields: CallResultField[];
}

export interface CallResultItem {
  call_id: string;
  created_at: string;
  ended_at: string;
  phone: string;
  agent_id: number | null;
  agent_name: string;
  seen: boolean;
  result: CallResult;
}

export interface CallResultsFilter {
  limit?: number;
  offset?: number;
  unseen?: boolean;
}

export interface CallResultsResponse {
  ok: boolean;
  total: number;
  limit: number;
  offset: number;
  unseen: number;
  unseen_important: number;
  items: CallResultItem[];
}

export interface MarkResultsSeenParams {
  call_ids?: string[];
  all?: boolean;
}

export interface MarkResultsSeenResponse {
  ok: boolean;
  marked: number;
  unseen: number;
  unseen_important: number;
}
