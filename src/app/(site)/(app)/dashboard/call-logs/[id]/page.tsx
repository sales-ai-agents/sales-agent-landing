"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { ArrowLeft, Download } from "lucide-react";
import { PageLoading, PageError, PageHead, AudioPlayer } from "@/components/dashboard";
import { Button, buttonVariants, Card, CardTitle, Textarea } from "@/components/ui";
import {
  useCallDetail,
  useSaveNote,
  useAgents,
  useCrmStatus,
  useMarkResultsSeen,
} from "@dashboard/hooks";
import { useAccountTimeZone } from "@/lib/hooks";
import { handleMutationError } from "@/lib/mutation-error";
import { apiUrl } from "@/lib/api-config";
import { CallResultCell } from "@/components/dashboard/call-result-cell";
import { formatDuration, formatDateShort, formatTime, formatDateTime, cn } from "@/lib/utils";
import { CallResultCard } from "../_components/call-result-card";
import { CollectedDataPanel } from "../_components/collected-data-panel";
import { ContactCard } from "../_components/contact-card";
import { CrmStatusPanel } from "../_components/crm-status-panel";
import { SlaIndicator } from "../_components/sla-indicator";
import { formatBilledMinutes } from "../_lib/utils";

const Fact = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col items-start gap-1.5">
    <span className="caption text-muted-foreground">{label}</span>
    {children}
  </div>
);

const CallDetailPage = () => {
  const params = useParams();
  const callId = params.id as string;

  const { data: call, isLoading, error, refetch } = useCallDetail(callId);
  const { data: agents = [] } = useAgents();
  const timeZone = useAccountTimeZone();
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

  const agentName = agents.find((a) => a.id === call.agent_id)?.name ?? "—";
  const customerType = call.contact?.tags[0] ?? "—";
  const audioUrl = apiUrl.callAudio(callId);

  return (
    <div className="flex flex-col gap-6">
      <Link
        className={cn(buttonVariants({ variant: "link" }), "w-fit px-0")}
        href="/dashboard/call-logs"
      >
        <ArrowLeft aria-hidden="true" />
        Назад до дзвінків
      </Link>

      <PageHead
        word="дзвінок"
        title="Деталі дзвінка"
        description={`${formatDateShort(call.created_at, timeZone)} · ${formatTime(call.created_at, timeZone)}`}
        tone="b"
        actions={
          <a
            className={buttonVariants({ variant: "outline" })}
            href={audioUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download aria-hidden="true" />
            Завантажити аудіо
          </a>
        }
      />

      <Card className="p-6">
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="Клієнт">
            <b className="tabular-nums">{call.contact?.name || call.company_name || call.phone}</b>
          </Fact>
          <Fact label="Агент">
            <b>{agentName}</b>
            {call.agent_revision != null && (
              <span className="text-muted-foreground text-xs">v{call.agent_revision}</span>
            )}
          </Fact>
          <Fact label="Результат дзвінка">
            <CallResultCell call={call} />
          </Fact>
          <Fact label="Тривалість дзвінка">
            <b className="tabular-nums">{formatDuration(call.duration_sec)}</b>
          </Fact>
          <Fact label="Статус / SLA">
            <SlaIndicator state={call.sla_state} minutesLeft={call.sla_minutes_left} />
          </Fact>
          <Fact label="Тип клієнта">
            <b>{customerType}</b>
          </Fact>
          <Fact label="Витрачено хвилин">
            <b className="tabular-nums">{formatBilledMinutes(call.billed_sec)}</b>
          </Fact>
        </div>
      </Card>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex min-w-0 flex-col gap-6">
          {call.result && <CallResultCard result={call.result} />}

          <AudioPlayer src={audioUrl} />

          {call.collected_data && call.collected_data.length > 0 && (
            <CollectedDataPanel
              items={call.collected_data}
              isComplete={call.collected_data_complete ?? true}
            />
          )}

          <Card className="flex flex-col gap-4 p-6">
            <CardTitle>Транскрипція</CardTitle>
            {call.transcript?.length ? (
              <div className="divide-y">
                {call.transcript.map((msg, index) => (
                  <div
                    key={`${msg.role}-${index}`}
                    className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-3 text-sm"
                  >
                    <span
                      className={cn(
                        "caption",
                        msg.role === "assistant" ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {msg.role === "assistant" ? "ШІ-агент" : "Клієнт"}
                    </span>
                    <span>{msg.content}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Транскрипт відсутній</p>
            )}
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          {crm?.configured && <CrmStatusPanel callId={callId} crm={crm} />}
          <ContactCard contact={call.contact} phone={call.phone} />
          <Card className="flex flex-col gap-3 p-6">
            <CardTitle className="text-lg">Примітки менеджера</CardTitle>
            <Textarea
              id="manager-note"
              placeholder="Додати примітку..."
              aria-label="Примітка менеджера"
              className="min-h-28"
              value={displayNote}
              onChange={(event) => setNote(event.target.value)}
            />
            {call.manager_note_at && (
              <p className="text-muted-foreground text-xs">
                Останнє оновлення: {formatDateTime(call.manager_note_at, timeZone)}
              </p>
            )}
            <Button
              type="button"
              size="sm"
              className="w-full"
              onClick={handleSaveNote}
              disabled={saveNote.isPending}
            >
              {saveNote.isPending ? "Збереження..." : "Зберегти примітку"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CallDetailPage;
