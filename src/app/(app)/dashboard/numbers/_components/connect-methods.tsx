"use client";

import { Check, LucideShoppingCart, PhoneForwarded, Server } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui";
import { ConnectNumberDialog, type ConnectMethod } from "../../agents/_components/connect-number";

interface ConnectMethodsProps {
  onConnected: () => void;
}

interface MethodCard {
  method: ConnectMethod;
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  cta: string;
}

const METHOD_CARDS: MethodCard[] = [
  {
    method: "sip",
    title: "У мене вже є АТС",
    description:
      "Підключити свою телефонну систему (Binotel, Ringostat, Phonet, 3CX та ін.) через SIP.",
    icon: Server,
    features: ["Працює з більшістю АТС", "Вхідні та вихідні дзвінки", "Потрібно SIP-доступ"],
    cta: "Підключити АТС",
  },
  {
    method: "forward",
    title: "Приймати дзвінки на ваш номер",
    description: "Налаштуйте переадресацію з вашого номера на номер Calls4U.",
    icon: PhoneForwarded,
    features: [
      "Тільки вхідні дзвінки",
      "Дзвінки надходять до обраного агента",
      "Працює з будь-яким оператором",
    ],
    cta: "Налаштувати переадресацію",
  },
  {
    method: "buy",
    title: "Отримати номер Calls4U",
    description: "Візьміть новий номер для вхідних і вихідних дзвінків у межах вашого тарифу.",
    icon: LucideShoppingCart,
    features: ["Входить у ваш тариф", "Вхідні та вихідні дзвінки", "Працює одразу"],
    cta: "Отримати номер",
  },
];

export const ConnectMethods = ({ onConnected }: ConnectMethodsProps) => {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-medium">Як підключити номер?</h2>
        <p className="text-muted-foreground text-sm">
          Оберіть спосіб, який підходить для вашого бізнесу
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {METHOD_CARDS.map((card) => (
          <div
            key={card.method}
            className="border-border bg-background flex flex-col gap-6 rounded-xl border p-5"
          >
            <div className="space-y-4">
              <span className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-xl">
                <card.icon className="text-primary h-11 w-11" />
              </span>
              <h3 className="font-medium">{card.title}</h3>
              <p className="text-muted-foreground text-sm">{card.description}</p>
            </div>

            <ul className="space-y-3">
              {card.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-600">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <ConnectNumberDialog
                initialMethod={card.method}
                onConnected={onConnected}
                trigger={
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/50 text-primary w-full"
                  >
                    {card.cta}
                  </Button>
                }
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
