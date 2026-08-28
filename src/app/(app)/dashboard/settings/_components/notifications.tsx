"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { toast } from "sonner";

import { Button, Input, Switch } from "@/components/ui";
import { useNotifications, useUpdateNotifications } from "@dashboard/hooks";
import { handleMutationError } from "@/lib/mutation-error";
import type { NotificationSetting } from "@dashboard/types";

const KIND_LABELS: Record<string, { title: string; description: string }> = {
  escalation: {
    title: "Ескалації",
    description: "Сповіщення, коли агент передає дзвінок на оператора",
  },
  limit_exhausted: {
    title: "Закінчення ліміту хвилин",
    description: "Сповіщення, коли літ мінливість до ліміту або білінговим рахунок",
  },
};

interface NotificationRowProps {
  setting: NotificationSetting;
  onChange: (updated: Partial<NotificationSetting>) => void;
}

const NotificationRow = ({ setting, onChange }: NotificationRowProps) => {
  const labels = KIND_LABELS[setting.kind] ?? { title: setting.kind, description: "" };

  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-4 border-b py-3 last:border-0">
      <div>
        <p className="text-sm font-medium">{labels.title}</p>
        <p className="text-muted-foreground text-xs">{labels.description}</p>
      </div>
      <Switch
        checked={setting.email_enabled}
        onCheckedChange={(val) => onChange({ email_enabled: val })}
        aria-label={`Email для ${labels.title}`}
      />
      <Input
        value={setting.email}
        onChange={(e) => onChange({ email: e.target.value })}
        placeholder="email@example.com"
        className="text-sm"
      />
      <Switch
        checked={setting.telegram_enabled}
        onCheckedChange={(val) => onChange({ telegram_enabled: val })}
        aria-label={`Telegram для ${labels.title}`}
      />
      <Input
        value={setting.telegram}
        onChange={(e) => onChange({ telegram: e.target.value })}
        placeholder="@username"
        className="text-sm"
      />
    </div>
  );
};

export const Notifications = () => {
  const { data: notifications } = useNotifications();
  const updateNotifications = useUpdateNotifications();

  const [local, setLocal] = useState<NotificationSetting[] | null>(null);

  const data = local ?? notifications;

  const handleChange = (kind: string, updated: Partial<NotificationSetting>) => {
    const base = local ?? notifications ?? [];
    setLocal(base.map((item) => (item.kind === kind ? { ...item, ...updated } : item)));
  };

  const handleSave = () => {
    if (!data) return;

    updateNotifications.mutate(
      { notifications: data },
      {
        onSuccess: () => {
          toast.success("Сповіщення збережено");
          setLocal(null);
        },
        onError: (err) => handleMutationError(err),
      }
    );
  };

  if (!data?.length) return null;

  return (
    <section className="border-border bg-background rounded-2xl border p-5">
      <h2 className="text-base font-semibold">Сповіщення</h2>
      <p className="text-muted-foreground mt-1 text-xs">
        Налаштуйте, куди та про що ви хочете отримувати сповіщення
      </p>
      <div className="mt-4">
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 border-b pb-2">
          <p className="text-muted-foreground text-xs">Тип сповіщення</p>
          <p className="text-muted-foreground text-xs">Email</p>
          <div />
          <p className="text-muted-foreground text-xs">Telegram</p>
          <div />
        </div>
        {data.map((setting) => (
          <NotificationRow
            key={setting.kind}
            setting={setting}
            onChange={(updated) => handleChange(setting.kind, updated)}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3">
        <Info className="text-primary h-4 w-4 shrink-0" />
        <p className="text-muted-foreground text-xs">
          Сповіщення про пропущені дзвінки не буде. Ми фокусуємось на важливих подіях
        </p>
      </div>
      <Button
        size="sm"
        className="mt-4"
        onClick={handleSave}
        disabled={updateNotifications.isPending}
      >
        {updateNotifications.isPending ? "Збереження..." : "Зберегти"}
      </Button>
    </section>
  );
};
