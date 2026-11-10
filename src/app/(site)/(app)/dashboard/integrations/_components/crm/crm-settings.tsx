"use client";

import { useState } from "react";
import { CircleCheck, ExternalLink } from "lucide-react";

import { Alert, AlertDescription, Button } from "@/components/ui";
import { CRM_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { useTestCrm, useUpdateCrm } from "@dashboard/hooks";
import type { CrmIntegration, TestCrmResponse, UpdateCrmParams } from "@dashboard/types";
import { DEFAULT_PUSH_MODE, describeCrmTestCreated } from "../../_lib/crm-providers";
import { CrmDisconnectButton } from "./crm-disconnect-button";
import { CrmOptionSelect } from "./crm-option-select";
import { CrmPushOptions } from "./crm-push-options";

interface CrmSettingsProps {
  crm: CrmIntegration;
}

const onCrmError = (error: Error): void => handleMutationError(error, CRM_ERROR_MESSAGES);

export const CrmSettings = ({ crm }: CrmSettingsProps) => {
  const updateCrm = useUpdateCrm();
  const testCrm = useTestCrm();

  const [testResult, setTestResult] = useState<TestCrmResponse | null>(null);

  const providerName = crm.provider_name ?? "CRM";
  const pipelines = crm.pipelines ?? [];
  const sources = crm.sources ?? [];

  const update = (params: UpdateCrmParams): void => {
    updateCrm.mutate(params, { onError: onCrmError });
  };

  const runTest = (): void => {
    setTestResult(null);
    testCrm.mutate(undefined, { onSuccess: setTestResult, onError: onCrmError });
  };

  return (
    <div className="mt-4 space-y-4">
      {pipelines.length > 0 && (
        <CrmOptionSelect
          id={`crm-pipeline-${crm.provider}`}
          label="Воронка"
          options={pipelines}
          value={crm.pipeline_id}
          disabled={updateCrm.isPending}
          onChange={(pipelineId) => update({ pipeline_id: pipelineId })}
        />
      )}

      {sources.length > 0 && (
        <CrmOptionSelect
          id={`crm-source-${crm.provider}`}
          label="Джерело"
          options={sources}
          value={crm.source_id}
          disabled={updateCrm.isPending}
          onChange={(sourceId) => update({ source_id: sourceId })}
        />
      )}

      <CrmPushOptions
        value={crm.push ?? DEFAULT_PUSH_MODE}
        disabled={updateCrm.isPending}
        onChange={(push) => update({ push })}
      />

      {testResult && (
        <Alert variant="success">
          <CircleCheck aria-hidden="true" />
          <AlertDescription className="text-foreground flex-row items-center justify-between gap-3">
            <span>{describeCrmTestCreated(testResult.external_id)}</span>
            {testResult.url && (
              <a
                href={testResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex items-center gap-1 font-medium hover:underline"
              >
                Відкрити
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between gap-2">
        <CrmDisconnectButton providerName={providerName} />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={testCrm.isPending}
          onClick={runTest}
        >
          {testCrm.isPending ? "Перевіряємо..." : "Перевірити"}
        </Button>
      </div>
    </div>
  );
};
