"use client";

import { toast } from "sonner";

import { Separator, Switch } from "@/components/ui";
import { useUpdateProfile } from "@/lib/hooks";
import { AUTH_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { SettingsSection } from "./settings-section";

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
        onError: (err) => handleMutationError(err, AUTH_ERROR_MESSAGES),
      }
    );
  };

  const handleRecordNoticeChange = (value: boolean): void => {
    updateProfile.mutate(
      { record_notice: value },
      {
        onSuccess: () => toast.success("Налаштування збережено"),
        onError: (err) => handleMutationError(err, AUTH_ERROR_MESSAGES),
      }
    );
  };

  return (
    <SettingsSection
      title="Поведінка агента під час дзвінка"
      description="Налаштування того, що агент повідомляє на початку розмови"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Я віртуальний помічник</p>
          <p className="text-muted-foreground text-xs">
            Агент оголошує, що є ШІ, першою фразою — ще до будь-якого питання. На пряме «ви робот?»
            агент відповідає правдиво завжди, незалежно від цього перемикача.
          </p>
        </div>
        <Switch
          checked={aiDisclosure}
          onCheckedChange={handleAiDisclosureChange}
          disabled={updateProfile.isPending}
          aria-label="Оголошувати ШІ першою фразою"
        />
      </div>
      <Separator />
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Попереджати про запис розмови</p>
          <p className="text-muted-foreground text-xs">
            Агент додає «Розмова записується» одразу після привітання. Це обов&apos;язок власника
            даних за законодавством — перемикач виконує його автоматично.
          </p>
        </div>
        <Switch
          checked={recordNotice}
          onCheckedChange={handleRecordNoticeChange}
          disabled={updateProfile.isPending}
          aria-label="Попереджати про запис розмови"
        />
      </div>
    </SettingsSection>
  );
};
