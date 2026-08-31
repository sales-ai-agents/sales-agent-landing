"use client";

import { PageError, PageLoading } from "@/components/dashboard";
import { useIntegrations } from "@dashboard/hooks";

import { GoogleSheetsCard } from "./_components/google-sheets-card";

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

  const sheetsIntegration = integrations.available.find(({ id }) => id === "google_sheets");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Інтеграції</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Підключайте сервіси для автоматизації та передачі даних
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sheetsIntegration && (
          <GoogleSheetsCard
            connected={sheetsIntegration.connected}
            email={sheetsIntegration.email}
            ready={sheetsIntegration.ready}
          />
        )}
        {/*NOT READY YET*/}
        {/*<WebhookCard />*/}
      </div>

      {/*NOT READY YET*/}
      {/*<CrmConnectors />*/}
      {/*<ApiKeysSection />*/}
    </div>
  );
};

export default IntegrationsPage;
