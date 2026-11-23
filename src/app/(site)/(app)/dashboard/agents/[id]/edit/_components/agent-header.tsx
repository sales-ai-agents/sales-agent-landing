import { AgentIdentity } from "@/app/(site)/(app)/dashboard/agents/_components/agent-identity";

interface AgentHeaderProps {
  name: string;
  id: number | string;
  isActive: boolean;
}

export const AgentHeader = ({ name, id, isActive }: AgentHeaderProps) => (
  <AgentIdentity name={name} id={id} isActive={isActive} />
);
