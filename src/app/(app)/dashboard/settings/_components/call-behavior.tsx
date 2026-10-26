"use client";

import { toast } from "sonner";

import { Switch } from "@/components/ui";
import { useUpdateProfile } from "@/lib/hooks";
import { handleMutationError } from "@/lib/mutation-error";

interface CallBehaviorProps {
  initialAiDisclosure: boolean;
  initialRecordNotice: boolean;
}

export const CallBehavior = ({ initialAiDisclosure, initialRecordNotice }: CallBehaviorProps) => {
  const updateProfile = useUpdateProfile();

  const aiDisclosure = updateProfile.data?.account?.ai_disclosure_upfront ?? initialAiDisclosure;
  const recordNotice = updateProfile.data?.account?.record_notice ?? initialRecordNotice;

  const handleAiDisclosureChange = (value: boolean): void => {
    updateProfile.mutate(
      { ai_disclosure_upfront: value },
      {
        onSuccess: () => toast.success("Налаштування збережено"),
        onError: (err) => handleMutationError(err),
      }
    );
  };

  const handleRecordNoticeChange = (value: boolean): void => {
    updateProfile.mutate(
      { record_notice: value },
      {
        onSuccess: () => toast.success("Налаштування збережено"),
        onError: (err) => handleMutationError(err),
      }
    );
  };

  return (
    <section className="border-border bg-background rounded-2xl border p-5">
      <h2 className="text-base font-semibold">Поведінка агента під час дзвінка</h2>
      <p className="text-muted-foreground mt-1 text-xs">
        Налаштування того, що агент повідомляє на початку розмови
      </p>

      <div className="mt-4 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium">Я віртуальний помічник</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Агент оголошує, що є ШІ, першою фразою — ще до будь-якого питання. На пряме «ви
              робот?» агент відповідає правдиво завжди, незалежно від цього перемикача.
            </p>
          </div>
          <Switch
            checked={aiDisclosure}
            onCheckedChange={handleAiDisclosureChange}
            disabled={updateProfile.isPending}
            aria-label="Оголошувати ШІ першою фразою"
          />
        </div>

        <div className="border-border border-t pt-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium">Попереджати про запис розмови</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Агент додає «Розмова записується» одразу після привітання. Це обов&apos;язок
                власника даних за законодавством — перемикач виконує його автоматично.
              </p>
            </div>
            <Switch
              checked={recordNotice}
              onCheckedChange={handleRecordNoticeChange}
              disabled={updateProfile.isPending}
              aria-label="Попереджати про запис розмови"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
