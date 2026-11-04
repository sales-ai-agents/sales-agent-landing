"use client";

import { useEffect } from "react";
import type { RoomStatus, WebAgentSession } from "@/components/landing/api/types";
import { useLiveKitRoom } from "@/components/landing/api/use-livekit-room";
import { useFormDialog } from "@/components/landing/use-form-dialog";
import { cn } from "@/lib/utils";

interface LiveCallPanelProps {
  session: WebAgentSession;
  agentName: string;
}

const STATUS_LABELS: Record<RoomStatus, string> = {
  idle: "Очікування…",
  connecting: "Підключення…",
  connected: "Розмова в процесі",
  disconnected: "Дзвінок завершено",
  error: "Помилка підключення",
};

const ACTIVE_STATUSES: readonly RoomStatus[] = ["connecting", "connected"];

const resolveHint = (status: RoomStatus, agentName: string): string | null => {
  if (status === "connected") return `Розмовляєте з ${agentName}`;
  if (status === "connecting") return "Очікуйте підключення…";
  if (status === "disconnected") return "Дякуємо за тестування!";
  return null;
};

export function LiveCallPanel({ session, agentName }: LiveCallPanelProps) {
  const { status, errorMessage, disconnect } = useLiveKitRoom({
    wsUrl: session.url,
    token: session.token,
  });
  const { show: showFeedback, dialog: feedbackDialog } = useFormDialog(
    "feedback",
    "landing_builder"
  );
  const hint = resolveHint(status, agentName);

  useEffect(() => {
    if (status === "disconnected") showFeedback();
  }, [status, showFeedback]);

  return (
    <div className="live" role="status">
      <div className="live-state">
        <i className={cn("live-status", status)} aria-hidden="true" />
        <b>{STATUS_LABELS[status]}</b>
      </div>
      {hint ? <p>{hint}</p> : null}
      {errorMessage ? <p className="form-msg err">{errorMessage}</p> : null}
      {ACTIVE_STATUSES.includes(status) ? (
        <button type="button" className="btn live-end" onClick={disconnect}>
          Завершити дзвінок
        </button>
      ) : null}
      {feedbackDialog}
    </div>
  );
}
