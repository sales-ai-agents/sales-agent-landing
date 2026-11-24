"use client";

import { useMe } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { PageError, PageHead, PageLoading } from "@/components/dashboard";
import { Business } from "./_components/business";
import { CallBehavior } from "./_components/call-behavior";
import { ConnectedAssistants } from "./_components/connected-assistants";
import { Profile } from "./_components/profile";
import { Password } from "./_components/password";
import { Notifications } from "./_components/notifications";
import { MarketingConsent } from "./_components/marketing-consent";
import { DangerZone } from "./_components/danger-zone";
import { Team } from "./_components/team";
import { Timezone } from "./_components/timezone";
import { VerificationSection } from "./_components/verification";

const DEFAULT_RETENTION_DAYS = 90;
const ANCHOR_CLASS = "scroll-mt-6";
const SECTIONS = [
  { id: "s-time", label: "Таймзона" },
  { id: "s-notify", label: "Сповіщення" },
  { id: "s-team", label: "Команда / ролі" },
  { id: "s-biz", label: "Дані бізнесу" },
  { id: "s-behave", label: "Поведінка агента" },
  { id: "s-assistants", label: "Підключені асистенти" },
  { id: "s-me", label: "Інформація профілю" },
  { id: "s-pass", label: "Змінити пароль" },
  { id: "s-del", label: "Видалення акаунту" },
] as const;

const SettingsPage = () => {
  const { data: account, isLoading, error, refetch } = useMe();

  if (isLoading) return <PageLoading message="Завантажуємо налаштування..." />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      <PageHead
        word="профіль"
        title="Профіль / Налаштування"
        description="Керування вашим акаунтом та налаштування"
        tone="b"
      />
      <div className="lg:grid lg:grid-cols-[14rem_1fr] lg:items-start lg:gap-6">
        <nav
          aria-label="Розділи налаштувань"
          className="mb-6 flex gap-1 overflow-x-auto lg:sticky lg:top-6 lg:mb-0 lg:flex-col lg:overflow-visible"
        >
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-muted-foreground hover:bg-card hover:text-foreground focus-visible:ring-ring/50 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors outline-none focus-visible:ring-3"
            >
              {section.label}
            </a>
          ))}
        </nav>
        <div className="flex min-w-0 flex-col gap-6">
          <div id="s-time" className={ANCHOR_CLASS}>
            <Timezone initialTimezone={account?.timezone ?? null} />
          </div>
          <div id="s-notify" className={ANCHOR_CLASS}>
            <Notifications />
          </div>
          <div id="s-team" className={ANCHOR_CLASS}>
            <Team />
          </div>
          <div id="s-biz" className={cn(ANCHOR_CLASS, "flex flex-col gap-6")}>
            <Business
              initialCompany={account?.company ?? ""}
              initialShortName={account?.short_name ?? ""}
              initialWebsite={account?.website ?? ""}
              initialLanguage={account?.agent_language ?? "uk"}
            />
            <VerificationSection />
          </div>
          <div id="s-behave" className={ANCHOR_CLASS}>
            <CallBehavior
              initialAiDisclosure={account?.ai_disclosure_upfront ?? false}
              initialRecordNotice={account?.record_notice ?? false}
              initialRecordingRetentionDays={
                account?.recording_retention_days ?? DEFAULT_RETENTION_DAYS
              }
            />
          </div>
          <div id="s-assistants" className={ANCHOR_CLASS}>
            <ConnectedAssistants />
          </div>
          <div id="s-me" className={ANCHOR_CLASS}>
            <Profile initialName={account?.name ?? ""} initialEmail={account?.email ?? ""} />
          </div>
          <div id="s-pass" className={cn(ANCHOR_CLASS, "flex flex-col gap-6")}>
            <Password />
            <MarketingConsent initialGranted={account?.marketing_consent ?? false} />
          </div>
          <div id="s-del" className={ANCHOR_CLASS}>
            <DangerZone />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
