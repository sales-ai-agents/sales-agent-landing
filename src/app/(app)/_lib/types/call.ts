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
  manager_note: string | null;
  manager_note_at: string | null;
}

export type CallStatusFilter = "success" | "failed" | "attention";

export interface CallsFilter {
  limit?: number;
  offset?: number;
  date_from?: string;
  date_to?: string;
  status?: CallStatusFilter;
  agent_id?: number;
  phone?: string;
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
  meetings: number;
}

export interface PeriodStats {
  total_calls: number;
  successful_calls: number;
  missed_calls: number;
  talk_minutes_saved: number;
}

export interface DeltaPct {
  total_calls: number | null;
  successful_calls: number | null;
  missed_calls: number | null;
  talk_minutes_saved: number | null;
}

export interface StatsResponse {
  ok: boolean;
  minutes_used: number;
  minutes_limit: number;
  minutes_left: number;
  plan: string;
  plan_expires_at: string | null;
  total_calls: number;
  successful_calls: number;
  missed_calls: number;
  talk_minutes_saved: number;
  period_days: number;
  period: PeriodStats;
  previous: PeriodStats;
  delta_pct: DeltaPct;
  by_day: DayStats[];
}
