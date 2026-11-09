"use client";

import { useEffect } from "react";
import type { RoomStatus, WebAgentSession } from "@/components/landing/api/types";
import { useLiveKitRoom } from "@/components/landing/api/use-livekit-room";
import { useLandingCopy } from "@/components/landing/copy/provider";
import { useFormDialog } from "@/components/landing/form-dialog-provider";
import { formatMessage } from "@/lib/i18n/format";
import { cn } from "@/lib/utils";

interface LiveCallPanelProps {
  session: WebAgentSession;
  agentName: string;
}

const ACTIVE_STATUSES: readonly RoomStatus[] = ["connecting", "connected"];

export function LiveCallPanel({ session, agentName }: LiveCallPanelProps) {
  const { copy } = useLandingCopy();
  const panel = copy.livePanel;
  const { status, errorMessage, disconnect } = useLiveKitRoom({
    wsUrl: session.url,
    token: session.token,
  });
  const showFeedback = useFormDialog("feedback", "landing_builder");
  const hints: Partial<Record<RoomStatus, string>> = {
    connected: formatMessage(panel.hintConnected, { name: agentName }),
    connecting: panel.hintConnecting,
    disconnected: panel.hintDone,
  };
  const hint = hints[status];

  useEffect(() => {
    if (status === "disconnected") showFeedback();
  }, [status, showFeedback]);

  return (
    <div className="live" role="status">
      <div className="live-state">
        <i className={cn("live-status", status)} aria-hidden="true" />
        <b>{panel.status[status]}</b>
      </div>
      {hint ? <p>{hint}</p> : null}
      {errorMessage ? <p className="form-msg err">{errorMessage}</p> : null}
      {ACTIVE_STATUSES.includes(status) ? (
        <button type="button" className="btn live-end" onClick={disconnect}>
          {panel.end}
        </button>
      ) : null}
    </div>
  );
}
