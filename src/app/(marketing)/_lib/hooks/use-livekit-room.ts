"use client";

import { useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track, type RemoteTrack } from "livekit-client";

import type { RoomStatus, UseLiveKitRoomOptions, UseLiveKitRoomResult } from "@marketing/types";

function getUserMediaErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "Не вдалося підключитися до кімнати.";
  }

  const name = error.name;
  const message = error.message.toLowerCase();

  if (name === "NotAllowedError" || message.includes("permission denied")) {
    return "Будь ласка, надайте доступ до мікрофона у налаштуваннях браузера.";
  }
  if (name === "NotFoundError" || message.includes("device not found")) {
    return "Мікрофон не знайдено. Будь ласка, підключіть мікрофон і спробуйте ще раз.";
  }
  if (name === "NotReadableError" || message.includes("could not start")) {
    return "Мікрофон вже використовується іншою програмою або вкладкою.";
  }
  if (message.includes("failed to connect") || message.includes("timeout")) {
    return "Не вдалося встановити зв'язок. Перевірте інтернет-з'єднання.";
  }

  return "Помилка підключення до голосового чату. Спробуйте ще раз.";
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
        setErrorMessage(getUserMediaErrorMessage(error));
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
