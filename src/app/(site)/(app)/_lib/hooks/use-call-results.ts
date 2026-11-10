import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPost } from "@/lib/api-client";
import { API_ENDPOINTS, apiUrl } from "@/lib/api-config";
import { useMe } from "@/lib/hooks";
import type {
  CallResultsResponse,
  MarkResultsSeenParams,
  MarkResultsSeenResponse,
} from "@dashboard/types";

const CALL_RESULTS_KEY = ["call-results"] as const;
const FEED_PAGE_SIZE = 10;
const BADGE_POLL_MS = 60_000;

export const useUnseenImportantCount = () => {
  const { data: account } = useMe();

  return useQuery({
    queryKey: [...CALL_RESULTS_KEY, "badge"],
    queryFn: () => apiGet<CallResultsResponse>(apiUrl.callResults({ limit: 1 })),
    select: (data) => data.unseen_important,
    refetchInterval: BADGE_POLL_MS,
    enabled: Boolean(account),
  });
};

export const useCallResultsFeed = (unseenOnly: boolean, enabled: boolean) => {
  return useInfiniteQuery({
    queryKey: [...CALL_RESULTS_KEY, "feed", { unseenOnly }],
    queryFn: ({ pageParam }) =>
      apiGet<CallResultsResponse>(
        apiUrl.callResults({ limit: FEED_PAGE_SIZE, offset: pageParam, unseen: unseenOnly })
      ),
    initialPageParam: 0,
    getNextPageParam: ({ offset, items, total }) => {
      const nextOffset = offset + items.length;
      return nextOffset < total ? nextOffset : undefined;
    },
    enabled,
  });
};

export const useMarkResultsSeen = () => {
  const queryClient = useQueryClient();

  return useMutation<MarkResultsSeenResponse, Error, MarkResultsSeenParams>({
    mutationFn: (params) =>
      apiPost<MarkResultsSeenResponse>(API_ENDPOINTS.APP_CALL_RESULTS_SEEN, params),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: CALL_RESULTS_KEY }),
        queryClient.invalidateQueries({ queryKey: ["call-logs"] }),
      ]),
  });
};
