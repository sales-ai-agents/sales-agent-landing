"use client";

import { useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/components/ui";
import { useDeleteAccount } from "@/lib/hooks";
import { AUTH_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { SettingsSection } from "./settings-section";

const CONFIRM_KEYWORD = "DELETE";
const LOGIN_PATH = "/sign-in";

export const DangerZone = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const deleteAccount = useDeleteAccount();

  const canSubmit = password.length > 0 && confirmText === CONFIRM_KEYWORD;

  const handleOpenChange = (open: boolean): void => {
    if (deleteAccount.isPending) return;
    setIsOpen(open);
    if (!open) {
      setPassword("");
      setConfirmText("");
    }
  };

  const handleDelete = (): void => {
    if (!canSubmit) return;

    deleteAccount.mutate(
      { password, confirm: CONFIRM_KEYWORD },
      {
        onSuccess: () => window.location.assign(LOGIN_PATH),
        onError: (error) => handleMutationError(error, AUTH_ERROR_MESSAGES),
      }
    );
  };

  return (
    <SettingsSection
      destructive
      title="Видалення акаунту"
      description="Безповоротне видалення акаунту та всіх пов'язаних даних"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <TriangleAlert className="text-destructive size-5 shrink-0" aria-hidden="true" />
          <p className="text-muted-foreground text-sm">
            Ми назавжди видалимо ваш акаунт, агентів, контакти, номери, журнал дзвінків, записи
            розмов, транскрипти та платежі. Відновити ці дані буде неможливо.
          </p>
        </div>
        <Button variant="destructive" className="shrink-0" onClick={() => setIsOpen(true)}>
          Видалити акаунт
        </Button>
      </div>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <TriangleAlert className="size-5" aria-hidden="true" />
              Видалити акаунт назавжди?
            </DialogTitle>
            <DialogDescription>
              Записи розмов, журнал дзвінків та всі персональні дані зникнуть без можливості
              відновлення. Щоб підтвердити, введіть пароль і слово {CONFIRM_KEYWORD}.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="delete-password">Пароль</Label>
              <Input
                id="delete-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={deleteAccount.isPending}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="delete-confirm">Введіть {CONFIRM_KEYWORD} для підтвердження</Label>
              <Input
                id="delete-confirm"
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                placeholder={CONFIRM_KEYWORD}
                disabled={deleteAccount.isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={deleteAccount.isPending}
            >
              Скасувати
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!canSubmit || deleteAccount.isPending}
              aria-busy={deleteAccount.isPending}
            >
              {deleteAccount.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
              Видалити назавжди
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsSection>
  );
};
