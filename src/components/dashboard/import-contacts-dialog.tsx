"use client";

import { useCallback, useState } from "react";
import { FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import {
  useGoogleSheetsAuthUrl,
  useImportGoogleSheets,
  useIntegrations,
  useUploadContacts,
} from "@dashboard/hooks";
import { ApiError } from "@/lib/api-client";
import { GOOGLE_SHEETS_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import {
  clearGoogleSheetsOAuthState,
  generateAndSaveGoogleSheetsOAuthState,
} from "@/lib/google-sheets-oauth";

import { FileUploadPanel } from "./import/file-upload-panel";
import {
  GoogleSheetsImportPanel,
  type SheetsImportSelection,
} from "./import/google-sheets-import-panel";

type ImportSource = "file" | "google_sheets";

const GOOGLE_SHEETS_INTEGRATION_ID = "google_sheets";

interface ImportContactsDialogProps {
  onClose: () => void;
}

export const ImportContactsDialog = ({ onClose }: ImportContactsDialogProps) => {
  const [source, setSource] = useState<ImportSource>("file");
  const [file, setFile] = useState<File | null>(null);
  const [sheetsSelection, setSheetsSelection] = useState<SheetsImportSelection | null>(null);

  const { data: integrations } = useIntegrations();
  const uploadContacts = useUploadContacts();
  const importSheets = useImportGoogleSheets();
  const getAuthUrl = useGoogleSheetsAuthUrl();

  const googleSheets = integrations?.available.find(
    (item) => item.id === GOOGLE_SHEETS_INTEGRATION_ID
  );

  const handleConnectGoogleSheets = useCallback((): void => {
    let state: string;
    try {
      state = generateAndSaveGoogleSheetsOAuthState();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не вдалося ініціалізувати підключення."
      );
      return;
    }

    getAuthUrl.mutate(state, {
      onSuccess: ({ url }) => window.location.assign(url),
      onError: (error) => {
        clearGoogleSheetsOAuthState();
        toast.error(
          error instanceof ApiError
            ? (error.message ?? "Не вдалося отримати посилання для підключення.")
            : "Щось пішло не так."
        );
      },
    });
  }, [getAuthUrl]);

  const handleUploadFile = (): void => {
    if (!file) return;
    uploadContacts.mutate(file, {
      onSuccess: (data) => {
        const skipped = data.duplicates ? `, ${data.duplicates} дублікатів пропущено` : "";
        toast.success(`Додано ${data.added} контактів${skipped}`);
        onClose();
      },
      onError: (error) => toast.error(error.message),
    });
  };

  const handleImportSheets = (): void => {
    if (!sheetsSelection) return;
    importSheets.mutate(
      {
        spreadsheet_id: sheetsSelection.spreadsheetId,
        sheet: sheetsSelection.sheet || undefined,
        phone_column: sheetsSelection.phoneColumn,
        name_column: sheetsSelection.nameColumn >= 0 ? sheetsSelection.nameColumn : undefined,
        base_title: sheetsSelection.spreadsheetName,
      },
      {
        onSuccess: (data) => {
          const invalid = data.invalid ? `, ${data.invalid} некоректних` : "";
          const duplicates = data.duplicates ? `, ${data.duplicates} дублікатів` : "";
          toast.success(`Додано ${data.added} контактів${duplicates}${invalid}`);
          onClose();
        },
        onError: (error) => handleMutationError(error, GOOGLE_SHEETS_ERROR_MESSAGES),
      }
    );
  };

  const isFileSource = source === "file";
  const isPending = uploadContacts.isPending || importSheets.isPending;
  const canImport = isFileSource ? Boolean(file) : Boolean(sheetsSelection);

  const handleImport = (): void => {
    if (isFileSource) {
      handleUploadFile();
      return;
    }
    handleImportSheets();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Імпорт контактів</DialogTitle>
          <DialogDescription>
            Оберіть спосіб імпорту, щоб додати контакти до вашої бази
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={source}
          onValueChange={(value) => setSource(value as ImportSource)}
          className="gap-6"
        >
          <TabsList className="flex h-auto w-full justify-between gap-4 bg-transparent p-0">
            <TabsTrigger
              value="file"
              className="border-border data-active:border-primary data-active:bg-primary/5 h-12 border"
            >
              <FileText className="h-4 w-4" />
              CSV / XLSX
            </TabsTrigger>
            <TabsTrigger
              value="google_sheets"
              className="border-border data-active:border-primary data-active:bg-primary/5 h-12 border"
            >
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              Google Sheets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file">
            <FileUploadPanel file={file} onFileChange={setFile} />
          </TabsContent>

          <TabsContent value="google_sheets">
            <GoogleSheetsImportPanel
              integration={googleSheets}
              onConnect={handleConnectGoogleSheets}
              isConnecting={getAuthUrl.isPending}
              onSelectionChange={setSheetsSelection}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Скасувати
          </Button>
          <Button onClick={handleImport} disabled={!canImport || isPending}>
            {isPending ? "Імпортування..." : "Імпортувати"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
