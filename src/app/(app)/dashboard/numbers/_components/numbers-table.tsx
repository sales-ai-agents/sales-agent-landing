"use client";

import { useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { handleMutationError } from "@/lib/mutation-error";
import { NUMBER_ERROR_MESSAGES } from "@/lib/error-messages";
import { cn } from "@/lib/utils";
import { useUpdateNumber } from "@dashboard/hooks";
import type { Agent, AgentNumber } from "@dashboard/types";

import {
  DIRECTION_LABELS,
  STATUS_LABELS,
  formatDailyCap,
  resolveCallerIdBadge,
  resolveNumberTypeLabel,
} from "../_lib/labels";
import { DeleteNumberDialog } from "./delete-number-dialog";

interface NumbersTableProps {
  numbers: AgentNumber[];
  agents: Agent[];
}

const UNASSIGNED_VALUE = "0";
const UNASSIGNED_LABEL = "Вибрати агента";
const columnHelper = createColumnHelper<AgentNumber>();

const renderAgentLabel = (value: string | null, agents: Agent[]): string => {
  const agent = agents.find((item) => String(item.id) === value);
  return agent?.name ?? UNASSIGNED_LABEL;
};

const CallerIdBadge = ({ callerId }: { callerId: boolean }) => {
  const badge = resolveCallerIdBadge(callerId);
  const label = (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
        badge.className
      )}
    >
      {badge.label}
      {badge.hint && <Info className="h-3 w-3" />}
    </span>
  );

  if (!badge.hint) return label;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<span className="cursor-help">{label}</span>} />
        <TooltipContent side="top">{badge.hint}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const UnassignedWarning = () => (
  <p className="text-destructive flex items-center gap-1.5 text-xs font-medium">
    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
    Агента не призначено. Дзвінки на цей номер не прийматимуться.
  </p>
);

export const NumbersTable = ({ numbers, agents }: NumbersTableProps) => {
  const updateNumber = useUpdateNumber();

  const handleAssign = (number: AgentNumber, value: string | null): void => {
    if (value === null) return;

    const currentValue = number.agent_id ? String(number.agent_id) : UNASSIGNED_VALUE;
    if (value === currentValue) return;

    updateNumber.mutate(
      { id: number.id, agent_id: Number(value) },
      {
        onSuccess: () => toast.success("Агента оновлено"),
        onError: (error) => handleMutationError(error, NUMBER_ERROR_MESSAGES),
      }
    );
  };

  const renderAgentSelect = (number: AgentNumber, className?: string) => (
    <Select
      value={number.agent_id ? String(number.agent_id) : UNASSIGNED_VALUE}
      onValueChange={(value) => handleAssign(number, value)}
    >
      <SelectTrigger className={cn("w-full sm:w-46", className)}>
        <SelectValue>{(value) => renderAgentLabel(value, agents)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={UNASSIGNED_VALUE}>{UNASSIGNED_LABEL}</SelectItem>
        {agents.map((agent) => (
          <SelectItem key={agent.id} value={String(agent.id)}>
            {agent.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("phone", {
        header: "Номер",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.phone}</div>
            <div className="text-muted-foreground text-xs">
              {resolveNumberTypeLabel(row.original)}
            </div>
          </div>
        ),
      }),
      columnHelper.display({
        id: "caller-id",
        header: "Відображення",
        cell: ({ row }) => <CallerIdBadge callerId={row.original.caller_id} />,
      }),
      columnHelper.display({
        id: "agent",
        header: "Призначений агент",
        cell: ({ row }) => (
          <div className="space-y-1.5">
            {row.original.agent_name && (
              <p className="text-sm">
                Відповідає: <span className="font-medium">{row.original.agent_name}</span>
              </p>
            )}
            {renderAgentSelect(row.original)}
            {row.original.agent_id === 0 && <UnassignedWarning />}
          </div>
        ),
      }),
      columnHelper.display({
        id: "direction",
        header: "Напрямок",
        cell: ({ row }) => {
          const dailyCap = formatDailyCap(row.original.daily_cap);
          return (
            <div>
              <div>{DIRECTION_LABELS[row.original.direction]}</div>
              {dailyCap && <div className="text-muted-foreground text-xs">{dailyCap}</div>}
            </div>
          );
        },
      }),
      columnHelper.accessor("status", {
        header: "Статус",
        cell: ({ row }) => <span className="text-sm">{STATUS_LABELS[row.original.status]}</span>,
      }),
      columnHelper.display({
        id: "actions",
        header: "Дії",
        cell: ({ row }) => (
          <DeleteNumberDialog
            id={row.original.id}
            phone={row.original.phone}
            source={row.original.source}
          />
        ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [agents]
  );

  const table = useReactTable({
    data: numbers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border">
      <div className="divide-border divide-y md:hidden">
        {numbers.map((number) => {
          const dailyCap = formatDailyCap(number.daily_cap);

          return (
            <div key={number.id} className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{number.phone}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {resolveNumberTypeLabel(number)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <CallerIdBadge callerId={number.caller_id} />
                  <DeleteNumberDialog id={number.id} phone={number.phone} source={number.source} />
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-muted-foreground text-xs">Призначений агент</p>
                {renderAgentSelect(number)}
                {number.agent_id === 0 && <UnassignedWarning />}
              </div>
              <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
                <span>
                  Напрямок: {DIRECTION_LABELS[number.direction]}
                  {dailyCap ? ` · ${dailyCap}` : ""}
                </span>
                <span>Статус: {STATUS_LABELS[number.status]}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4 font-normal">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-3 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
