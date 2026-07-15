"use client";

import { X, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <div
        className="bg-background w-full max-w-md overflow-y-auto border-l p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Call Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <DetailField label="Customer">
            <p className="font-medium">{callLog.customerName}</p>
            <p className="text-muted-foreground text-sm">{callLog.phone}</p>
          </DetailField>

          <DetailField label="Status">
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          </DetailField>

          <DetailField label="Agent">
            <p className="font-medium">{callLog.agentName}</p>
          </DetailField>

          <DetailField label="Date & Time">
            <p className="font-medium">
              {callLog.date} at {callLog.time}
            </p>
          </DetailField>

          <DetailField label="Duration">
            <p className="font-medium">{callLog.duration}</p>
          </DetailField>

          <div>
            <p className="text-muted-foreground mb-1 text-sm">AI Summary</p>
            <p className="bg-muted rounded-md p-3 text-sm">{callLog.summary}</p>
          </div>

          <DetailField label="CRM Sync">
            <Badge variant={callLog.crmSynced ? "success" : "warning"}>
              {callLog.crmSynced ? "Synced" : "Not synced"}
            </Badge>
          </DetailField>

          {callLog.duration !== "—" && (
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Recording</p>
              <div className="bg-muted flex items-center gap-3 rounded-md p-3">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                  <Play className="h-3 w-3" />
                </Button>
                <div className="bg-border h-2 flex-1 rounded-full">
                  <div className="bg-primary h-full w-0 rounded-full" />
                </div>
                <span className="text-xs">{callLog.duration}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-muted-foreground text-sm">{label}</p>
      {children}
    </div>
  );
}
