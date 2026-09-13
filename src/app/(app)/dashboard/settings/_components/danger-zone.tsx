"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

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
    <section className="rounded-2xl border border-red-500/40 bg-red-500/5 p-5">
      <h2 className="text-destructive text-base font-semibold">Видалення акаунту</h2>
      <p className="text-muted-foreground mt-1 text-xs">
        Безповоротне видалення акаунту та всіх пов&apos;язаних даних
      </p>

      <div className="mt-4 flex flex-col justify-between gap-4 border-t border-red-500/20 pt-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-destructive mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-muted-foreground text-xs">
            Ми назавжди видалимо ваш акаунт, агентів, контакти, номери, журнал дзвінків, записи
            розмов, транскрипти та платежі. Відновити ці дані буде неможливо.
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="shrink-0"
          onClick={() => setIsOpen(true)}
        >
          Видалити акаунт
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              Видалити акаунт назавжди?
            </DialogTitle>
            <DialogDescription>
              Записи розмов, журнал дзвінків та всі персональні дані зникнуть без можливості
              відновлення. Щоб підтвердити, введіть пароль і слово {CONFIRM_KEYWORD}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="delete-password" className="text-xs">
                Пароль
              </Label>
              <Input
                id="delete-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={deleteAccount.isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="delete-confirm" className="text-xs">
                Введіть {CONFIRM_KEYWORD} для підтвердження
              </Label>
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
              {deleteAccount.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              Видалити назавжди
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
