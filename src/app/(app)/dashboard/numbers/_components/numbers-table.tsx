"use client";

import { useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { handleMutationError } from "@/lib/mutation-error";
import { NUMBER_ERROR_MESSAGES } from "@/lib/error-messages";
import { cn } from "@/lib/utils";
import { useUpdateNumber } from "@dashboard/hooks";
import type { Agent, AgentNumber } from "@dashboard/types";

import { DIRECTION_LABELS, formatDailyCap, resolveDisplayBadge } from "../_lib/labels";

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
            <SelectTrigger className="w-[190px]">
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
                  isActive ? "bg-green-600" : "bg-orange-500"
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
    <div className="border-border bg-background overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-muted-foreground px-4 py-3 text-left font-normal"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b last:border-0">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
