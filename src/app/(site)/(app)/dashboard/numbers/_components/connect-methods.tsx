"use client";

import { Check, PhoneForwarded, Server, ShoppingCart, type LucideIcon } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils";
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
      "Дзвінки будуть надходити до обраного агента",
      "Працює з будь-яким оператором",
    ],
    cta: "Налаштувати переадресацію",
  },
  {
    method: "buy",
    title: "Отримати номер у Calls4U",
    description: "Номер Calls4U працює одразу на вхідні й вихідні, і клієнти бачать саме його.",
    icon: ShoppingCart,
    features: ["Готовий одразу", "Вхідні та вихідні дзвінки", "Клієнти бачать саме цей номер"],
    cta: "Отримати номер",
  },
];

const MethodTile = ({ card, onConnected }: { card: MethodCard; onConnected: () => void }) => {
  const Icon = card.icon;
  return (
    <Card className={cn("flex flex-col gap-4 p-6", card.method === "buy" && "ring-primary ring-2")}>
      <div className="flex items-start justify-between gap-2">
        <span className="bg-primary/10 text-primary grid size-11 place-items-center rounded-full">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        {card.method === "buy" && <Badge variant="secondary">Рекомендуємо</Badge>}
      </div>
      <h3 className="font-heading text-xl">{card.title}</h3>
      <p className="text-muted-foreground text-sm">{card.description}</p>
      <ul className="flex flex-1 flex-col gap-2 text-sm">
        {card.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="text-success mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
      <ConnectNumberDialog
        initialMethod={card.method}
        onConnected={onConnected}
        trigger={<Button variant="outline">{card.cta}</Button>}
      />
    </Card>
  );
};

export const ConnectMethods = ({ onConnected }: ConnectMethodsProps) => (
  <section className="flex flex-col gap-4">
    <div className="flex flex-col gap-1 px-1 pt-2">
      <h2 className="font-heading text-3xl">Як підключити номер?</h2>
      <p className="text-muted-foreground">Оберіть спосіб, який підходить для вашого бізнесу</p>
    </div>
    <div className="grid gap-4 lg:grid-cols-3">
      {METHOD_CARDS.map((card) => (
        <MethodTile key={card.method} card={card} onConnected={onConnected} />
      ))}
    </div>
  </section>
);
