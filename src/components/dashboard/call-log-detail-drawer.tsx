"use client";

import { Play, Bot, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getOutcomeConfig } from "@/app/(app)/_lib/call-outcome-display";
import { formatDuration, cn } from "@/lib/utils";
import { useCallDetail } from "@dashboard/hooks/use-call-detail";

interface CallLogDetailDrawerProps {
  callId: string;
  onClose: () => void;
}

export function CallLogDetailDrawer({ callId, onClose }: CallLogDetailDrawerProps) {
  const { data: call, isLoading } = useCallDetail(callId);

  const outcomeConfig = getOutcomeConfig(call?.outcome ?? null);
  const duration = formatDuration(call?.duration_sec ?? null);
  const createdAt = call ? new Date(call.created_at) : null;

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

        {isLoading ? (
          <div className="mt-6 space-y-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="bg-muted h-3 w-20 animate-pulse rounded" />
                <div className="bg-muted h-5 w-48 animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : !call ? (
          <p className="text-muted-foreground mt-6 text-sm">Дзвінок не знайдено</p>
        ) : (
          <div className="mt-6 space-y-5">
            <DetailField label="Компанія">
              <p className="text-sm font-medium">{call.company_name}</p>
              <p className="text-muted-foreground text-sm">{call.phone}</p>
            </DetailField>

            <DetailField label="Результат">
              <Badge variant={outcomeConfig.variant}>{outcomeConfig.label}</Badge>
            </DetailField>

            <DetailField label="Ніша">
              <p className="text-sm font-medium">{call.niche}</p>
            </DetailField>

            <DetailField label="Дата та час">
              {createdAt && (
                <p className="text-sm font-medium">
                  {createdAt.toLocaleDateString("uk-UA")} о{" "}
                  {createdAt.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
            </DetailField>

            <DetailField label="Тривалість">
              <p className="text-sm font-medium">{duration}</p>
            </DetailField>

            <DetailField label="Кількість реплік">
              <p className="text-sm font-medium">{call.turn_count}</p>
            </DetailField>

            <DetailField label="Зустріч заплановано">
              <Badge variant={call.meeting_scheduled ? "success" : "warning"}>
                {call.meeting_scheduled ? "Так" : "Ні"}
              </Badge>
            </DetailField>

            <DetailField label="AI Підсумок">
              <p className="bg-muted rounded-md p-3 text-sm">
                {call.analysis_text ?? "Немає даних"}
              </p>
            </DetailField>

            {duration !== "—" && (
              <DetailField label="Запис">
                <div className="bg-muted flex items-center gap-3 rounded-md p-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
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

            <DetailField label="Розмова">
              {call.transcript?.length ? (
                <div className="space-y-3">
                  {call.transcript.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex gap-2",
                        msg.role === "assistant" ? "justify-start" : "justify-end"
                      )}
                    >
                      {msg.role === "assistant" && (
                        <div className="bg-primary/5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                          <Bot className="text-primary h-3 w-3" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                          msg.role === "assistant"
                            ? "bg-muted text-foreground"
                            : "bg-primary text-primary-foreground"
                        )}
                      >
                        {msg.content}
                      </div>
                      {msg.role === "user" && (
                        <div className="bg-muted flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                          <User className="text-muted-foreground h-3 w-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Транскрипт відсутній</p>
              )}
            </DetailField>
          </div>
        )}
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
