"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, Plus, Play, Pause, Edit, PhoneCall } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAgents, useToggleAgentStatus, useTestCall } from "@/hooks/use-agents";
import type { Agent } from "@/types";

export default function AgentsPage() {
  const { data: agents = [], isLoading } = useAgents();
  const toggleStatus = useToggleAgentStatus();
  const testCall = useTestCall();

  const [testDialog, setTestDialog] = useState<{ agentId: number; agentName: string } | null>(null);
  const [testPhone, setTestPhone] = useState("");

  function handleToggle(agent: Agent): void {
    const newStatus = agent.is_active ? "paused" : "active";
    toggleStatus.mutate({ id: agent.id, status: newStatus });
  }

  function handleTestCall(): void {
    if (!testDialog || !testPhone) return;
    testCall.mutate(
      { agent_id: testDialog.agentId, phone: testPhone },
      {
        onSuccess: () => {
          setTestDialog(null);
          setTestPhone("");
        },
      }
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

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

interface AgentCardProps {
  agent: Agent;
  onToggle: () => void;
  onTest: () => void;
}

function AgentCard({ agent, onToggle, onTest }: AgentCardProps) {
  const isActive = !!agent.is_active;

  return (
    <Card className="border-border shadow-primary/30 rounded-2xl shadow-lg transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-lg p-2">
              <Bot className="text-primary h-4 w-4" />
            </div>
            <CardTitle className="text-base">{agent.name}</CardTitle>
          </div>
          <Badge variant={isActive ? "success" : "warning"}>
            {isActive ? "Активний" : "Призупинено"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-muted-foreground text-xs">Голос</p>
          <p className="text-sm font-medium">{agent.voice}</p>
        </div>
        <p className="text-muted-foreground mb-4 text-xs">
          Створено: {new Date(agent.created_at).toLocaleDateString("uk-UA")}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/dashboard/agents/${agent.id}/edit`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Edit className="mr-1 h-3 w-3" />
            Змінити
          </Link>
          <Button variant="outline" size="sm" onClick={onTest}>
            <PhoneCall className="mr-1 h-3 w-3" />
            Тест
          </Button>
          <Button variant="outline" size="sm" onClick={onToggle}>
            {isActive ? (
              <>
                <Pause className="mr-1 h-3 w-3" /> Пауза
              </>
            ) : (
              <>
                <Play className="mr-1 h-3 w-3" /> Запуск
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
