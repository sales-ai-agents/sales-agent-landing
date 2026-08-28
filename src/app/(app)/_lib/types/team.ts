export type TeamRole = "owner" | "admin" | "viewer";

export type MemberStatus = "active" | "invited";

export interface TeamMember {
  id: number;
  email: string;
  name: string;
  role: TeamRole;
  status: MemberStatus;
}

export interface TeamResponse {
  ok: boolean;
  members: TeamMember[];
}

export interface InviteTeamMemberParams {
  email: string;
  name?: string;
  role?: "admin" | "viewer";
}

export interface InviteTeamMemberResponse {
  ok: boolean;
  id: number;
  email: string;
  role: string;
}

export interface UpdateTeamMemberRoleParams {
  role: "admin" | "viewer";
}
