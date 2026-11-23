"use client";

import { Check, Copy, Eye, type LucideIcon } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { CLAUDE_CONNECTOR_URL } from "@/lib/constants";
import { useCopyToClipboard } from "../_lib/use-copy-to-clipboard";
import {
  CLAUDE_CAN_DO,
  CLAUDE_CAN_SEE,
  CLAUDE_CHAT_STEPS,
  CLAUDE_CODE_COMMAND,
  CLAUDE_CODE_STEPS,
  type ConnectorStep,
} from "../_lib/claude-connector";

const CopyBlock = ({ value }: { value: string }) => {
  const { copied, copy } = useCopyToClipboard();
  return (
    <div className="bg-muted mt-2 flex flex-wrap items-center justify-between gap-2 rounded-2xl p-3">
      <code className="min-w-0 flex-1 font-mono text-xs break-all">{value}</code>
      <Button variant="secondary" size="sm" onClick={() => copy(value)}>
        <Copy aria-hidden="true" />
        {copied ? "Скопійовано" : "Копіювати"}
      </Button>
    </div>
  );
};

interface StepListProps {
  steps: readonly ConnectorStep[];
  copyValue: string;
}

const StepList = ({ steps, copyValue }: StepListProps) => (
  <ol className="flex flex-col gap-4">
    {steps.map((step, index) => (
      <li key={step.title} className="flex gap-3">
        <span className="bg-primary/10 text-primary grid size-7 shrink-0 place-items-center rounded-full text-sm font-medium">
          {index + 1}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <b className="font-medium">{step.title}</b>
          <p className="text-muted-foreground text-sm">{step.description}</p>
          {index === 0 && <CopyBlock value={copyValue} />}
        </div>
      </li>
    ))}
  </ol>
);

interface CapabilityListProps {
  title: string;
  items: readonly string[];
  icon: LucideIcon;
}

const CapabilityList = ({ title, items, icon: Icon }: CapabilityListProps) => (
  <div className="flex flex-col gap-2">
    <span className="caption text-muted-foreground">{title}</span>
    <ul className="flex flex-col gap-1.5 text-sm">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <Icon className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

interface ClaudeConnectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClaudeConnectorDialog = ({ open, onOpenChange }: ClaudeConnectorDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>Підключити Calls4U до Claude</DialogTitle>
        <DialogDescription>
          Після підключення Claude бачить ваші дзвінки, агентів і контакти та відповідає на питання
          про них прямо в чаті
        </DialogDescription>
      </DialogHeader>
      <Tabs defaultValue="chat">
        <TabsList>
          <TabsTrigger value="chat">Чат Claude</TabsTrigger>
          <TabsTrigger value="code">Claude Code</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="mt-4">
          <StepList steps={CLAUDE_CHAT_STEPS} copyValue={CLAUDE_CONNECTOR_URL} />
        </TabsContent>
        <TabsContent value="code" className="mt-4">
          <StepList steps={CLAUDE_CODE_STEPS} copyValue={CLAUDE_CODE_COMMAND} />
        </TabsContent>
      </Tabs>
      <div className="bg-muted/50 grid gap-4 rounded-2xl p-4 sm:grid-cols-2">
        <CapabilityList title="Бачити" items={CLAUDE_CAN_SEE} icon={Eye} />
        <CapabilityList title="Робити, лише з вашого дозволу" items={CLAUDE_CAN_DO} icon={Check} />
      </div>
    </DialogContent>
  </Dialog>
);
