"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";

import { Download, Phone } from "lucide-react";
import { PageLoading, PageError, PageEmpty, PageHead, Pagination } from "@/components/dashboard";
import { Badge, Button, Card, Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { useCallLogs, useAgents, useMarkResultsSeen } from "@dashboard/hooks";
import { apiUrl } from "@/lib/api-config";
import { handleMutationError } from "@/lib/mutation-error";
import type { CallCounts, CallStatusFilter, CallsFilter } from "@dashboard/types";
import { Filters } from "./_components/filters";
import { SelectionBar } from "./_components/selection-bar";
import { Table } from "./_components/table";
import { toDateString } from "./_lib/utils";

const PAGE_SIZE = 11;

type StatusTab = "all" | CallStatusFilter;

const STATUS_TABS: { key: StatusTab; label: string }[] = [
  { key: "all", label: "Усі дзвінки" },
  { key: "success", label: "Успішні" },
  { key: "failed", label: "Неуспішні" },
  { key: "attention", label: "Потребує уваги" },
];

const CallLogsPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [agentId, setAgentId] = useState<number | undefined>();
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());

  const status: CallStatusFilter | undefined = statusTab === "all" ? undefined : statusTab;

  const exportFilters = useMemo(
    () => ({
      ...(dateRange?.from && { date_from: toDateString(dateRange.from) }),
      ...(dateRange?.to && { date_to: toDateString(dateRange.to) }),
      ...(status && { status }),
      ...(agentId && { agent_id: agentId }),
      ...(phoneSearch && { phone: phoneSearch }),
    }),
    [dateRange, status, agentId, phoneSearch]
  );

  const filters: CallsFilter = useMemo(
    () => ({ limit: PAGE_SIZE, offset: currentPage * PAGE_SIZE, ...exportFilters }),
    [currentPage, exportFilters]
  );

  const { data, isLoading, error, refetch } = useCallLogs(filters);
  const { data: agents = [] } = useAgents();
  const markSeen = useMarkResultsSeen();

  const callLogs = data?.calls ?? [];
  const total = data?.total ?? 0;
  const hasActiveFilters = !!(dateRange?.from || status || agentId || phoneSearch);
  const showSla = (data?.sla_minutes ?? 0) > 0;
  const showCrm = data?.crm_configured === true;

  const resetView = useCallback(() => {
    setCurrentPage(0);
    setSelectedIds(new Set());
  }, []);

  const handleExport = useCallback(() => {
    window.open(apiUrl.callsExport(exportFilters), "_blank", "noopener,noreferrer");
  }, [exportFilters]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSelectedIds(new Set());
  }, []);

  const handleToggleOne = useCallback((id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }, []);

  const handleToggleAll = useCallback((ids: string[]) => {
    setSelectedIds((current) => (ids.every((id) => current.has(id)) ? new Set() : new Set(ids)));
  }, []);

  const handleMarkProcessed = useCallback(() => {
    markSeen.mutate(
      { call_ids: [...selectedIds] },
      {
        onSuccess: ({ marked }) => {
          toast.success(`Позначено як оброблені: ${marked}`);
          setSelectedIds(new Set());
        },
        onError: (err) => handleMutationError(err),
      }
    );
  }, [markSeen, selectedIds]);

  const handleStatusTabChange = useCallback(
    (value: string) => {
      setStatusTab(value as StatusTab);
      resetView();
    },
    [resetView]
  );

  const handleDateRangeChange = useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range);
      resetView();
    },
    [resetView]
  );

  const handleAgentChange = useCallback(
    (value: number | undefined) => {
      setAgentId(value);
      resetView();
    },
    [resetView]
  );

  const handlePhoneSubmit = useCallback(() => {
    const trimmed = phoneInput.trim();
    if (trimmed === phoneSearch) return;
    setPhoneSearch(trimmed);
    resetView();
  }, [phoneInput, phoneSearch, resetView]);

  if (isLoading && !data) return <PageLoading message="Завантажуємо дзвінки..." />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;
  if (!total && !hasActiveFilters && !data?.counts?.all) {
    return (
      <div className="flex flex-col gap-6">
        <PageHead
          word="дзвінки"
          title="Дзвінки"
          description="Журнал усіх дзвінків ваших ШІ-агентів"
          tone="b"
        />
        <PageEmpty
          icon={Phone}
          title="Дзвінків ще немає"
          description={<p>Тут з&#39;являться ваші дзвінки після першого виклику</p>}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHead
        word="дзвінки"
        title="Дзвінки"
        description="Журнал усіх дзвінків ваших ШІ-агентів"
        tone="b"
        actions={
          <Button type="button" variant="outline" onClick={handleExport}>
            <Download aria-hidden="true" />
            Експорт за фільтром
          </Button>
        }
      />

      <Filters
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        agentId={agentId}
        onAgentChange={handleAgentChange}
        agents={agents}
        phoneInput={phoneInput}
        onPhoneInputChange={setPhoneInput}
        onPhoneSubmit={handlePhoneSubmit}
      />

      <Card className="overflow-hidden p-0">
        <Tabs
          value={statusTab}
          onValueChange={handleStatusTabChange}
          className="border-b px-4 pt-3 pb-2"
        >
          <TabsList variant="line" aria-label="Фільтр статусу дзвінків">
            {STATUS_TABS.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.label}
                <TabCount counts={data?.counts} tab={tab.key} />
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {selectedIds.size > 0 && (
          <SelectionBar
            count={selectedIds.size}
            isPending={markSeen.isPending}
            onClear={() => setSelectedIds(new Set())}
            onMarkProcessed={handleMarkProcessed}
          />
        )}

        <Table
          data={callLogs}
          agents={agents}
          showSla={showSla}
          showCrm={showCrm}
          selectedIds={selectedIds}
          onToggleOne={handleToggleOne}
          onToggleAll={handleToggleAll}
        />
        <Pagination
          total={total}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          itemLabel="дзвінків"
        />
      </Card>
    </div>
  );
};

interface TabCountProps {
  counts: CallCounts | undefined;
  tab: StatusTab;
}

const TabCount = ({ counts, tab }: TabCountProps) => {
  if (!counts) return null;
  return <Badge variant={tab === "attention" ? "warning" : "muted"}>{counts[tab]}</Badge>;
};

export default CallLogsPage;
