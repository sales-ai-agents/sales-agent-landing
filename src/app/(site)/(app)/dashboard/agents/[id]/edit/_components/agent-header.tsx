import { AgentIdentity } from "@/app/(site)/(app)/dashboard/agents/_components/agent-identity";

interface AgentHeaderProps {
  name: string;
  id: number | string;
  isActive: boolean;
  revision: number;
}

export const AgentHeader = ({ name, id, isActive, revision }: AgentHeaderProps) => (
  <AgentIdentity name={name} id={id} isActive={isActive} revision={revision} />
);
