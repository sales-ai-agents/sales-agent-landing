"use client";

import { useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track, type RemoteTrack } from "livekit-client";
import type { RoomStatus } from "@/components/landing/api/types";
import type { LivePanelCopy } from "@/components/landing/copy/client-types";
import { useLandingCopy } from "@/components/landing/copy/provider";

type ConnectionErrorKey = keyof LivePanelCopy["errors"];

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

const resolveConnectionError = (error: unknown): ConnectionErrorKey => {
  if (!(error instanceof Error)) return "room";
  const message = error.message.toLowerCase();

  if (error.name === "NotAllowedError" || message.includes("permission denied")) {
    return "permission";
  }
  if (error.name === "NotFoundError" || message.includes("device not found")) return "noDevice";
  if (error.name === "NotReadableError" || message.includes("could not start")) {
    return "deviceBusy";
  }
  if (message.includes("failed to connect") || message.includes("timeout")) return "connection";
  return "generic";
};

export function useLiveKitRoom({ wsUrl, token }: UseLiveKitRoomOptions): UseLiveKitRoomResult {
  const { copy } = useLandingCopy();
  const roomRef = useRef<Room | null>(null);
  const [settledStatus, setSettledStatus] = useState<SettledStatus>("idle");
  const [errorKey, setErrorKey] = useState<ConnectionErrorKey | null>(null);

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
        setErrorKey(resolveConnectionError(error));
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

  const errorMessage = errorKey ? copy.livePanel.errors[errorKey] : null;
  const isConnecting = Boolean(wsUrl && token) && settledStatus === "idle";
  const status: RoomStatus = isConnecting ? "connecting" : settledStatus;

  const disconnect = (): void => {
    roomRef.current?.disconnect();
    setSettledStatus("disconnected");
  };

  return { status, errorMessage, disconnect };
}
