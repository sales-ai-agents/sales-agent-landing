import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiGet, apiPost, ApiRequestError } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { Agent, AgentsResponse, CreateAgentParams, TestCallParams } from "@/types";

export function useAgents() {
  return useQuery<Agent[]>({
    queryKey: ["agents"],
    queryFn: async () => {
      const data = await apiGet<AgentsResponse>(API_ENDPOINTS.APP_AGENTS);
      return data.agents;
    },
  });
}

export function useAgent(id: string) {
  return useQuery<Agent | null>({
    queryKey: ["agents", id],
    queryFn: async () => {
      const data = await apiGet<AgentsResponse>(API_ENDPOINTS.APP_AGENTS);
      return data.agents.find((agent) => String(agent.id) === id) ?? null;
    },
    enabled: !!id,
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAgentParams): Promise<Agent> => {
      return apiPost<Agent>(API_ENDPOINTS.APP_AGENTS, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Агента створено");
    },
    onError: (error: ApiRequestError) => {
      toast.error(error.message);
    },
  });
}

export function useToggleAgentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "active" | "paused" }) => {
      return apiPost(`${API_ENDPOINTS.APP_AGENTS}/${id}/status`, { status });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      const label = variables.status === "active" ? "активовано" : "призупинено";
      toast.success(`Агента ${label}`);
    },
    onError: (error: ApiRequestError) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      return apiPost(`${API_ENDPOINTS.APP_AGENTS}/${id}/delete`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Агента видалено");
    },
    onError: (error: ApiRequestError) => {
      toast.error(error.message);
    },
  });
}

export function useTestCall() {
  return useMutation({
    mutationFn: async (params: TestCallParams) => {
      return apiPost(API_ENDPOINTS.APP_TEST_CALL, params);
    },
    onSuccess: () => {
      toast.success("Дзвінок ініційовано — очікуйте виклик");
    },
    onError: (error: ApiRequestError) => {
      if (error.code === "too_soon") {
        toast.error("Лише один тестовий дзвінок на хвилину. Спробуйте пізніше.");
      } else {
        toast.error(error.message);
      }
    },
  });
}
