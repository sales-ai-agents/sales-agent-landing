import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { Preset, PresetsResponse } from "@marketing/builder-types";

const FALLBACK_ERROR_MESSAGE = "Не вдалося завантажити пресети. Спробуйте ще раз.";

async function fetchPresets(): Promise<Preset[]> {
  const body = await apiGet<PresetsResponse>(API_ENDPOINTS.PRESETS);

  if (body?.ok) {
    return body.presets;
  }

  throw new Error(FALLBACK_ERROR_MESSAGE);
}

export function usePresets() {
  const { data, isLoading, error, refetch } = useQuery<Preset[], Error>({
    queryKey: ["presets"],
    queryFn: fetchPresets,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return {
    presets: data ?? [],
    isLoading,
    errorMessage: error?.message ?? null,
    refetch,
  };
}
