"use client";

import { useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
} from "@/components/ui";
import { handleMutationError } from "@/lib/mutation-error";
import { NUMBER_ERROR_MESSAGES } from "@/lib/error-messages";
import { cn } from "@/lib/utils";
import { useUpdateNumber } from "@dashboard/hooks";
import type { Agent, AgentNumber } from "@dashboard/types";

import { DIRECTION_LABELS, formatDailyCap, resolveDisplayBadge } from "../_lib/labels";
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

export const NumbersTable = ({ numbers, agents }: NumbersTableProps) => {
  const updateNumber = useUpdateNumber();

  const handleAssign = (id: number, value: string | null): void => {
    if (value === null) return;

    updateNumber.mutate(
      { id, agent_id: Number(value) },
      {
        onSuccess: () => toast.success("Агента оновлено"),
        onError: (error) => handleMutationError(error, NUMBER_ERROR_MESSAGES),
      }
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("phone", {
        header: "Номер",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.phone}</div>
            {row.original.provider && (
              <div className="text-muted-foreground text-xs">{row.original.provider}</div>
            )}
          </div>
        ),
      }),
      columnHelper.display({
        id: "display",
        header: "Відображення",
        cell: ({ row }) => {
          const badge = resolveDisplayBadge(row.original.source, row.original.status);
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                badge.className
              )}
            >
              {badge.label}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "agent",
        header: "Призначений агент",
        cell: ({ row }) => (
          <Select
            value={row.original.agent_id ? String(row.original.agent_id) : UNASSIGNED_VALUE}
            onValueChange={(value) => handleAssign(row.original.id, value)}
          >
            <SelectTrigger className="w-46">
              <SelectValue>{(value) => renderAgentLabel(value, agents)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNASSIGNED_VALUE}>Вибрати агента</SelectItem>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={String(agent.id)}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
      }),
      columnHelper.display({
        id: "forwarding",
        header: "Переадресація",
        cell: ({ row }) => {
          if (row.original.source !== "forward") {
            return <span className="text-muted-foreground">-</span>;
          }

          const isActive = row.original.status === "ready";
          return (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-block h-2 w-2 rounded-full",
                  isActive ? "bg-success" : "bg-warning"
                )}
              />
              <span>{isActive ? "Активна" : "Очікує підтвердження"}</span>
            </div>
          );
        },
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
      columnHelper.display({
        id: "actions",
        header: "Дії",
        cell: ({ row }) => <DeleteNumberDialog id={row.original.id} phone={row.original.phone} />,
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

  const renderAgentSelect = (number: AgentNumber) => (
    <Select
      value={number.agent_id ? String(number.agent_id) : UNASSIGNED_VALUE}
      onValueChange={(value) => handleAssign(number.id, value)}
    >
      <SelectTrigger className="w-full sm:w-46">
        <SelectValue>{(value) => renderAgentLabel(value, agents)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={UNASSIGNED_VALUE}>Вибрати агента</SelectItem>
        {agents.map((agent) => (
          <SelectItem key={agent.id} value={String(agent.id)}>
            {agent.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border">
      <div className="divide-border divide-y md:hidden">
        {numbers.map((number) => {
          const badge = resolveDisplayBadge(number.source, number.status);
          const dailyCap = formatDailyCap(number.daily_cap);

          return (
            <div key={number.id} className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{number.phone}</p>
                  {number.provider && (
                    <p className="text-muted-foreground truncate text-xs">{number.provider}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                      badge.className
                    )}
                  >
                    {badge.label}
                  </span>
                  <DeleteNumberDialog id={number.id} phone={number.phone} />
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-xs">Призначений агент</p>
                {renderAgentSelect(number)}
              </div>
              <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
                <span>
                  Напрямок: {DIRECTION_LABELS[number.direction]}
                  {dailyCap ? ` · ${dailyCap}` : ""}
                </span>
                {number.source === "forward" && (
                  <span className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "inline-block h-2 w-2 rounded-full",
                        number.status === "ready" ? "bg-success" : "bg-warning"
                      )}
                    />
                    {number.status === "ready" ? "Активна" : "Очікує підтвердження"}
                  </span>
                )}
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
                  <TableCell key={cell.id} className="px-4 py-3">
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
