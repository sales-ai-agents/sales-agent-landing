import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api-client";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import type {
  TeamMember,
  TeamResponse,
  InviteTeamMemberParams,
  InviteTeamMemberResponse,
  UpdateTeamMemberRoleParams,
} from "@dashboard/types";

export const useTeam = () => {
  return useQuery<TeamMember[]>({
    queryKey: ["team"],
    queryFn: async () => {
      const data = await apiGet<TeamResponse>(API_ENDPOINTS.APP_TEAM);
      return data.members;
    },
  });
};

export const useInviteTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation<InviteTeamMemberResponse, Error, InviteTeamMemberParams>({
    mutationFn: (params) => apiPost<InviteTeamMemberResponse>(API_ENDPOINTS.APP_TEAM, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
};

export const useUpdateTeamMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateTeamMemberRoleParams & { id: number }) => {
      return apiPatch(apiUrl.teamMember(id), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
};

export const useRemoveTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return apiDelete(apiUrl.teamMember(id));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
};
