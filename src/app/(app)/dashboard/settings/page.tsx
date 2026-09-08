"use client";

import { useMe } from "@/lib/hooks";
import { PageError, PageLoading } from "@/components/dashboard";
import { Business } from "./_components/business";
import { Profile } from "./_components/profile";
import { Password } from "./_components/password";
import { Notifications } from "./_components/notifications";
import { Timezone } from "./_components/timezone";

const SettingsPage = () => {
  const { data: account, isLoading, error, refetch } = useMe();

  if (isLoading) return <PageLoading />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Профіль / Налаштування</h1>
        <p className="text-muted-foreground text-sm">Керування вашим акаунтом та налаштування</p>
      </div>

      <Timezone initialTimezone={account?.timezone ?? null} />

      <Business
        initialCompany={account?.company ?? ""}
        initialShortName={account?.short_name ?? ""}
        initialWebsite={account?.website ?? ""}
        initialLanguage={account?.agent_language ?? "uk"}
      />

      <Profile initialName={account?.name ?? ""} initialEmail={account?.email ?? ""} />

      <Password />

      <Notifications />

      {/*AFTER MVP*/}
      {/*<Team />*/}
    </div>
  );
};

export default SettingsPage;
