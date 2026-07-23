"use client";

import { useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track, type RemoteTrack } from "livekit-client";

export type RoomStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

export interface UseLiveKitRoomOptions {
  wsUrl: string | null;
  token: string | null;
}

export interface UseLiveKitRoomResult {
  status: RoomStatus;
  errorMessage: string | null;
  disconnect: () => void;
}

export function useLiveKitRoom({ wsUrl, token }: UseLiveKitRoomOptions): UseLiveKitRoomResult {
  const roomRef = useRef<Room | null>(null);
  const [resolvedStatus, setResolvedStatus] = useState<
    "idle" | "connected" | "disconnected" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!wsUrl || !token) return;

    let cancelled = false;

    const room = new Room();
    roomRef.current = room;

    function handleTrackSubscribed(track: RemoteTrack) {
      if (track.kind === Track.Kind.Audio) track.attach();
    }

    function handleDisconnected() {
      if (!cancelled) setResolvedStatus("disconnected");
    }

    room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
    room.on(RoomEvent.Disconnected, handleDisconnected);

    room
      .connect(wsUrl, token)
      .then(async () => {
        if (cancelled) {
          room.disconnect();
          return;
        }
        await room.localParticipant.setMicrophoneEnabled(true);
        setResolvedStatus("connected");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message =
          error instanceof Error ? error.message : "Не вдалося підключитися до кімнати.";
        setErrorMessage(message);
        setResolvedStatus("error");
      });

    return () => {
      cancelled = true;
      room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
      room.off(RoomEvent.Disconnected, handleDisconnected);
      room.disconnect();
      roomRef.current = null;
    };
  }, [wsUrl, token]);

  const isAwaiting = !!wsUrl && !!token && resolvedStatus === "idle";
  const status: RoomStatus = isAwaiting ? "connecting" : resolvedStatus;

  function disconnect(): void {
    roomRef.current?.disconnect();
    setResolvedStatus("disconnected");
  }

  return { status, errorMessage, disconnect };
}
