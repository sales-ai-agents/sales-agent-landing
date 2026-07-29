"use client";

import { useState } from "react";
import { PhoneOff } from "lucide-react";

import { useLiveKitRoom } from "@/hooks/use-livekit-room";
import type { WebAgentSession } from "@/hooks/use-web-agent";
import { LeadFormModal } from "@/components/marketing/lead-form-card";
import { cn } from "@/lib/utils";

interface LiveCallPanelProps {
  session: WebAgentSession;
  agentName: string;
}

const STATUS_LABELS: Record<string, string> = {
  idle: "Очікування...",
  connecting: "Підключення...",
  connected: "Розмова в процесі",
  disconnected: "Дзвінок завершено",
  error: "Помилка підключення",
};

export function LiveCallPanel({ session, agentName }: LiveCallPanelProps) {
  const { status, errorMessage, disconnect } = useLiveKitRoom({
    wsUrl: session.url,
    token: session.token,
  });
  const [modalDismissed, setModalDismissed] = useState(false);

  const showLeadModal = status === "disconnected" && !modalDismissed;

  return (
    <>
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "size-3 rounded-full",
              status === "connected" && "animate-pulse bg-green-500",
              status === "connecting" && "animate-pulse bg-yellow-500",
              status === "disconnected" && "bg-gray-400",
              status === "error" && "bg-red-500"
            )}
            aria-hidden="true"
          />
          <p className="text-foreground text-lg font-medium">
            {STATUS_LABELS[status] ?? "Невідомо"}
          </p>
        </div>

        <p className="text-muted-foreground text-base">
          {status === "connected" && `Розмовляєте з ${agentName}`}
          {status === "connecting" && "Очікуйте підключення..."}
          {status === "disconnected" && "Дякуємо за тестування!"}
        </p>

        {errorMessage && (
          <p role="alert" className="text-center text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        {(status === "connected" || status === "connecting") && (
          <button
            type="button"
            onClick={disconnect}
            aria-label="Завершити дзвінок"
            className="flex h-12 items-center gap-2 rounded-full bg-red-600 px-6 text-base font-medium text-white transition-colors hover:bg-red-700"
          >
            <PhoneOff className="size-5" aria-hidden="true" />
            Завершити дзвінок
          </button>
        )}
      </div>

      <LeadFormModal
        open={showLeadModal}
        onClose={() => setModalDismissed(true)}
        sourcePage="calls4u.ai/#builder"
      />
    </>
  );
}
