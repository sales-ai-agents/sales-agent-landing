/** Known call outcomes. The API may return additional values. */
export type CallOutcome = "meeting" | "не_відповів" | "відмова" | "передзвонити" | (string & {});

export interface CallLog {
  id: string;
  phone: string;
  company_name: string;
  niche: string;
  outcome: CallOutcome;
  analysis_text: string;
  meeting_scheduled: number;
  created_at: string;
  ended_at: string;
  agent_id: number;
  turn_count: number;
  duration_sec: number;
}

export interface CallsResponse {
  ok: boolean;
  calls: CallLog[];
  total: number;
  limit: number;
  offset: number;
}

export interface DayStats {
  date: string;
  calls: number;
}

export interface StatsResponse {
  ok: boolean;
  total_calls: number;
  successful_calls: number;
  missed_calls: number;
  by_day: DayStats[];
}
