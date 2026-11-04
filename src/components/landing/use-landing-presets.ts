"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { Preset, PresetsResponse } from "@/components/landing/api/types";

const STALE_TIME_MS = 5 * 60 * 1000;
const FETCH_ERROR_MESSAGE = "Не вдалося завантажити пресети.";

const fetchPresets = async (): Promise<Preset[]> => {
  const body = await apiGet<PresetsResponse>(API_ENDPOINTS.PRESETS);
  if (!body?.ok) throw new Error(FETCH_ERROR_MESSAGE);
  return body.presets;
};

export function useLandingPresets(enabled: boolean): Preset[] {
  const { data } = useQuery<Preset[], Error>({
    queryKey: ["presets"],
    queryFn: fetchPresets,
    staleTime: STALE_TIME_MS,
    enabled,
  });

  return data ?? [];
}
