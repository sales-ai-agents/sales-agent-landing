"use client";

import { useState, useCallback } from "react";
import { Bot, Loader2, PhoneCall, Plus } from "lucide-react";
import { toast } from "sonner";

import Link from "next/link";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui";
import { PageEmpty, PageError, PageLoading } from "@/components/dashboard";
import { useAgents, useToggleAgentStatus, useTestCall } from "@dashboard/hooks";
import { AGENT_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { AgentCard } from "./_components/agent-card";
import { PhoneField } from "./_components/connect-number/phone-field";
import { isValidUaPhone, normalizeUaPhone } from "./_components/connect-number/constants";
import type { Agent } from "@dashboard/types";

const AgentsPage = () => {
  const { data: agents = [], isLoading, error, refetch } = useAgents({ stats: true });

  const toggleStatus = useToggleAgentStatus();
  const testCall = useTestCall();

  const [testPhone, setTestPhone] = useState("");
  const [testDialog, setTestDialog] = useState<{
    agentId: number;
    agentName: string;
  } | null>(null);

  const handleToggle = useCallback(
    (agent: Agent) => {
      toggleStatus.mutate(
        { id: agent.id, is_active: !agent.is_active },
        {
          onSuccess: (_data, variables) => {
            const label = variables.is_active ? "активовано" : "призупинено";
            toast.success(`Агента ${label}`);
          },
          onError: (err) => handleMutationError(err, AGENT_ERROR_MESSAGES),
        }
      );
    },
    [toggleStatus]
  );

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      if (open || testCall.isPending) return;
      setTestDialog(null);
      setTestPhone("");
    },
    [testCall.isPending]
  );

  const handleTestCall = useCallback(() => {
    if (!testDialog || !isValidUaPhone(testPhone)) return;

    testCall.mutate(
      { agent_id: testDialog.agentId, phone: normalizeUaPhone(testPhone) },
      {
        onSuccess: () => {
          toast.success("Дзвінок ініційовано — очікуйте виклик");
          setTestDialog(null);
          setTestPhone("");
        },
        onError: (err) => handleMutationError(err, AGENT_ERROR_MESSAGES),
      }
    );
  }, [testDialog, testPhone, testCall]);

  if (isLoading) return <PageLoading message="Завантажуємо агентів..." />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;
  if (agents.length === 0)
    return (
      <PageEmpty
        icon={Bot}
        title="Агентів ще немає"
        description={
          <>
            <p className="text-muted-foreground mt-1 text-lg">
              Створіть свого першого AI голосового агента, щоб почати
            </p>
            <Link href="/dashboard/agents/create">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Створити агента
              </Button>
            </Link>
          </>
        }
      />
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Агенти</h1>
        <p className="text-muted-foreground text-sm">Керуйте вашими голосовими ШІ-агентами</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {agents.map((agent: Agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onToggle={() => handleToggle(agent)}
            onTest={() => setTestDialog({ agentId: agent.id, agentName: agent.name })}
          />
        ))}

        <div className="border-border bg-background flex flex-col items-center justify-center rounded-2xl border p-8 text-center">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
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
      </div>

      <p className="text-muted-foreground text-center text-sm">
        Показано 1-{agents.length} з {agents.length} агентів
      </p>

      <Dialog
        open={!!testDialog}
        onOpenChange={handleDialogOpenChange}
        disablePointerDismissal={testCall.isPending}
      >
        <DialogContent showCloseButton={!testCall.isPending}>
          <DialogHeader>
            <DialogTitle>Тестовий дзвінок — {testDialog?.agentName}</DialogTitle>
          </DialogHeader>

          {testCall.isPending ? (
            <div
              className="flex flex-col items-center justify-center gap-3 py-10 text-center"
              aria-live="polite"
              aria-busy="true"
            >
              <Loader2 className="text-primary h-8 w-8 animate-spin" aria-hidden="true" />
              <p className="text-sm font-medium">Ініціюємо дзвінок...</p>
              <p className="text-muted-foreground text-sm">Зачекайте, це займе кілька секунд</p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground text-sm">
                Дзвінок надійде на ваш номер — клієнтам ми не телефонуватимемо
              </p>
              <div className="my-3">
                <PhoneField
                  id="test-call-phone"
                  label="Номер телефону для тестового дзвінка"
                  value={testPhone}
                  onChange={setTestPhone}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setTestDialog(null)}>
                  Скасувати
                </Button>
                <Button onClick={handleTestCall} disabled={!isValidUaPhone(testPhone)}>
                  <PhoneCall className="mr-2 h-4 w-4" />
                  Зателефонувати
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentsPage;
