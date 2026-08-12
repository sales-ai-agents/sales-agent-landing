"use client";

import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { CallLog, CallStatus } from "@/types";

const STATUS_CONFIG: Record<
  CallStatus,
  { label: string; variant: "success" | "warning" | "secondary" | "destructive" }
> = {
  completed: { label: "Completed", variant: "success" },
  missed: { label: "Missed", variant: "warning" },
  transferred: { label: "Transferred", variant: "secondary" },
  failed: { label: "Failed", variant: "destructive" },
};

interface CallLogDetailDrawerProps {
  callLog: CallLog;
  onClose: () => void;
}

export function CallLogDetailDrawer({ callLog, onClose }: CallLogDetailDrawerProps) {
  const statusConfig = STATUS_CONFIG[callLog.status];

  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Call Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <DetailField label="Customer">
            <p className="text-sm font-medium">{callLog.customerName}</p>
            <p className="text-muted-foreground text-sm">{callLog.phone}</p>
          </DetailField>

          <DetailField label="Status">
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          </DetailField>

          <DetailField label="Agent">
            <p className="text-sm font-medium">{callLog.agentName}</p>
          </DetailField>

          <DetailField label="Date & Time">
            <p className="text-sm font-medium">
              {callLog.date} at {callLog.time}
            </p>
          </DetailField>

          <DetailField label="Duration">
            <p className="text-sm font-medium">{callLog.duration}</p>
          </DetailField>

          <DetailField label="AI Summary">
            <p className="bg-muted rounded-md p-3 text-sm">{callLog.summary}</p>
          </DetailField>

          <DetailField label="CRM Sync">
            <Badge variant={callLog.crmSynced ? "success" : "warning"}>
              {callLog.crmSynced ? "Synced" : "Not synced"}
            </Badge>
          </DetailField>

          {callLog.duration !== "—" && (
            <DetailField label="Recording">
              <div className="bg-muted flex items-center gap-3 rounded-md p-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 cursor-pointer rounded-full"
                  aria-label="Play recording"
                >
                  <Play className="h-3 w-3" />
                </Button>
                <div className="bg-border h-2 flex-1 rounded-full">
                  <div className="bg-primary h-full w-0 rounded-full" />
                </div>
                <span className="text-muted-foreground text-xs">{callLog.duration}</span>
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
