import { Badge, type BadgeProps } from "@/components/ui";
import type { CrmSyncState } from "@dashboard/types";

interface CrmView {
  label: string;
  variant: BadgeProps["variant"];
  dot: boolean;
}

const CRM_VIEWS: Partial<Record<CrmSyncState, CrmView>> = {
  synced: { label: "Синхронізовано", variant: "success", dot: true },
  failed: { label: "Помилка", variant: "destructive", dot: true },
  pending: { label: "Надсилаємо", variant: "warning", dot: false },
  skipped: { label: "Не надсилали", variant: "muted", dot: false },
  not_queued: { label: "Не надсилали", variant: "muted", dot: false },
};

export const CrmSyncBadge = ({ state }: { state: CrmSyncState | null | undefined }) => {
  const view = state ? CRM_VIEWS[state] : undefined;
  if (!view) return <span className="text-muted-foreground">—</span>;
  return (
    <Badge variant={view.variant} dot={view.dot}>
      {view.label}
    </Badge>
  );
};
