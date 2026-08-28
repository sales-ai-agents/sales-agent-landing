"use client";

import { useIntegrations } from "@dashboard/hooks";
import { GoogleSheetsCard } from "./_components/google-sheets-card";
import { WebhookCard } from "./_components/webhook-card";
import { CrmConnectors } from "./_components/crm-connectors";
import { ApiKeysSection } from "./_components/api-keys-section";

const IntegrationsPage = () => {
  const { data: integrations } = useIntegrations();

  const sheetsIntegration = integrations?.available?.find((a) => a.id === "google_sheets");
  const sheetsConnected = sheetsIntegration?.connected ?? false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Інтеграції</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Підключайте сервіси для автоматизації та передачі даних
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <GoogleSheetsCard connected={sheetsConnected} email={undefined} />
        <WebhookCard />
      </div>

      <CrmConnectors />

      <ApiKeysSection />
    </div>
  );
};

export default IntegrationsPage;
