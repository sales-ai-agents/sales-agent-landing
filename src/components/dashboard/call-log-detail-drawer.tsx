"use client";

import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getOutcomeConfig, formatDuration } from "@/lib/call-utils";
import type { CallLog } from "@/types";

interface CallLogDetailDrawerProps {
  callLog: CallLog;
  onClose: () => void;
}

export function CallLogDetailDrawer({ callLog, onClose }: CallLogDetailDrawerProps) {
  const outcomeConfig = getOutcomeConfig(callLog.outcome);
  const duration = formatDuration(callLog.duration_sec);
  const createdAt = new Date(callLog.created_at);

  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Деталі дзвінка</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <DetailField label="Компанія">
            <p className="text-sm font-medium">{callLog.company_name}</p>
            <p className="text-muted-foreground text-sm">{callLog.phone}</p>
          </DetailField>

          <DetailField label="Результат">
            <Badge variant={outcomeConfig.variant}>{outcomeConfig.label}</Badge>
          </DetailField>

          <DetailField label="Ніша">
            <p className="text-sm font-medium">{callLog.niche}</p>
          </DetailField>

          <DetailField label="Дата та час">
            <p className="text-sm font-medium">
              {createdAt.toLocaleDateString("uk-UA")} о{" "}
              {createdAt.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </DetailField>

          <DetailField label="Тривалість">
            <p className="text-sm font-medium">{duration}</p>
          </DetailField>

          <DetailField label="Кількість реплік">
            <p className="text-sm font-medium">{callLog.turn_count}</p>
          </DetailField>

          <DetailField label="Зустріч заплановано">
            <Badge variant={callLog.meeting_scheduled ? "success" : "warning"}>
              {callLog.meeting_scheduled ? "Так" : "Ні"}
            </Badge>
          </DetailField>

          <DetailField label="AI Підсумок">
            <p className="bg-muted rounded-md p-3 text-sm">{callLog.analysis_text}</p>
          </DetailField>

          {duration !== "—" && (
            <DetailField label="Запис">
              <div className="bg-muted flex items-center gap-3 rounded-md p-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 cursor-pointer rounded-full"
                  aria-label="Відтворити запис"
                >
                  <Play className="h-3 w-3" />
                </Button>
                <div className="bg-border h-2 flex-1 rounded-full">
                  <div className="bg-primary h-full w-0 rounded-full" />
                </div>
                <span className="text-muted-foreground text-xs">{duration}</span>
              </div>
            </DetailField>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</p>
      {children}
    </div>
  );
}
