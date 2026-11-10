export type VerificationLevel = "unverified" | "pending" | "verified" | "trusted";

export interface Verification {
  level: VerificationLevel;
  legal_name: string;
  legal_code: string;
  note: string;
  can_run_campaigns: boolean;
  daily_outbound_limit: number;
}

export interface VerificationResponse {
  ok: boolean;
  verification: Verification;
}

export interface SubmitVerificationParams {
  legal_name: string;
  legal_code: string;
}
