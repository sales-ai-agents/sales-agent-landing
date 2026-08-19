"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, Plus, PhoneCall } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PageError } from "@/components/dashboard/page-states";
import { CardGridSkeleton } from "@/components/dashboard/skeletons";
import { useAgents, useToggleAgentStatus, useTestCall } from "@dashboard/hooks/use-agents";
import { ApiError } from "@/lib/api-client";
import { resolveErrorMessage, AGENT_ERROR_MESSAGES } from "@/lib/error-messages";
import { AgentCard } from "./_components/agent-card";
import type { Agent } from "@dashboard/types";

export default function AgentsPage() {
  const { data: agents = [], isLoading, error, refetch } = useAgents();
  const toggleStatus = useToggleAgentStatus();
  const testCall = useTestCall();

  const [testDialog, setTestDialog] = useState<{ agentId: number; agentName: string } | null>(null);
  const [testPhone, setTestPhone] = useState("");

  function handleToggle(agent: Agent): void {
    const newStatus = agent.is_active ? "paused" : "active";
    toggleStatus.mutate(
      { id: agent.id, status: newStatus },
      {
        onSuccess: (_data, variables) => {
          const label = variables.status === "active" ? "активовано" : "призупинено";
          toast.success(`Агента ${label}`);
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            toast.error(resolveErrorMessage(error.code, AGENT_ERROR_MESSAGES));
          } else {
            toast.error("Щось пішло не так.");
          }
        },
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
        onError: (error) => {
          if (error instanceof ApiError) {
            toast.error(resolveErrorMessage(error.code, AGENT_ERROR_MESSAGES));
          } else {
            toast.error("Щось пішло не так.");
          }
        },
      }
    );
  }

  if (isLoading) return <CardGridSkeleton />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Агенти</h1>
          <p className="text-muted-foreground">Керуйте своїми AI голосовими агентами</p>
        </div>
        <Link href="/dashboard/agents/create" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Створити агента
        </Link>
      </div>

      {agents.length === 0 ? (
        <Card className="border-border shadow-primary/30 rounded-2xl p-12 text-center shadow-lg">
          <Bot className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h2 className="text-lg font-semibold">Агентів ще немає</h2>
          <p className="text-muted-foreground mt-1">
            Створіть свого першого AI голосового агента, щоб почати.
          </p>
          <Link href="/dashboard/agents/create" className={buttonVariants({ className: "mt-4" })}>
            <Plus className="mr-2 h-4 w-4" />
            Створити агента
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent: Agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onToggle={() => handleToggle(agent)}
              onTest={() => setTestDialog({ agentId: agent.id, agentName: agent.name })}
            />
          ))}
        </div>
      )}

      <Dialog open={!!testDialog} onOpenChange={() => setTestDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Тестовий дзвінок — {testDialog?.agentName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
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
