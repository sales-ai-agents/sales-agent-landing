"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Bot, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button, Textarea, Badge } from "@/components/ui";
import { PageLoading, PageError, AudioPlayer } from "@/components/dashboard";
import { useCallDetail, useSaveNote, useAgents, useCrmStatus, useCrmRetry } from "@dashboard/hooks";
import { handleMutationError } from "@/lib/mutation-error";
import { getOutcomeConfig } from "@/app/(app)/_lib/call-outcome";
import { formatDuration, cn } from "@/lib/utils";
import { formatTranscriptTime } from "@/app/(app)/dashboard/call-logs/_lib/utils";
import { InfoField } from "@/app/(app)/dashboard/call-logs/_components/info-field";
import type { CrmStatus, SlaState } from "@dashboard/types";

const SlaDisplay = ({
  state,
  minutesLeft,
}: {
  state: SlaState | null;
  minutesLeft: number | null;
}) => {
  if (!state) return <p className="mt-1 text-sm font-medium">—</p>;

  switch (state) {
    case "breached": {
      const overdue = minutesLeft !== null ? Math.abs(Math.round(minutesLeft)) : 0;
      return <p className="mt-1 text-sm font-medium text-red-500">⊘ Прострочено {overdue} хв</p>;
    }
    case "ok": {
      const left = minutesLeft !== null ? Math.round(minutesLeft) : 0;
      return <p className="mt-1 text-sm font-medium text-orange-500">Залишилось {left} хв</p>;
    }
    case "handled":
      return <p className="mt-1 text-sm font-medium text-green-600">Оброблено</p>;
    default:
      return <p className="mt-1 text-sm font-medium">—</p>;
  }
};

const CRM_STATE_MAP: Record<string, { label: string; color: string }> = {
  synced: { label: "Синхронізовано", color: "text-green-600" },
  pending: { label: "Очікується", color: "text-orange-500" },
  failed: { label: "Не синхронізовано", color: "text-red-500" },
  not_configured: { label: "CRM не підключено", color: "text-muted-foreground" },
};

const CrmPanel = ({ callId, crm }: { callId: string; crm: CrmStatus }) => {
  const crmRetry = useCrmRetry();
  const stateConfig = CRM_STATE_MAP[crm.state] ?? CRM_STATE_MAP.not_configured;

  const handleRetry = useCallback(() => {
    crmRetry.mutate(callId, {
      onSuccess: () => toast.success("Синхронізацію поставлено в чергу"),
      onError: (err) => handleMutationError(err),
    });
  }, [crmRetry, callId]);

  return (
    <div className="border-border bg-background rounded-2xl border p-5">
      <h3 className="mb-3 text-sm font-semibold">CRM синхронізація</h3>
      <p className={cn("text-sm font-medium", stateConfig.color)}>● {stateConfig.label}</p>
      {crm.error && <p className="text-muted-foreground mt-2 text-xs">{crm.error}</p>}
      {crm.can_retry && (
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full gap-1.5"
          onClick={handleRetry}
          disabled={crmRetry.isPending}
        >
          <RefreshCw className={cn("h-3.5 w-3.5", crmRetry.isPending && "animate-spin")} />
          Повторити синхронізацію
        </Button>
      )}
    </div>
  );
};

const CallDetailPage = () => {
  const params = useParams();
  const callId = params.id as string;

  const { data: call, isLoading, error, refetch } = useCallDetail(callId);
  const { data: agents = [] } = useAgents();
  const { data: crm } = useCrmStatus(callId);
  const saveNote = useSaveNote(callId);

  const [note, setNote] = useState("");
  const [noteLoaded, setNoteLoaded] = useState(false);

  if (call && !noteLoaded) {
    setNote(call.manager_note ?? "");
    setNoteLoaded(true);
  }

  const handleSaveNote = useCallback(() => {
    saveNote.mutate(note, {
      onSuccess: () => toast.success("Примітку збережено"),
      onError: (err) => handleMutationError(err),
    });
  }, [saveNote, note]);

  if (isLoading) return <PageLoading />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;
  if (!call) return <PageError message="Дзвінок не знайдено" />;

  const outcomeConfig = getOutcomeConfig(call.outcome);
  const duration = formatDuration(call.duration_sec);
  const createdAt = new Date(call.created_at);
  const agentName = agents.find((a) => a.id === call.agent_id)?.name ?? "—";
  const minutesUsed = call.duration_sec ? (call.duration_sec / 60).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/call-logs"
        className="text-primary inline-flex items-center gap-1 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад до дзвінків
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Деталі дзвінка</h1>
          <p className="text-muted-foreground text-sm">
            {createdAt.toLocaleDateString("uk-UA")} -{" "}
            {createdAt.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <a
          href={`/api/app/calls/${callId}/audio`}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="border-border bg-background hover:bg-muted inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors"
        >
          <Download className="h-4 w-4" />
          Завантажити аудіо
        </a>
      </div>

      <div className="border-border bg-background grid grid-cols-2 gap-3 rounded-2xl border p-5 md:grid-cols-4 lg:grid-cols-6">
        <InfoField label="Клієнт" value={call.phone} />
        <InfoField
          label="Агент"
          value={agentName}
          icon={<Bot className="text-primary h-4 w-4" />}
        />
        <div>
          <p className="text-muted-foreground text-xs">Результат дзвінка</p>
          <Badge variant={outcomeConfig.variant} className="mt-1">
            {outcomeConfig.label}
          </Badge>
        </div>
        <InfoField label="Тривалість дзвінка" value={duration} />
        <div>
          <p className="text-muted-foreground text-xs">Статус / SLA</p>
          <SlaDisplay state={call.sla_state} minutesLeft={call.sla_minutes_left} />
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Витрачено хвилин</p>
          <p className="mt-1 text-sm font-medium">{minutesUsed} хв</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <AudioPlayer src={`/api/app/calls/${callId}/audio`} />

          <div className="border-border bg-background rounded-2xl border p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Транскрипція</h2>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-3.5 w-3.5" />
                Завантажити .txt
              </Button>
            </div>
            {call.transcript?.length ? (
              <div className="space-y-4">
                {call.transcript.map((msg, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-muted-foreground shrink-0 font-mono text-xs">
                      {formatTranscriptTime(i, call.duration_sec)}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        msg.role === "assistant" ? "text-primary" : "text-green-600"
                      )}
                    >
                      {msg.role === "assistant" ? "ШІ-агент" : "Клієнт"}
                    </span>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Транскрипт відсутній</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {crm && crm.configured && <CrmPanel callId={callId} crm={crm} />}

          <div className="border-border bg-background rounded-2xl border p-5">
            <h3 className="mb-3 text-sm font-semibold">Пов&apos;язаний контакт</h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{call.phone}</p>
              <div>
                <span className="text-muted-foreground">Email</span>
                <p>—</p>
              </div>
              <div>
                <span className="text-muted-foreground">Компанія</span>
                <p>{call.company_name || "—"}</p>
              </div>
            </div>
          </div>

          <div className="border-border bg-background rounded-2xl border p-5">
            <h3 className="mb-3 text-sm font-semibold">Примітки менеджера</h3>
            <Textarea
              placeholder="Додати примітку..."
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            {call.manager_note_at && (
              <p className="text-muted-foreground mt-1 text-xs">
                Останнє оновлення: {new Date(call.manager_note_at).toLocaleString("uk-UA")}
              </p>
            )}
            <Button
              size="sm"
              className="mt-3"
              onClick={handleSaveNote}
              disabled={saveNote.isPending}
            >
              {saveNote.isPending ? "Збереження..." : "Зберегти примітку"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallDetailPage;
