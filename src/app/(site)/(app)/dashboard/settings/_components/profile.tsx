"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button, Input, Label } from "@/components/ui";
import { useUpdateProfile } from "@/lib/hooks";
import { AUTH_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { SettingsSection } from "./settings-section";

interface ProfileSectionProps {
  initialName: string;
  initialEmail: string;
}

export const Profile = ({ initialName, initialEmail }: ProfileSectionProps) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  const updateProfile = useUpdateProfile();

  const hasChanges = name !== initialName || email !== initialEmail;

  const handleSave = () => {
    const params: Record<string, string> = {};

    if (name !== initialName) params.name = name;
    if (email !== initialEmail) params.email = email;

    updateProfile.mutate(params, {
      onSuccess: () => toast.success("Профіль оновлено"),
      onError: (err) => handleMutationError(err, AUTH_ERROR_MESSAGES),
    });
  };

  return (
    <SettingsSection title="Інформація профілю" description="Оновіть дані вашого акаунту">
      <div className="flex flex-col gap-2">
        <Label htmlFor="profile-name">Повне ім&apos;я</Label>
        <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="profile-email">Електронна пошта</Label>
        <Input
          id="profile-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button
        className="self-start"
        onClick={handleSave}
        disabled={!hasChanges || updateProfile.isPending}
      >
        {updateProfile.isPending ? "Збереження..." : "Зберегти зміни"}
      </Button>
    </SettingsSection>
  );
};
