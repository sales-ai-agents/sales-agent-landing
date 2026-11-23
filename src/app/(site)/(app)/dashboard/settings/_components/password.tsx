"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button, Input, Label } from "@/components/ui";
import { useChangePassword } from "@/lib/hooks";
import { AUTH_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { SettingsSection } from "./settings-section";

export const Password = () => {
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePassword = useChangePassword();

  const canSubmit =
    currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

  const handleChange = () => {
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
  };

  return (
    <SettingsSection title="Змінити пароль">
      <div className="flex flex-col gap-2">
        <Label htmlFor="current-password">Поточний пароль</Label>
        <Input
          id="current-password"
          type="password"
          placeholder="••••••••"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="new-password">Новий пароль</Label>
        <Input
          id="new-password"
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirm-password">Підтвердити новий пароль</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <Button
        className="self-start"
        onClick={handleChange}
        disabled={!canSubmit || changePassword.isPending}
      >
        {changePassword.isPending ? "Оновлення..." : "Оновити пароль"}
      </Button>
    </SettingsSection>
  );
};
