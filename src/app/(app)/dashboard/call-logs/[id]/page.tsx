"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Bot } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PageLoading, PageError } from "@/components/dashboard/page-states";
import { AudioPlayer } from "@/components/dashboard/audio-player";
import { useCallDetail } from "@dashboard/hooks/use-call-detail";
import { useAgents } from "@dashboard/hooks/use-agents";
import { getOutcomeConfig } from "../_lib/utils";
import { formatDuration, cn } from "@/lib/utils";
import { apiPut } from "@/lib/api-client";
import { apiUrl } from "@/lib/api-config";

export default function CallDetailPage() {
  const params = useParams();
  const callId = params.id as string;
  const { data: call, isLoading, error } = useCallDetail(callId);
  const { data: agents = [] } = useAgents();
  const [note, setNote] = useState("");
  const [noteLoaded, setNoteLoaded] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  if (call && !noteLoaded) {
    setNote(call.manager_note ?? "");
    setNoteLoaded(true);
  }

  if (isLoading) return <PageLoading />;
  if (error) return <PageError message={error.message} />;
  if (!call) return <PageError message="Дзвінок не знайдено" />;

  const outcomeConfig = getOutcomeConfig(call.outcome);
  const duration = formatDuration(call.duration_sec);
  const createdAt = new Date(call.created_at);
  const agentName = agents.find((a) => a.id === call.agent_id)?.name ?? "—";
  const minutesUsed = call.duration_sec ? (call.duration_sec / 60).toFixed(1) : "0";

  async function handleSaveNote(): Promise<void> {
    setSavingNote(true);
    try {
      await apiPut(apiUrl.call(callId) + "/note", { note });
      toast.success("Примітку збережено");
    } catch {
      toast.error("Не вдалось зберегти примітку");
    } finally {
      setSavingNote(false);
    }
  }

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

      <div className="border-border bg-background grid grid-cols-2 gap-3 rounded-2xl border p-5 md:grid-cols-5">
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
            <Button size="sm" className="mt-3" onClick={handleSaveNote} disabled={savingNote}>
              {savingNote ? "Збереження..." : "Зберегти примітку"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <div className="mt-1 flex items-center gap-1.5">
        {icon}
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function formatTranscriptTime(index: number, totalSec: number | null): string {
  if (!totalSec) return "00:00";
  const approxSec = Math.round((index / 10) * 30);
  const m = Math.floor(approxSec / 60);
  const s = approxSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
