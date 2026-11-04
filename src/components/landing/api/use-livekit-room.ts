"use client";

import { useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track, type RemoteTrack } from "livekit-client";
import type { RoomStatus } from "@/components/landing/api/types";

type SettledStatus = "idle" | "connected" | "disconnected" | "error";

interface UseLiveKitRoomOptions {
  wsUrl: string | null;
  token: string | null;
}

interface UseLiveKitRoomResult {
  status: RoomStatus;
  errorMessage: string | null;
  disconnect: () => void;
}

const DEFAULT_ERROR = "Помилка підключення до голосового чату. Спробуйте ще раз.";

const resolveConnectionError = (error: unknown): string => {
  if (!(error instanceof Error)) return "Не вдалося підключитися до кімнати.";
  const message = error.message.toLowerCase();

  if (error.name === "NotAllowedError" || message.includes("permission denied")) {
    return "Будь ласка, надайте доступ до мікрофона у налаштуваннях браузера.";
  }
  if (error.name === "NotFoundError" || message.includes("device not found")) {
    return "Мікрофон не знайдено. Будь ласка, підключіть мікрофон і спробуйте ще раз.";
  }
  if (error.name === "NotReadableError" || message.includes("could not start")) {
    return "Мікрофон вже використовується іншою програмою або вкладкою.";
  }
  if (message.includes("failed to connect") || message.includes("timeout")) {
    return "Не вдалося встановити зв'язок. Перевірте інтернет-з'єднання.";
  }
  return DEFAULT_ERROR;
};

export function useLiveKitRoom({ wsUrl, token }: UseLiveKitRoomOptions): UseLiveKitRoomResult {
  const roomRef = useRef<Room | null>(null);
  const [settledStatus, setSettledStatus] = useState<SettledStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!wsUrl || !token) return;
    let cancelled = false;
    const room = new Room();
    roomRef.current = room;

    const attachAudio = (track: RemoteTrack): void => {
      if (track.kind === Track.Kind.Audio) track.attach();
    };
    const markDisconnected = (): void => {
      if (!cancelled) setSettledStatus("disconnected");
    };

    room.on(RoomEvent.TrackSubscribed, attachAudio);
    room.on(RoomEvent.Disconnected, markDisconnected);

    room
      .connect(wsUrl, token)
      .then(async () => {
        if (cancelled) {
          room.disconnect();
          return;
        }
        await room.localParticipant.setMicrophoneEnabled(true);
        setSettledStatus("connected");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setErrorMessage(resolveConnectionError(error));
        setSettledStatus("error");
      });

    return () => {
      cancelled = true;
      room.off(RoomEvent.TrackSubscribed, attachAudio);
      room.off(RoomEvent.Disconnected, markDisconnected);
      room.disconnect();
      roomRef.current = null;
    };
  }, [wsUrl, token]);

  const isConnecting = Boolean(wsUrl && token) && settledStatus === "idle";
  const status: RoomStatus = isConnecting ? "connecting" : settledStatus;

  const disconnect = (): void => {
    roomRef.current?.disconnect();
    setSettledStatus("disconnected");
  };

  return { status, errorMessage, disconnect };
}
