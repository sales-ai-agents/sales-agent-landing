export type CampaignStatus = "active" | "paused" | "stopped" | "completed";

export type CampaignAction = "pause" | "resume" | "stop";

export interface Campaign {
  id: string;
  name: string;
  agent_id: string;
  status: CampaignStatus;
  total: number;
  done: number;
  createdAt: string;
}

export interface CampaignsResponse {
  campaigns: Campaign[];
}

export interface CreateCampaignParams {
  agent_id: string;
  name?: string;
  contact_ids?: string[];
}

export interface ControlCampaignParams {
  campaign_id: string;
  action: CampaignAction;
}
