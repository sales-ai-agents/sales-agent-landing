"use client";

import { useState } from "react";
import { PhoneCall } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PageError, PageLoading } from "@/components/dashboard/page-states";
import { useAgents, useToggleAgentStatus, useTestCall } from "@dashboard/hooks/use-agents";
import { AGENT_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/handle-mutation-error";
import { AgentCard } from "./_components/agent-card";
import { AgentsEmptyState } from "./_components/agents-empty-state";
import { AddAgentCard } from "./_components/add-agent-card";
import type { Agent } from "@dashboard/types";

export default function AgentsPage() {
  const { data: agents = [], isLoading, error, refetch } = useAgents({ stats: true });
  const toggleStatus = useToggleAgentStatus();
  const testCall = useTestCall();

  const [testDialog, setTestDialog] = useState<{
    agentId: number;
    agentName: string;
  } | null>(null);
  const [testPhone, setTestPhone] = useState("");

  function handleToggle(agent: Agent): void {
    const newActive = !agent.is_active;
    toggleStatus.mutate(
      { id: agent.id, is_active: newActive },
      {
        onSuccess: (_data, variables) => {
          const label = variables.is_active ? "активовано" : "призупинено";
          toast.success(`Агента ${label}`);
        },
        onError: (err) => handleMutationError(err, AGENT_ERROR_MESSAGES),
      }
    );
  }

  function handleTestCall(): void {
    if (!testDialog || !testPhone) return;
    testCall.mutate(
      { agent_id: testDialog.agentId, phone: testPhone },
      {
        onSuccess: () => {
          toast.success("Дзвінок ініційовано — очікуйте виклик");
          setTestDialog(null);
          setTestPhone("");
        },
        onError: (err) => handleMutationError(err, AGENT_ERROR_MESSAGES),
      }
    );
  }

  if (isLoading) return <PageLoading />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Агенти</h1>
        <p className="text-muted-foreground text-sm">Керуйте вашими голосовими ШІ-агентами</p>
      </div>

      {agents.length === 0 ? (
        <AgentsEmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {agents.map((agent: Agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onToggle={() => handleToggle(agent)}
              onTest={() => setTestDialog({ agentId: agent.id, agentName: agent.name })}
            />
          ))}
          <AddAgentCard />
        </div>
      )}

      <Dialog open={!!testDialog} onOpenChange={() => setTestDialog(null)}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>Тестовий дзвінок — {testDialog?.agentName}</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Дзвінок надійде на ваш номер — клієнтам ми не телефонуватимемо
          </p>
          <div className="my-3">
            <Input
              aria-label="Номер телефону для тестового дзвінка"
              placeholder="+380 XX XXX XXXX"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestDialog(null)}>
              Скасувати
            </Button>
            <Button onClick={handleTestCall} disabled={testCall.isPending || !testPhone}>
              <PhoneCall className="mr-2 h-4 w-4" />
              {testCall.isPending ? "Дзвінок..." : "Зателефонувати"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
