"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, FileSpreadsheet, Info, Loader2, Table2 } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useGooglePicker, useGoogleSheetsPreview } from "@dashboard/hooks";
import type { AvailableIntegration } from "@dashboard/types";
import { isGooglePickerConfigured, type PickedSpreadsheet } from "@/lib/google-picker";
import { GOOGLE_SHEETS_ERROR_MESSAGES, resolveErrorMessage } from "@/lib/error-messages";
import { ApiError } from "@/lib/api-client";

import { ColumnMapping } from "./column-mapping";

const NO_COLUMN = -1;

export interface SheetsImportSelection {
  spreadsheetId: string;
  spreadsheetName: string;
  sheet: string;
  phoneColumn: number;
  nameColumn: number;
}

interface GoogleSheetsImportPanelProps {
  integration: AvailableIntegration | undefined;
  onConnect: () => void;
  isConnecting: boolean;
  onSelectionChange: (selection: SheetsImportSelection | null) => void;
}

export const GoogleSheetsImportPanel = ({
  integration,
  onConnect,
  isConnecting,
  onSelectionChange,
}: GoogleSheetsImportPanelProps) => {
  const { pick, isOpening } = useGooglePicker();
  const [spreadsheet, setSpreadsheet] = useState<PickedSpreadsheet | null>(null);
  const [sheet, setSheet] = useState<string>("");
  const [phoneOverride, setPhoneOverride] = useState<number | null>(null);
  const [nameOverride, setNameOverride] = useState<number | null>(null);

  const preview = useGoogleSheetsPreview(spreadsheet?.id ?? null, sheet || undefined);

  const connected = Boolean(integration?.connected) && integration?.status !== "error";
  const pickerReady = isGooglePickerConfigured();

  const guess = preview.data?.guess;
  const header = preview.data?.header ?? [];
  const sheetTitles = useMemo(
    () => preview.data?.sheets.map((item) => item.title) ?? [],
    [preview.data]
  );

  const phoneColumn = phoneOverride ?? guess?.phone ?? NO_COLUMN;
  const nameColumn = nameOverride ?? guess?.name ?? NO_COLUMN;

  useEffect(() => {
    if (!spreadsheet || phoneColumn < 0) {
      onSelectionChange(null);
      return;
    }
    onSelectionChange({
      spreadsheetId: spreadsheet.id,
      spreadsheetName: spreadsheet.name,
      sheet,
      phoneColumn,
      nameColumn,
    });
  }, [spreadsheet, sheet, phoneColumn, nameColumn, onSelectionChange]);

  const handleSheetChange = (value: string): void => {
    setSheet(value);
    setPhoneOverride(null);
    setNameOverride(null);
  };

  const handlePickSpreadsheet = async (): Promise<void> => {
    try {
      const picked = await pick();
      if (!picked) return;
      setSpreadsheet(picked);
      setSheet("");
      setPhoneOverride(null);
      setNameOverride(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не вдалося відкрити вибір таблиці.");
    }
  };

  if (!connected) {
    return (
      <div className="space-y-4">
        <div className="border-border flex flex-col items-center rounded-lg border-2 border-dashed p-8 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Table2 className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-sm font-medium">Google Sheets не підключено</p>
          <p className="text-muted-foreground mt-1 max-w-2xs text-xs">
            Підключіть Google-акаунт, щоб імпортувати контакти з ваших таблиць.
          </p>
          <Button type="button" className="mt-4" onClick={onConnect} disabled={isConnecting}>
            {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
            Підключити Google Sheets
          </Button>
          <p className="text-muted-foreground mt-4 text-xs">
            Відкриється вікно Google для безпечної авторизації.
          </p>
        </div>
        <SecurityNote />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-primary/5 flex items-center justify-between gap-3 rounded-lg p-4">
        <div className="flex min-w-0 items-center gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-medium">Google Sheets підключено</p>
            {integration?.account_email && (
              <p className="text-muted-foreground truncate text-xs">{integration.account_email}</p>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onConnect} disabled={isConnecting}>
          Змінити акаунт
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Таблиця</Label>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start font-normal"
          onClick={handlePickSpreadsheet}
          disabled={!pickerReady || isOpening}
        >
          {isOpening ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" aria-hidden="true" />
          )}
          <span className="truncate">
            {spreadsheet?.name ??
              (pickerReady ? "Обрати таблицю з Google Drive" : "Вибір таблиці недоступний")}
          </span>
        </Button>
        {!pickerReady && (
          <p className="text-muted-foreground text-xs">
            Вибір таблиці тимчасово недоступний. Зверніться до підтримки.
          </p>
        )}
      </div>

      {spreadsheet && (
        <div className="space-y-2">
          <Label htmlFor="sheet-select">Аркуш</Label>
          <Select
            value={sheet || undefined}
            onValueChange={(value) => handleSheetChange(value ?? "")}
            disabled={preview.isLoading || sheetTitles.length === 0}
          >
            <SelectTrigger id="sheet-select" className="w-full">
              <SelectValue placeholder={preview.isLoading ? "Завантаження..." : "Перший аркуш"} />
            </SelectTrigger>
            <SelectContent>
              {sheetTitles.map((title) => (
                <SelectItem key={title} value={title}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {spreadsheet && preview.isError && (
        <p className="text-destructive text-xs">
          {preview.error instanceof ApiError
            ? resolveErrorMessage(preview.error.code, GOOGLE_SHEETS_ERROR_MESSAGES)
            : "Не вдалося прочитати таблицю."}
        </p>
      )}

      {header.length > 0 && (
        <ColumnMapping
          header={header}
          phoneColumn={phoneColumn}
          nameColumn={nameColumn}
          onPhoneColumnChange={setPhoneOverride}
          onNameColumnChange={setNameOverride}
        />
      )}

      {preview.data && phoneColumn < 0 && (
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Підтвердьте колонку з номером телефону перед імпортом.
        </p>
      )}

      <SecurityNote />
    </div>
  );
};

const SecurityNote = () => (
  <div className="bg-primary/5 rounded-lg p-4">
    <div className="flex items-center gap-2">
      <Info className="text-primary h-4 w-4 shrink-0" aria-hidden="true" />
      <p className="text-sm font-medium">Про безпеку</p>
    </div>
    <p className="text-muted-foreground mt-2 text-xs">
      Ми отримаємо доступ тільки до обраної вами таблиці. Ваші дані в Google залишаються
      конфіденційними.
    </p>
  </div>
);
