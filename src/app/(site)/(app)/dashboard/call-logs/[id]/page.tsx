"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Bot } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants, Textarea, Badge } from "@/components/ui";
import { PageLoading, PageError, AudioPlayer } from "@/components/dashboard";
import {
  useCallDetail,
  useSaveNote,
  useAgents,
  useCrmStatus,
  useMarkResultsSeen,
} from "@dashboard/hooks";
import { handleMutationError } from "@/lib/mutation-error";
import { getOutcomeConfig } from "@/app/(site)/(app)/_lib/call-outcome";
import {
  formatDuration,
  formatSlaMinutes,
  formatDateShort,
  formatTime,
  formatDateTime,
  cn,
} from "@/lib/utils";
import { formatTranscriptTime } from "@/app/(site)/(app)/dashboard/call-logs/_lib/utils";
import { InfoField } from "@/app/(site)/(app)/dashboard/call-logs/_components/info-field";
import { CallResultCard } from "@/app/(site)/(app)/dashboard/call-logs/_components/call-result-card";
import { CrmStatusPanel } from "@/app/(site)/(app)/dashboard/call-logs/_components/crm-status-panel";
import { CollectedDataPanel } from "@/app/(site)/(app)/dashboard/call-logs/_components/collected-data-panel";
import type { SlaState } from "@dashboard/types";

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
      const overdue = minutesLeft !== null ? formatSlaMinutes(minutesLeft) : "0 хв";
      return <p className="text-destructive mt-1 text-sm font-medium">⊘ Прострочено {overdue}</p>;
    }
    case "ok": {
      const left = minutesLeft !== null ? formatSlaMinutes(minutesLeft) : "0 хв";
      return <p className="text-warning mt-1 text-sm font-medium">Залишилось {left}</p>;
    }
    case "handled":
      return <p className="text-success mt-1 text-sm font-medium">Оброблено</p>;
    default:
      return <p className="mt-1 text-sm font-medium">—</p>;
  }
};

const CallDetailPage = () => {
  const params = useParams();
  const callId = params.id as string;

  const { data: call, isLoading, error, refetch } = useCallDetail(callId);
  const { data: agents = [] } = useAgents();
  const { data: crm } = useCrmStatus(callId);
  const saveNote = useSaveNote(callId);
  const { mutate: markResultsSeen } = useMarkResultsSeen();

  const [note, setNote] = useState<string | null>(null);
  const displayNote = note ?? call?.manager_note ?? "";

  const shouldMarkSeen = Boolean(call?.result) && call?.result_seen === false;

  useEffect(() => {
    if (shouldMarkSeen) markResultsSeen({ call_ids: [callId] });
  }, [shouldMarkSeen, callId, markResultsSeen]);

  const handleSaveNote = useCallback(() => {
    saveNote.mutate(displayNote, {
      onSuccess: () => toast.success("Примітку збережено"),
      onError: (err) => handleMutationError(err),
    });
  }, [saveNote, displayNote]);

  if (isLoading) return <PageLoading message="Завантажуємо дзвінок..." />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;
  if (!call) return <PageError message="Дзвінок не знайдено" />;

  const outcomeConfig = getOutcomeConfig(call.outcome);
  const duration = formatDuration(call.duration_sec);
  const agentName = agents.find((a) => a.id === call.agent_id)?.name ?? "—";
  const minutesUsed = call.billed_sec ? (call.billed_sec / 60).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/call-logs"
        className="text-primary inline-flex items-center gap-1 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад до дзвінків
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Деталі дзвінка</h1>
          <p className="text-muted-foreground text-sm">
            {formatDateShort(call.created_at)} - {formatTime(call.created_at)}
          </p>
        </div>
        <a
          href={`/api/app/calls/${callId}/audio`}
          download
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
        >
          <Download className="h-4 w-4" />
          Завантажити аудіо
        </a>
      </div>

      <div className="border-border bg-background grid grid-cols-2 gap-4 rounded-2xl border p-5 sm:grid-cols-3 lg:grid-cols-6">
        <InfoField label="Клієнт" value={call.company_name || call.phone} />

        <InfoField
          label="Агент"
          value={agentName}
          icon={<Bot className="text-primary h-4 w-4" />}
        />

        <div>
          <p className="text-muted-foreground text-xs">Результат дзвінка</p>
          <Badge variant={outcomeConfig.variant} className="mt-1 px-4">
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
          {call.result && <CallResultCard result={call.result} />}

          <AudioPlayer src={`/api/app/calls/${callId}/audio`} />

          {call.collected_data && call.collected_data.length > 0 && (
            <CollectedDataPanel
              items={call.collected_data}
              isComplete={call.collected_data_complete ?? true}
            />
          )}

          <div className="border-border bg-background rounded-2xl border p-5">
            <h2 className="mb-4 text-sm font-semibold">Транскрипція</h2>
            {call.transcript?.length ? (
              <div className="space-y-4">
                {call.transcript.map((msg, i) => (
                  <div key={`${msg.role}-${i}`} className="flex gap-3">
                    <span className="text-muted-foreground shrink-0 font-mono text-xs">
                      {formatTranscriptTime(i, call.duration_sec)}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        msg.role === "assistant" ? "text-primary" : "text-success"
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
          {crm?.configured && <CrmStatusPanel callId={callId} crm={crm} />}

          <div className="border-border bg-background rounded-2xl border p-5">
            <h3 className="mb-3 text-sm font-semibold">Пов&apos;язаний контакт</h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{call.phone}</p>
              <div>
                <span className="text-muted-foreground">Email</span>
                <p>—</p>
              </div>
            </div>
          </div>

          <div className="border-border bg-background rounded-2xl border p-5">
            <h3 className="mb-3 text-sm font-semibold">Примітки менеджера</h3>
            <Textarea
              placeholder="Додати примітку..."
              rows={4}
              value={displayNote}
              onChange={(e) => setNote(e.target.value)}
            />
            {call.manager_note_at && (
              <p className="text-muted-foreground mt-1 text-xs">
                Останнє оновлення: {formatDateTime(call.manager_note_at)}
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
