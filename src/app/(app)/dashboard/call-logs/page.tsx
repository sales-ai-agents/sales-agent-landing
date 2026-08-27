"use client";

import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { Phone } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { PageError, PageEmpty, PageLoading } from "@/components/dashboard";
import { useCallLogs, useAgents } from "@dashboard/hooks";
import { cn } from "@/lib/utils";
import type { CallStatusFilter, CallsFilter } from "@dashboard/types";

import { CallLogsFilters } from "./_components/call-logs-filters";
import { CallLogsTable } from "./_components/call-logs-table";
import { Pagination } from "@/components/dashboard";

const PAGE_SIZE = 11;

type StatusTab = "all" | CallStatusFilter;

const STATUS_TABS: { key: StatusTab; label: string }[] = [
  { key: "all", label: "Усі дзвінки" },
  { key: "success", label: "Успішні" },
  { key: "failed", label: "Неуспішні" },
  { key: "attention", label: "Потребує уваги" },
];

function toDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export default function CallLogsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [agentId, setAgentId] = useState<number | undefined>();
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const status: CallStatusFilter | undefined = statusTab === "all" ? undefined : statusTab;

  const filters: CallsFilter = useMemo(
    () => ({
      limit: PAGE_SIZE,
      offset: currentPage * PAGE_SIZE,
      ...(dateRange?.from && { date_from: toDateString(dateRange.from) }),
      ...(dateRange?.to && { date_to: toDateString(dateRange.to) }),
      ...(status && { status }),
      ...(agentId && { agent_id: agentId }),
      ...(phoneSearch && { phone: phoneSearch }),
    }),
    [currentPage, dateRange, status, agentId, phoneSearch]
  );

  const { data, isLoading, error, refetch } = useCallLogs(filters);
  const { data: agents = [] } = useAgents();

  const callLogs = data?.calls ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const hasActiveFilters = !!(dateRange?.from || status || agentId || phoneSearch);

  const resetPage = useCallback(() => setCurrentPage(0), []);

  const handleStatusTabChange = useCallback((tab: StatusTab) => {
    setStatusTab(tab);
    setCurrentPage(0);
  }, []);

  const handleDateRangeChange = useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range);
      resetPage();
    },
    [resetPage]
  );

  const handleStatusChange = useCallback(
    (val: CallStatusFilter | undefined) => {
      setStatusTab(val ?? "all");
      resetPage();
    },
    [resetPage]
  );

  const handleAgentChange = useCallback(
    (val: number | undefined) => {
      setAgentId(val);
      resetPage();
    },
    [resetPage]
  );

  const handlePhoneSubmit = useCallback(() => {
    const trimmed = phoneInput.trim();
    if (trimmed !== phoneSearch) {
      setPhoneSearch(trimmed);
      resetPage();
    }
  }, [phoneInput, phoneSearch, resetPage]);

  if (isLoading && !data) return <PageLoading />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;
  if (!total && !hasActiveFilters) {
    return (
      <PageEmpty
        icon={Phone}
        title="Дзвінків ще немає"
        description="Тут з'являться ваші дзвінки після першого виклику"
      />
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Дзвінки</h1>
        <p className="text-muted-foreground text-sm">Журнал всіх дзвінків ваших ШІ-агентів</p>
      </header>

      <CallLogsFilters
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        status={status}
        onStatusChange={handleStatusChange}
        agentId={agentId}
        onAgentChange={handleAgentChange}
        agents={agents}
        phoneInput={phoneInput}
        onPhoneInputChange={setPhoneInput}
        onPhoneSubmit={handlePhoneSubmit}
      />

      <nav
        className="border-border flex gap-1 rounded-lg border bg-white px-2 pt-1"
        aria-label="Фільтр статусу дзвінків"
      >
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleStatusTabChange(tab.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              statusTab === tab.key
                ? "border-primary text-foreground border-b-2"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="border-border bg-background overflow-hidden rounded-xl border">
        <CallLogsTable data={callLogs} agents={agents} pageCount={pageCount} />
        <Pagination
          total={total}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemLabel="дзвінків"
          className="border-t px-4 py-3"
        />
      </div>
    </div>
  );
}
