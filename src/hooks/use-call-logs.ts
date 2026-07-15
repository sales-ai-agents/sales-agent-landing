import { useQuery } from "@tanstack/react-query";

import { mockCallLogs } from "@/lib/mock-data";
import type { CallLog } from "@/types";

async function fetchCallLogs(): Promise<CallLog[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return mockCallLogs;
}

export function useCallLogs() {
  return useQuery<CallLog[]>({
    queryKey: ["call-logs"],
    queryFn: fetchCallLogs,
  });
}
