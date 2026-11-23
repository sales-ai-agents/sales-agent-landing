"use client";

import { useState } from "react";
import { Clock, Plus, Settings, Target, CardSim, type LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { useAccountTimeZone } from "@/lib/hooks";
import { cn, formatDateTime, formatUsd } from "@/lib/utils";
import type { LedgerEntry, LedgerKind } from "@dashboard/types";

interface KindMeta {
  title: string;
  icon: LucideIcon;
  tone: string;
}

const KIND_META: Record<LedgerKind, KindMeta> = {
  plan_refill: {
    title: "Бонус тарифу на рахунок",
    icon: Target,
    tone: "bg-warning/10 text-warning",
  },
  topup: { title: "Поповнення рахунку", icon: Plus, tone: "bg-success/10 text-success" },
  minutes: { title: "Хвилини понад тариф", icon: Clock, tone: "bg-primary/10 text-primary" },
  number: { title: "Номер понад тариф", icon: CardSim, tone: "bg-primary/10 text-primary" },
  admin: { title: "Коригування", icon: Settings, tone: "bg-muted text-muted-foreground" },
};

type LedgerFilter = "all" | "income" | "expense";

const FILTERS: { key: LedgerFilter; label: string }[] = [
  { key: "all", label: "Усі" },
  { key: "income", label: "Поповнення" },
  { key: "expense", label: "Списання" },
];

const matchesFilter = (entry: LedgerEntry, filter: LedgerFilter): boolean => {
  if (filter === "income") return entry.amount_usd > 0;
  if (filter === "expense") return entry.amount_usd < 0;
  return true;
};

interface LedgerRowProps {
  entry: LedgerEntry;
  timeZone?: string;
}

const LedgerRow = ({ entry, timeZone }: LedgerRowProps) => {
  const meta = KIND_META[entry.kind];
  const Icon = meta.icon;
  const isIncome = entry.amount_usd > 0;
  return (
    <li className="flex items-center gap-4 px-6 py-4">
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", meta.tone)}>
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <b className="font-medium">{meta.title}</b>
        <span className="text-muted-foreground text-sm">
          {formatDateTime(entry.created_at, timeZone)}
          {entry.note && ` · ${entry.note}`}
        </span>
      </span>
      <b className={cn("font-heading text-lg tabular-nums", isIncome && "text-success")}>
        {isIncome ? "+" : "−"}
        {formatUsd(Math.abs(entry.amount_usd))}
      </b>
    </li>
  );
};

const LedgerEmpty = () => (
  <div className="flex flex-col items-center gap-1 px-6 py-10 text-center">
    <b>Операцій ще немає</b>
    <p className="text-muted-foreground text-sm">
      Тут з&apos;являться поповнення рахунку, хвилини понад тариф і покупки номерів
    </p>
  </div>
);

export const LedgerList = ({ ledger }: { ledger: LedgerEntry[] }) => {
  const [filter, setFilter] = useState<LedgerFilter>("all");
  const timeZone = useAccountTimeZone();
  const entries = ledger.filter((entry) => matchesFilter(entry, filter));

  return (
    <Card id="history" className="gap-0 overflow-hidden p-0">
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 border-b">
        <CardTitle>Історія операцій</CardTitle>
        <Tabs value={filter} onValueChange={(value) => setFilter(value as LedgerFilter)}>
          <TabsList aria-label="Тип операцій">
            {FILTERS.map((item) => (
              <TabsTrigger key={item.key} value={item.key}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      {entries.length === 0 ? (
        <LedgerEmpty />
      ) : (
        <ul className="divide-border divide-y">
          {entries.map((entry) => (
            <LedgerRow key={entry.id} entry={entry} timeZone={timeZone} />
          ))}
        </ul>
      )}
    </Card>
  );
};
