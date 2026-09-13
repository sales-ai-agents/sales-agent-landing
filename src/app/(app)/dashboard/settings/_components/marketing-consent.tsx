"use client";

import { toast } from "sonner";

import { Switch } from "@/components/ui";
import { useUpdateMarketingConsent } from "@/lib/hooks";
import { handleMutationError } from "@/lib/mutation-error";

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
    <section className="border-border bg-background rounded-2xl border p-5">
      <h2 className="text-base font-semibold">Маркетингові розсилки</h2>
      <p className="text-muted-foreground mt-1 text-xs">
        Керуйте згодою на інформаційні та рекламні повідомлення
      </p>
      <div className="mt-4 flex items-center justify-between gap-4 border-t pt-4">
        <div>
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
    </section>
  );
};
