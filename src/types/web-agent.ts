export type RoomStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

export interface WebAgentSession {
  room: string;
  token: string;
  url: string;
  identity: string;
}

export interface StartWebAgentParams {
  instruction: string;
  voice: string;
  agent_name: string;
  preset?: string;
}

export interface UseLiveKitRoomOptions {
  wsUrl: string | null;
  token: string | null;
}

export interface UseLiveKitRoomResult {
  status: RoomStatus;
  errorMessage: string | null;
  disconnect: () => void;
}
