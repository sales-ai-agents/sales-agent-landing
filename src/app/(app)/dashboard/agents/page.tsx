"use client";

import Link from "next/link";
import { Bot, Plus, Play, Pause, Edit, PhoneCall } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAgents, useToggleAgentStatus } from "@/hooks/use-agents";
import type { Agent, AgentStatus } from "@/types";

export default function AgentsPage() {
  const { data: agents = [] } = useAgents();
  const toggleStatus = useToggleAgentStatus();

  function handleToggle(agent: Agent): void {
    const newStatus: AgentStatus = agent.status === "active" ? "paused" : "active";
    toggleStatus.mutate({ id: agent.id, status: newStatus });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agents</h1>
          <p className="text-muted-foreground">Manage your AI voice agents</p>
        </div>
        <Link href="/dashboard/agents/create" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Create Agent
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent: Agent) => (
          <AgentCard key={agent.id} agent={agent} onToggle={() => handleToggle(agent)} />
        ))}
      </div>
    </div>
  );
}

interface AgentCardProps {
  agent: Agent;
  onToggle: () => void;
}

function AgentCard({ agent, onToggle }: AgentCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-lg p-2">
              <Bot className="text-primary h-4 w-4" />
            </div>
            <CardTitle className="text-base">{agent.name}</CardTitle>
          </div>
          <Badge variant={agent.status === "active" ? "success" : "warning"}>
            {agent.status === "active" ? "Active" : "Paused"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground text-xs">Total Calls</p>
            <p className="text-lg font-semibold">{agent.totalCalls}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Success Rate</p>
            <p className="text-lg font-semibold">{agent.successRate}%</p>
          </div>
        </div>
        <p className="text-muted-foreground mb-4 text-xs">Last active: {agent.lastActive}</p>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/agents/${agent.id}/edit`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Link>
          <Button variant="outline" size="sm">
            <PhoneCall className="mr-1 h-3 w-3" />
            Test
          </Button>
          <Button variant="outline" size="sm" onClick={onToggle}>
            {agent.status === "active" ? (
              <>
                <Pause className="mr-1 h-3 w-3" /> Pause
              </>
            ) : (
              <>
                <Play className="mr-1 h-3 w-3" /> Start
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
