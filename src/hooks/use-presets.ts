import { useQuery } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/lib/api-config";
import type { Preset, PresetsResponse } from "@/types";

const NETWORK_ERROR_MESSAGE =
  "Не вдалося з'єднатися з сервером. Перевірте інтернет і спробуйте ще раз.";
const FALLBACK_ERROR_MESSAGE = "Не вдалося завантажити пресети. Спробуйте ще раз.";

async function fetchPresets(): Promise<Preset[]> {
  let response: Response;
  try {
    response = await fetch(API_ENDPOINTS.PRESETS, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  const body: PresetsResponse = await response.json().catch(() => ({ ok: false, presets: [] }));

  if (response.ok && body?.ok) {
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
