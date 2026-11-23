"use client";

import { useState, useCallback } from "react";
import { Bot, Loader2, Plus, PhoneCall } from "lucide-react";
import { toast } from "sonner";

import Link from "next/link";

import {
  Button,
  buttonVariants,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui";
import { FilterSelect, PageEmpty, PageError, PageHead, PageLoading } from "@/components/dashboard";
import { useAgents, useToggleAgentStatus, useTestCall } from "@dashboard/hooks";
import { AGENT_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { AgentCard } from "./_components/agent-card";
import { CampaignsSection } from "./_components/campaigns/campaigns-section";
import { StartCampaignDialog } from "./_components/campaigns/start-campaign-dialog";
import { PhoneField } from "./_components/connect-number/phone-field";
import { isValidUaPhone, normalizeUaPhone } from "./_components/connect-number/constants";
import type { Agent } from "@dashboard/types";

const DEFAULT_PERIOD_DAYS = 7;
const PERIOD_OPTIONS = [
  { value: 7, label: "7 днів" },
  { value: 30, label: "30 днів" },
  { value: 90, label: "90 днів" },
];

const STATUS_OPTIONS = [
  { value: 1, label: "Активні" },
  { value: 2, label: "Неактивні" },
];
const TYPE_OPTIONS = [
  { value: 1, label: "Вхідні" },
  { value: 2, label: "Вихідні" },
];
const SORT_OPTIONS = [
  { value: 1, label: "Дзвінки" },
  { value: 2, label: "Назва" },
];
const SORT_BY_EFFICIENCY = 0;
const SORT_BY_CALLS = 1;
const STATUS_ACTIVE = 1;
const TYPE_INBOUND = 1;

const applyFilters = (agents: Agent[], status: number, type: number, sort: number): Agent[] => {
  const filtered = agents.filter((agent) => {
    if (status && agent.is_active !== (status === STATUS_ACTIVE)) return false;
    if (type && agent.call_direction !== (type === TYPE_INBOUND ? "inbound" : "outbound")) {
      return false;
    }
    return true;
  });
  return [...filtered].sort((a, b) => {
    if (sort === SORT_BY_EFFICIENCY) {
      return (b.stats?.efficiency_pct ?? -1) - (a.stats?.efficiency_pct ?? -1);
    }
    if (sort === SORT_BY_CALLS) return (b.stats?.total_calls ?? 0) - (a.stats?.total_calls ?? 0);
    return a.name.localeCompare(b.name, "uk");
  });
};

const AgentsPage = () => {
  const [days, setDays] = useState(DEFAULT_PERIOD_DAYS);
  const [statusFilter, setStatusFilter] = useState(0);
  const [typeFilter, setTypeFilter] = useState(0);
  const [sort, setSort] = useState(SORT_BY_EFFICIENCY);
  const { data: agents = [], isLoading, error, refetch } = useAgents({ stats: true, days });

  const toggleStatus = useToggleAgentStatus();
  const testCall = useTestCall();

  const [campaignAgent, setCampaignAgent] = useState<Agent | null>(null);
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
  const visibleAgents = applyFilters(agents, statusFilter, typeFilter, sort);

  if (agents.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHead
          word="агенти"
          title="Агенти"
          description="Керуйте вашими голосовими ШІ-агентами"
          tone="b"
        />
        <PageEmpty
          icon={Bot}
          title="Агентів ще немає"
          description={<p>Створіть свого першого AI голосового агента, щоб почати</p>}
          action={
            <Link className={buttonVariants()} href="/dashboard/agents/create">
              <Plus aria-hidden="true" />
              Створити агента
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHead
        word="агенти"
        title="Агенти"
        description="Керуйте вашими голосовими ШІ-агентами"
        tone="b"
      />
      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect
          label="Статус"
          allLabel="Усі статуси"
          value={statusFilter}
          options={STATUS_OPTIONS}
          onChange={setStatusFilter}
        />
        <FilterSelect
          label="Тип"
          allLabel="Усі типи"
          value={typeFilter}
          options={TYPE_OPTIONS}
          onChange={setTypeFilter}
        />
        <FilterSelect
          label="Сортування"
          allLabel="Ефективність"
          value={sort}
          options={SORT_OPTIONS}
          onChange={setSort}
        />
        <FilterSelect
          label="Період статистики"
          value={days}
          options={PERIOD_OPTIONS}
          onChange={setDays}
        />
      </div>
      <CampaignsSection />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleAgents.map((agent: Agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onToggle={() => handleToggle(agent)}
            onTest={() => setTestDialog({ agentId: agent.id, agentName: agent.name })}
            onStartCampaign={() => setCampaignAgent(agent)}
          />
        ))}
        <Link
          className="border-border bg-card/50 hover:border-primary/50 hover:bg-primary/5 flex min-h-64 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-6 text-center transition-colors"
          href="/dashboard/agents/create"
        >
          <span className="bg-primary/10 text-primary grid size-12 place-items-center rounded-full">
            <Plus className="size-5" aria-hidden="true" />
          </span>
          <b className="font-heading text-xl">Створити агента</b>
          <span className="text-muted-foreground max-w-xs text-sm">
            Оберіть голос і сценарій, і новий агент почне дзвонити
          </span>
        </Link>
      </div>
      <p className="text-muted-foreground text-sm">
        Показано 1-{visibleAgents.length} з {agents.length} агентів
      </p>
      <StartCampaignDialog agent={campaignAgent} onClose={() => setCampaignAgent(null)} />

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
