import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import type { Agent, CallLog } from "@dashboard/types";
import { RecentCallRow } from "./recent-call-row";
interface RecentCallsCardProps {
  calls: CallLog[];
  agents: Agent[];
}
const HEADINGS = ["Клієнт", "Агент", "Тривалість", "Результат", "Час"] as const;
export const RecentCallsCard = ({ calls, agents }: RecentCallsCardProps) => (
  <Card className="gap-0 overflow-hidden p-0">
    <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 p-6">
      <CardTitle>Останні дзвінки</CardTitle>
      <Link
        className="text-primary text-sm font-medium hover:underline"
        href="/dashboard/call-logs"
      >
        Усі дзвінки →
      </Link>
    </CardHeader>
    {calls.length === 0 ? (
      <p className="text-muted-foreground px-6 py-8 text-center text-sm">Дзвінків поки немає</p>
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            {HEADINGS.map((heading) => (
              <TableHead key={heading}>{heading}</TableHead>
            ))}
            <TableHead className="w-10">
              <span className="sr-only">Дії</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => (
            <RecentCallRow key={call.id} call={call} agents={agents} />
          ))}
        </TableBody>
      </Table>
    )}
  </Card>
);
