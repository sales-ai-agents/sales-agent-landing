"use client";

import { toast } from "sonner";

import { Switch } from "@/components/ui";
import { useUpdateMarketingConsent } from "@/lib/hooks";
import { handleMutationError } from "@/lib/mutation-error";
import { SettingsSection } from "./settings-section";

interface MarketingConsentSectionProps {
  initialGranted: boolean;
}

export const MarketingConsent = ({ initialGranted }: MarketingConsentSectionProps) => {
  const updateConsent = useUpdateMarketingConsent();
  const granted = updateConsent.data?.granted ?? initialGranted;

  const handleToggle = (value: boolean): void => {
    updateConsent.mutate(
      { granted: value },
      {
        onSuccess: (data) => {
          toast.success(
            data.granted ? "Ви підписані на розсилки" : "Ви відписані від рекламних розсилок"
          );
        },
        onError: (error) => handleMutationError(error),
      }
    );
  };

  return (
    <SettingsSection
      title="Маркетингові розсилки"
      description="Керуйте згодою на інформаційні та рекламні повідомлення"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Отримувати розсилки від calls4u.ai</p>
          <p className="text-muted-foreground text-xs">
            Новини, поради та спеціальні пропозиції. Згоду можна відкликати будь-коли.
          </p>
        </div>
        <Switch
          checked={granted}
          onCheckedChange={handleToggle}
          disabled={updateConsent.isPending}
          aria-label="Згода на маркетингові розсилки"
        />
      </div>
    </SettingsSection>
  );
};
