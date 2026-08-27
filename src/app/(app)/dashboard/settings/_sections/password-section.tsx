"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button, Input, Label } from "@/components/ui";
import { useChangePassword } from "@/lib/hooks";
import { AUTH_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/handle-mutation-error";

export function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const changePassword = useChangePassword();

  const canSubmit =
    currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

  function handleChange(): void {
    changePassword.mutate(
      { current_password: currentPassword, new_password: newPassword },
      {
        onSuccess: () => {
          toast.success("Пароль змінено");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (err) => handleMutationError(err, AUTH_ERROR_MESSAGES),
      }
    );
  }

  return (
    <section className="border-border bg-background rounded-2xl border p-5">
      <h2 className="text-base font-semibold">Змінити пароль</h2>
      <div className="mt-4 space-y-4">
        <div className="space-y-1">
          <Label htmlFor="current-password" className="text-xs">
            Поточний пароль
          </Label>
          <Input
            id="current-password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new-password" className="text-xs">
            Новий пароль
          </Label>
          <Input
            id="new-password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="confirm-password" className="text-xs">
            Підтвердити новий пароль
          </Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>
      <Button
        size="sm"
        className="mt-4"
        onClick={handleChange}
        disabled={!canSubmit || changePassword.isPending}
      >
        {changePassword.isPending ? "Оновлення..." : "Оновити пароль"}
      </Button>
    </section>
  );
}
