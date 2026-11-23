import { Badge, Card, CardTitle } from "@/components/ui";
import { useAccountTimeZone } from "@/lib/hooks";
import { cn, formatDateTime } from "@/lib/utils";
import type { CollectedDataItem } from "@dashboard/types";

interface CollectedDataPanelProps {
  items: CollectedDataItem[];
  isComplete: boolean;
}

const EMPTY_VALUE = "—";

const formatValue = ({ type, value }: CollectedDataItem, timeZone?: string): string => {
  if (!value) return EMPTY_VALUE;

  return type === "dateTime" ? formatDateTime(value, timeZone) : value;
};

export const CollectedDataPanel = ({ items, isComplete }: CollectedDataPanelProps) => {
  const timeZone = useAccountTimeZone();

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <CardTitle className="text-lg">Зібрані дані</CardTitle>
        {!isComplete && <Badge variant="warning">Не всі обов&apos;язкові поля</Badge>}
      </div>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.field_id} className={cn(item.type === "longText" && "sm:col-span-2")}>
            <dt className="text-muted-foreground text-xs">
              {item.label}
              {item.required && (
                <>
                  <span aria-hidden="true"> *</span>
                  <span className="sr-only"> (обов&apos;язкове)</span>
                </>
              )}
            </dt>
            <dd
              className={cn(
                "mt-1 text-sm font-medium whitespace-pre-wrap",
                item.required && !item.value && "text-destructive"
              )}
            >
              {formatValue(item, timeZone)}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
};
