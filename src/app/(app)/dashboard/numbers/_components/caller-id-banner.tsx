"use client";

import { PhoneOutgoing } from "lucide-react";

import { Button } from "@/components/ui";
import { formatUaPhone } from "@/lib/utils";

import { ConnectNumberDialog } from "../../agents/_components/connect-number";

interface CallerIdBannerProps {
  phone: string;
  isOwn: boolean;
  used: number;
  onConnected: () => void;
}

interface BannerContent {
  text: string;
  cta: string | null;
}

const resolveContent = (phone: string, isOwn: boolean, used: number): BannerContent => {
  const formatted = formatUaPhone(phone);

  if (isOwn) {
    return {
      text: `Коли агент дзвонить, ваші клієнти бачать номер ${formatted}`,
      cta: null,
    };
  }

  if (used > 0) {
    return {
      text: "Ваш номер працює лише на вхідні. Щоб клієнти бачили ваш номер, отримайте номер у нас.",
      cta: "Отримати номер",
    };
  }

  return {
    text: "Агент поки не дзвонить",
    cta: "Отримати свій номер",
  };
};

export const CallerIdBanner = ({ phone, isOwn, used, onConnected }: CallerIdBannerProps) => {
  if (!phone) return null;

  const { text, cta } = resolveContent(phone, isOwn, used);

  return (
    <div className="bg-primary/10 flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <PhoneOutgoing className="text-primary mt-0.5 h-5 w-5 shrink-0" />
        <p className="text-sm">{text}</p>
      </div>
      {cta && (
        <ConnectNumberDialog
          initialMethod="buy"
          onConnected={onConnected}
          trigger={
            <Button variant="outline" size="sm" className="shrink-0">
              {cta}
            </Button>
          }
        />
      )}
    </div>
  );
};
