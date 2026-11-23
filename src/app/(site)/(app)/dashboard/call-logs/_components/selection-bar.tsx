import { Check } from "lucide-react";
import { Button } from "@/components/ui";

interface SelectionBarProps {
  count: number;
  isPending: boolean;
  onClear: () => void;
  onMarkProcessed: () => void;
}

export const SelectionBar = ({ count, isPending, onClear, onMarkProcessed }: SelectionBarProps) => (
  <div
    role="status"
    className="bg-primary/5 border-primary/10 flex flex-wrap items-center gap-3 border-b px-4 py-3 text-sm"
  >
    <b>Вибрано: {count}</b>
    <Button type="button" variant="link" size="xs" onClick={onClear}>
      Очистити
    </Button>
    <span className="grow" />
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onMarkProcessed}
      disabled={isPending}
    >
      <Check aria-hidden="true" />
      Позначити як оброблені ({count})
    </Button>
  </div>
);
