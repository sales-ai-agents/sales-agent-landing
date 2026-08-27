"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button, Input, Label } from "@/components/ui";
import { useUpdateProfile } from "@/lib/hooks";
import { AUTH_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/handle-mutation-error";

interface ProfileSectionProps {
  initialName: string;
  initialEmail: string;
}

const Profile = ({ initialName, initialEmail }: ProfileSectionProps) => {
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
    <section className="border-border bg-background rounded-2xl border p-5">
      <h2 className="text-base font-semibold">Інформація профілю</h2>
      <p className="text-muted-foreground mt-1 text-xs">Оновіть дані вашого акаунту</p>
      <div className="mt-4 space-y-4">
        <div className="space-y-1">
          <Label htmlFor="profile-name" className="text-xs">
            Повне ім&apos;я
          </Label>
          <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="profile-email" className="text-xs">
            Електронна пошта
          </Label>
          <Input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <Button
        size="sm"
        className="mt-4"
        onClick={handleSave}
        disabled={!hasChanges || updateProfile.isPending}
      >
        {updateProfile.isPending ? "Збереження..." : "Зберегти зміни"}
      </Button>
    </section>
  );
};

export default Profile;
