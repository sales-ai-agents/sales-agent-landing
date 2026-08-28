"use client";

import { Button } from "@/components/ui";
import { useIntegrations } from "@dashboard/hooks";

interface CrmEntry {
  id: string;
  name: string;
  description: string;
  logo: React.ReactNode;
}

const KNOWN_CRMS: CrmEntry[] = [
  {
    id: "bitrix24",
    name: "Bitrix24",
    description: "Автоматична передача лідів, угод та активностей",
    logo: (
      <div className="flex h-[47px] w-[47px] items-center justify-center rounded-full bg-[#1a73e8]">
        <span className="text-xl font-bold text-white">24</span>
      </div>
    ),
  },
  {
    id: "keycrm",
    name: "KeyCRM",
    description: "Передача заявок, контактів та історії дзвінків",
    logo: (
      <div className="flex h-[47px] w-[47px] items-center justify-center rounded-full bg-[#005bff]">
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
          <path d="M7 5v14l7-7-7-7zm8 7 2-2v4l-2-2z" />
        </svg>
      </div>
    ),
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    description: "Створення лідів та угод з історією взаємодії",
    logo: (
      <div className="flex h-[47px] w-[47px] items-center justify-center rounded-full bg-black">
        <span className="text-xl font-bold text-white">P</span>
      </div>
    ),
  },
];

export const CrmConnectors = () => {
  const { data: integrations } = useIntegrations();
  const available = integrations?.available ?? [];

  const isConnected = (id: string) => available.find((a) => a.id === id)?.connected ?? false;

  return (
    <div className="border-border bg-background rounded-xl border p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold">CRM конектори</h3>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Підключайте популярні CRM-системи в один клік
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {KNOWN_CRMS.map((crm) => {
          const connected = isConnected(crm.id);
          return (
            <div
              key={crm.id}
              className="border-border bg-background flex flex-col rounded-xl border p-4"
            >
              <div className="flex items-center gap-3">
                {crm.logo}
                <div>
                  <p className="text-sm font-medium">{crm.name}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-green-500" : "bg-gray-400"}`}
                    />
                    <span className="text-muted-foreground text-xs">
                      {connected ? "Підключено" : "Не підключено"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mt-3 flex-1 text-xs">{crm.description}</p>

              <Button
                variant="outline"
                size="sm"
                className="text-primary border-primary/40 mt-4 w-full"
              >
                {connected ? "Відключити" : "Підключити"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
