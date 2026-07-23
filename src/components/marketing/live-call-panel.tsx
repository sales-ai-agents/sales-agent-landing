"use client";

import { PhoneOff } from "lucide-react";

import { useLiveKitRoom } from "@/hooks/use-livekit-room";
import type { WebAgentSession } from "@/hooks/use-web-agent";
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

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Status indicator */}
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
        <p className="text-text-primary text-lg font-medium">
          {STATUS_LABELS[status] ?? "Невідомо"}
        </p>
      </div>

      {/* Agent name */}
      <p className="text-text-secondary text-base">
        {status === "connected" && `Розмовляєте з ${agentName}`}
        {status === "connecting" && "Очікуйте підключення..."}
        {status === "disconnected" && "Дякуємо за тестування!"}
      </p>

      {/* Error */}
      {errorMessage && (
        <p role="alert" className="text-center text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      {/* Disconnect button */}
      {(status === "connected" || status === "connecting") && (
        <button
          type="button"
          onClick={disconnect}
          aria-label="Завершити дзвінок"
          className="bg-destructive hover:bg-destructive/90 flex h-12 items-center gap-2 rounded-full px-6 text-base font-medium text-white transition-colors"
        >
          <PhoneOff className="size-5" aria-hidden="true" />
          Завершити дзвінок
        </button>
      )}
    </div>
  );
}
