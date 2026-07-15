import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { mockAgents } from "@/lib/mock-data";
import type { Agent } from "@/types";

async function fetchAgents(): Promise<Agent[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockAgents;
}

async function fetchAgent(id: string): Promise<Agent | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockAgents.find((agent) => agent.id === id);
}

export function useAgents() {
  return useQuery<Agent[]>({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  });
}

export function useAgent(id: string) {
  return useQuery<Agent | undefined>({
    queryKey: ["agents", id],
    queryFn: () => fetchAgent(id),
    enabled: !!id,
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      voice: string;
      instructions: string;
    }): Promise<Agent> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        id: String(Date.now()),
        name: data.name,
        voice: data.voice,
        instructions: data.instructions,
        status: "paused",
        totalCalls: 0,
        successRate: 0,
        lastActive: "Just created",
        createdAt: new Date().toISOString().split("T")[0],
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}

export function useToggleAgentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "active" | "paused" }) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}
