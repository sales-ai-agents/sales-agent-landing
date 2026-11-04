export interface Preset {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly prompt: string;
}

export interface PresetsResponse {
  readonly ok: boolean;
  readonly presets: Preset[];
}

export interface WebAgentSession {
  readonly room: string;
  readonly token: string;
  readonly url: string;
  readonly identity: string;
}

export interface StartWebAgentParams {
  readonly instruction: string;
  readonly voice: string;
  readonly agent_name: string;
  readonly preset?: string;
}

export interface LeadParams {
  readonly name: string;
  readonly phone: string;
  readonly niche?: string;
  readonly contact?: string;
  readonly source_page?: string;
}

export interface FeedbackParams {
  readonly message: string;
  readonly email: string;
  readonly marketingConsent: boolean;
  readonly source_page?: string;
}

export type RoomStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";
