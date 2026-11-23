"use client";

import { PhoneForwarded } from "lucide-react";
import { Alert, AlertDescription, Button } from "@/components/ui";
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
    <Alert variant="info" className="flex items-center gap-3">
      <PhoneForwarded aria-hidden="true" />
      <AlertDescription className="flex-1">
        <p>{text}</p>
      </AlertDescription>
      {cta && (
        <ConnectNumberDialog
          initialMethod="buy"
          onConnected={onConnected}
          trigger={
            <Button variant="secondary" size="sm">
              {cta}
            </Button>
          }
        />
      )}
    </Alert>
  );
};
