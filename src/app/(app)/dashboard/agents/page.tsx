"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, Plus, PhoneCall } from "lucide-react";
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
import { ApiError } from "@/lib/api-client";
import { resolveErrorMessage, AGENT_ERROR_MESSAGES } from "@/lib/error-messages";
import { AgentCard } from "./_components/agent-card";
import type { Agent } from "@dashboard/types";

export default function AgentsPage() {
  const { data: agents = [], isLoading, error, refetch } = useAgents();
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
        onError: (err) => {
          if (err instanceof ApiError) {
            toast.error(resolveErrorMessage(err.code, AGENT_ERROR_MESSAGES));
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
        onError: (err) => {
          if (err instanceof ApiError) {
            toast.error(resolveErrorMessage(err.code, AGENT_ERROR_MESSAGES));
          } else {
            toast.error("Щось пішло не так.");
          }
        },
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
        <EmptyState />
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

function EmptyState() {
  return (
    <div className="border-border bg-background rounded-2xl border p-12 text-center">
      <div className="border-primary/30 bg-primary/5 mx-auto flex h-14 w-14 items-center justify-center rounded-xl border">
        <Bot className="text-primary h-7 w-7" />
      </div>
      <h2 className="mt-4 text-lg font-bold">Агентів ще немає</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Створіть свого першого AI голосового агента, щоб почати
      </p>
      <Link href="/dashboard/agents/create">
        <Button className="mt-4">
          <Plus className="mr-2 h-4 w-4" />
          Створити агента
        </Button>
      </Link>
    </div>
  );
}

function AddAgentCard() {
  return (
    <div className="border-border bg-background flex flex-col items-center justify-center rounded-2xl border p-8 text-center">
      <div className="bg-muted bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
        <Plus className="text-primary h-6 w-6" />
      </div>
      <h3 className="mt-3 text-sm font-semibold">Додати нового агента</h3>
      <p className="text-muted-foreground mt-1 text-xs">
        Створіть нового ШІ-агента та налаштуйте його за кілька хвилин
      </p>
      <Link href="/dashboard/agents/create">
        <Button className="mt-4" size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Створити агента
        </Button>
      </Link>
    </div>
  );
}
