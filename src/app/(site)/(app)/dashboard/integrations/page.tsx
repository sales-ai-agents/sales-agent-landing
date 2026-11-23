"use client";

import { PageError, PageHead, PageLoading } from "@/components/dashboard";
import { useIntegrations } from "@dashboard/hooks";

import { ApiKeysSection } from "./_components/api-keys-section";
import { ClaudeConnectorCard } from "./_components/claude-connector-card";
import { GoogleSheetsCard } from "./_components/google-sheets-card";
import { GenericIntegrationCard } from "./_components/generic-integration-card";
import { CrmCard } from "./_components/crm/crm-card";
import { WebhookCard } from "./_components/webhook/webhook-card";
import { isCrmProvider } from "./_lib/crm-providers";

const WEBHOOK_INTEGRATION_ID = "webhook";

const IntegrationsPage = () => {
  const { data: integrations, isLoading, error, refetch } = useIntegrations();

  if (isLoading) return <PageLoading message="Завантажуємо інтеграції..." />;
  if (error || !integrations) {
    return (
      <PageError
        message={error?.message ?? "Не вдалося завантажити інтеграції"}
        onRetry={() => refetch()}
      />
    );
  }

  const availableIntegrations = (integrations.available ?? []).filter(
    (integration) => integration.id !== WEBHOOK_INTEGRATION_ID
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHead
        word="інтеграції"
        title="Інтеграції"
        description="Підключайте сервіси для автоматизації та передачі даних"
      />

      <ClaudeConnectorCard />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {availableIntegrations.map((integration) => {
          if (integration.id === "google_sheets") {
            return (
              <GoogleSheetsCard
                key={integration.id}
                connected={integration.connected}
                email={integration.account_email}
                ready={integration.ready}
                status={integration.status}
                error={integration.error}
                spreadsheet_url={integration.spreadsheet_url}
              />
            );
          }

          if (isCrmProvider(integration.id)) {
            return (
              <CrmCard key={integration.id} integration={integration} provider={integration.id} />
            );
          }

          return <GenericIntegrationCard key={integration.id} integration={integration} />;
        })}

        <div className="md:col-span-2">
          <WebhookCard />
        </div>
        <div className="md:col-span-2">
          <ApiKeysSection />
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
