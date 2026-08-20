/** Known call outcomes. The API may return additional values. */
export type CallOutcome =
  "meeting" | "не_відповів" | "не_цікаво" | "відмова" | "передзвонити" | (string & {});

export interface CallLog {
  id: string;
  phone: string;
  company_name: string;
  niche: string;
  outcome: CallOutcome | null;
  analysis_text: string | null;
  meeting_scheduled: boolean;
  created_at: string;
  ended_at: string | null;
  agent_id: number | null;
  turn_count: number;
  duration_sec: number | null;
}

export interface TranscriptMessage {
  role: "assistant" | "user";
  content: string;
}

export interface CallDetail extends CallLog {
  transcript: TranscriptMessage[];
}

export interface CallsResponse {
  ok: boolean;
  calls: CallLog[];
  total: number;
  limit: number;
  offset: number;
}

export interface CallDetailResponse {
  ok: boolean;
  call: CallDetail;
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
