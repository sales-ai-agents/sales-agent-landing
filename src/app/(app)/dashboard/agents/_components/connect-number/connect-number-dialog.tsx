"use client";

import { useState } from "react";
import { Phone, PhoneForwarded, Server } from "lucide-react";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui";

import type { ConnectMethod } from "./constants";
import { SipFlow } from "./sip-flow";
import { ForwardFlow } from "./forward-flow";
import { BuyFlow } from "./buy-flow";

interface ConnectNumberDialogProps {
  agentId?: number;
  initialMethod?: ConnectMethod;
  onConnected?: (numberId: number) => void;
  trigger: React.ReactElement;
}

interface MethodCard {
  method: ConnectMethod;
  title: string;
  description: string;
  icon: typeof Phone;
}

const METHOD_CARDS: MethodCard[] = [
  {
    method: "sip",
    title: "У мене вже є АТС",
    description: "Підключити свою телефонну систему через SIP.",
    icon: Server,
  },
  {
    method: "forward",
    title: "Приймати дзвінки на ваш номер",
    description: "Налаштуйте переадресацію з вашого номера на номер Calls4U.",
    icon: PhoneForwarded,
  },
  {
    method: "buy",
    title: "Купити номер у Calls4U",
    description: "Отримайте новий номер для вихідних і вхідних дзвінків.",
    icon: Phone,
  },
];

export const ConnectNumberDialog = ({
  agentId,
  initialMethod,
  onConnected,
  trigger,
}: ConnectNumberDialogProps) => {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<ConnectMethod | null>(initialMethod ?? null);

  const reset = (): void => setMethod(initialMethod ?? null);

  const handleOpenChange = (next: boolean): void => {
    setOpen(next);
    if (!next) reset();
  };

  const handleDone = (numberId: number): void => {
    onConnected?.(numberId);
    handleOpenChange(false);
  };

  const handleCancel = (): void => handleOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-xl">
        {method === null && (
          <div className="space-y-4">
            <DialogTitle>Підключити номер</DialogTitle>
            <div className="space-y-2">
              {METHOD_CARDS.map((card) => (
                <button
                  key={card.method}
                  type="button"
                  onClick={() => setMethod(card.method)}
                  className="border-border hover:border-primary/50 flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors"
                >
                  <span className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <card.icon className="text-primary h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{card.title}</p>
                    <p className="text-muted-foreground text-xs">{card.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {method === "sip" && (
          <SipFlow agentId={agentId} onDone={handleDone} onCancel={handleCancel} />
        )}
        {method === "forward" && (
          <ForwardFlow agentId={agentId} onDone={handleDone} onCancel={handleCancel} />
        )}
        {method === "buy" && (
          <BuyFlow agentId={agentId} onDone={handleDone} onCancel={handleCancel} />
        )}
      </DialogContent>
    </Dialog>
  );
};
