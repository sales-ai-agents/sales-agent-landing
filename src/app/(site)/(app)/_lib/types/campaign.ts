export type CampaignStatus = "running" | "paused" | "stopped";
export type CampaignAction = "pause" | "resume" | "stop";

export interface Campaign {
  id: number;
  account_id: number;
  agent_id: number;
  name: string;
  status: CampaignStatus;
  total: number;
  done: number;
  created_at: string;
  finished_at: string | null;
}

export interface CampaignsResponse {
  ok: boolean;
  campaigns: Campaign[];
}

export interface StartCampaignParams {
  agent_id: number;
  name?: string;
}

export interface StartCampaignResponse {
  ok: boolean;
  id: number;
  targets: number;
}

export interface ControlCampaignParams {
  campaign_id: number;
  action: CampaignAction;
}
