"use client";

import Link from "next/link";
import { toast } from "sonner";

import { TriangleAlert } from "lucide-react";
import {
  Badge,
  Card,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsList,
  TabsTrigger,
  type BadgeProps,
} from "@/components/ui";
import { handleMutationError } from "@/lib/mutation-error";
import { NUMBER_ERROR_MESSAGES } from "@/lib/error-messages";
import { cn } from "@/lib/utils";
import { useUpdateNumber } from "@dashboard/hooks";
import type {
  Agent,
  AgentNumber,
  NumberDirection,
  NumberSource,
  NumberStatus,
  UpdateNumberParams,
} from "@dashboard/types";
import {
  DIRECTION_LABELS,
  STATUS_LABELS,
  formatDailyCap,
  formatNumberHours,
  resolveCallerIdBadge,
  resolveNumberTypeLabel,
} from "../_lib/labels";
import { DeleteNumberDialog } from "./delete-number-dialog";
import { NumberScheduleDialog } from "./number-schedule-dialog";

interface NumbersTableProps {
  numbers: AgentNumber[];
  agents: Agent[];
}

const UNASSIGNED_VALUE = "0";
const UNASSIGNED_LABEL = "Вибрати агента";
const DIRECTIONS: NumberDirection[] = ["inbound", "outbound", "both"];
const HEADINGS = [
  "Номер",
  "Відображення",
  "Призначений агент",
  "Напрямок",
  "Статус",
  "Активний",
  "Дії",
];

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

const SOURCE_CHIPS: Record<NumberSource, { label: string; variant: BadgeVariant }> = {
  assigned: { label: "Наш номер", variant: "secondary" },
  forward: { label: "Переадресація", variant: "warning" },
  sip: { label: "Свій SIP", variant: "muted" },
};

const STATUS_VARIANTS: Record<NumberStatus, BadgeVariant> = {
  ready: "success",
  verification_required: "warning",
  disabled: "muted",
};

const renderAgentLabel = (value: string | null, agents: Agent[]): string =>
  agents.find((item) => String(item.id) === value)?.name ?? UNASSIGNED_LABEL;

const NumberLimits = ({ number }: { number: AgentNumber }) => {
  const details = [formatNumberHours(number), formatDailyCap(number.daily_cap)].filter(Boolean);
  if (details.length === 0) return null;
  return <div className="text-muted-foreground mt-1 text-xs">{details.join(" · ")}</div>;
};

type UpdateHandler = (number: AgentNumber, params: UpdateNumberParams, message: string) => void;

interface AgentCellProps {
  number: AgentNumber;
  agents: Agent[];
  onAssign: (number: AgentNumber, value: string | null) => void;
}

const AgentCell = ({ number, agents, onAssign }: AgentCellProps) => {
  const hasAgents = agents.length > 0;
  return (
    <TableCell className="max-w-60">
      <Select
        value={number.agent_id ? String(number.agent_id) : UNASSIGNED_VALUE}
        onValueChange={(value) => onAssign(number, value)}
        disabled={!hasAgents}
      >
        <SelectTrigger className="w-full" aria-label={`Агент на номері ${number.phone}`}>
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
      {!hasAgents && (
        <p className="text-muted-foreground mt-1.5 text-xs whitespace-normal">
          Спершу{" "}
          <Link className="text-primary hover:underline" href="/dashboard/agents/create">
            створіть агента
          </Link>
          , щоб призначити його на номер.
        </p>
      )}
      {hasAgents && number.agent_id === 0 && (
        <p className="text-destructive mt-1.5 flex items-center gap-1.5 text-xs">
          <TriangleAlert className="size-3.5" aria-hidden="true" />
          Виберіть агента
        </p>
      )}
    </TableCell>
  );
};

const DirectionCell = ({ number, onUpdate }: { number: AgentNumber; onUpdate: UpdateHandler }) => (
  <TableCell>
    <Tabs
      value={number.direction}
      onValueChange={(value) => {
        if (value !== number.direction) {
          onUpdate(number, { direction: value as NumberDirection }, "Напрямок оновлено");
        }
      }}
      className={cn(!number.is_active && "opacity-50")}
    >
      <TabsList aria-label={`Напрямок номера ${number.phone}`} className="h-9">
        {DIRECTIONS.map((direction) => (
          <TabsTrigger key={direction} value={direction} className="px-3 text-xs">
            {DIRECTION_LABELS[direction]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
    <NumberLimits number={number} />
  </TableCell>
);

interface NumberRowProps {
  number: AgentNumber;
  agents: Agent[];
  onUpdate: UpdateHandler;
  onAssign: (number: AgentNumber, value: string | null) => void;
}

const NumberRow = ({ number, agents, onUpdate, onAssign }: NumberRowProps) => {
  const source = SOURCE_CHIPS[number.source];
  const callerId = resolveCallerIdBadge(number.caller_id);
  return (
    <TableRow>
      <TableCell>
        <b className="tabular-nums">{number.phone}</b>
        <br />
        <span className="text-muted-foreground text-xs">
          {number.provider || resolveNumberTypeLabel(number)}
        </span>
      </TableCell>
      <TableCell>
        <Badge variant={source.variant} title={callerId.hint ?? callerId.label}>
          {source.label}
        </Badge>
      </TableCell>
      <AgentCell number={number} agents={agents} onAssign={onAssign} />
      <DirectionCell number={number} onUpdate={onUpdate} />
      <TableCell>
        <Badge variant={STATUS_VARIANTS[number.status]} dot>
          {STATUS_LABELS[number.status]}
        </Badge>
      </TableCell>
      <TableCell>
        <label className="flex items-center gap-2 text-sm font-medium">
          <Switch
            checked={number.is_active}
            aria-label={`Номер ${number.phone} активний`}
            onCheckedChange={(checked) =>
              onUpdate(
                number,
                { is_active: checked },
                checked ? "Номер увімкнено" : "Номер вимкнено"
              )
            }
          />
          {number.is_active ? "Так" : "Ні"}
        </label>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {number.direction !== "inbound" && <NumberScheduleDialog number={number} />}
          <DeleteNumberDialog id={number.id} phone={number.phone} source={number.source} />
        </div>
      </TableCell>
    </TableRow>
  );
};

export const NumbersTable = ({ numbers, agents }: NumbersTableProps) => {
  const updateNumber = useUpdateNumber();

  const update: UpdateHandler = (number, params, successMessage) => {
    updateNumber.mutate(
      { id: number.id, ...params },
      {
        onSuccess: () => toast.success(successMessage),
        onError: (error) => handleMutationError(error, NUMBER_ERROR_MESSAGES),
      }
    );
  };

  const handleAssign = (number: AgentNumber, value: string | null): void => {
    if (value === null) return;
    const currentValue = number.agent_id ? String(number.agent_id) : UNASSIGNED_VALUE;
    if (value === currentValue) return;
    update(number, { agent_id: Number(value) }, "Агента оновлено");
  };

  return (
    <Card className="overflow-hidden p-0">
      <Table className="min-w-225">
        <TableHeader>
          <TableRow>
            {HEADINGS.map((heading) => (
              <TableHead key={heading}>{heading}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {numbers.map((number) => (
            <NumberRow
              key={number.id}
              number={number}
              agents={agents}
              onUpdate={update}
              onAssign={handleAssign}
            />
          ))}
        </TableBody>
      </Table>
      <p className="text-muted-foreground border-t px-4 py-3 text-sm">
        Показано 1-{numbers.length} з {numbers.length} номерів
      </p>
    </Card>
  );
};
