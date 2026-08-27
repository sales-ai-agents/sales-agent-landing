import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api-client";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import type {
  Agent,
  AgentsResponse,
  CreateAgentParams,
  CreateAgentResponse,
  UpdateAgentParams,
  UpdateAgentResponse,
  TestCallParams,
} from "@dashboard/types";

interface UseAgentsOptions {
  stats?: boolean;
  days?: number;
}

export function useAgents(options?: UseAgentsOptions) {
  const withStats = options?.stats ?? false;
  const days = options?.days;

  return useQuery<Agent[]>({
    queryKey: ["agents", { stats: withStats, days }],
    queryFn: async () => {
      const url = withStats ? apiUrl.agents({ stats: true, days }) : API_ENDPOINTS.APP_AGENTS;
      const data = await apiGet<AgentsResponse>(url);
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
    mutationFn: async (data: CreateAgentParams): Promise<CreateAgentResponse> => {
      return apiPost<CreateAgentResponse>(API_ENDPOINTS.APP_AGENTS, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}

export function useToggleAgentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
      return apiPatch<UpdateAgentResponse>(apiUrl.agent(id), { is_active });
    },
    onMutate: async ({ id, is_active }) => {
      await queryClient.cancelQueries({ queryKey: ["agents"] });
      const previousAgents = queryClient.getQueryData<Agent[]>(["agents"]);

      queryClient.setQueryData<Agent[]>(["agents"], (old) =>
        old?.map((agent) => (agent.id === id ? { ...agent, is_active } : agent))
      );

      return { previousAgents };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousAgents) {
        queryClient.setQueryData(["agents"], context.previousAgents);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      return apiDelete(apiUrl.agent(id));
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["agents"] });
      const previousAgents = queryClient.getQueryData<Agent[]>(["agents"]);

      queryClient.setQueryData<Agent[]>(["agents"], (old) =>
        old?.filter((agent) => String(agent.id) !== String(id))
      );

      return { previousAgents };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousAgents) {
        queryClient.setQueryData(["agents"], context.previousAgents);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateAgentParams & { id: number | string }) => {
      return apiPatch<UpdateAgentResponse>(apiUrl.agent(id), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}

export function useTestCall() {
  return useMutation({
    mutationFn: async (params: TestCallParams) => {
      return apiPost(API_ENDPOINTS.APP_TEST_CALL, params);
    },
  });
}
