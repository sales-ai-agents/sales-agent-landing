"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { FileSpreadsheet, FileText, Info, Table2, Upload } from "lucide-react";
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
import { useUploadContacts } from "@dashboard/hooks";

type ImportSource = "file" | "google_sheets";

const ACCEPTED_FILE_EXTENSIONS = ".csv,.xlsx";
const BYTES_IN_KILOBYTE = 1024;

interface ImportContactsDialogProps {
  onClose: () => void;
}

const isSupportedFile = (file: File): boolean => {
  const name = file.name.toLowerCase();
  return name.endsWith(".csv") || name.endsWith(".xlsx");
};

const formatFileSize = (bytes: number): string => {
  const kilobytes = bytes / BYTES_IN_KILOBYTE;
  return `${kilobytes.toFixed(1)} КБ`;
};

export const ImportContactsDialog = ({ onClose }: ImportContactsDialogProps) => {
  const [source, setSource] = useState<ImportSource>("file");
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending } = useUploadContacts();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setFile(event.target.files?.[0] ?? null);
  };

  const handleDrop = (event: DragEvent): void => {
    event.preventDefault();
    const dropped = event.dataTransfer.files[0] ?? null;
    if (dropped && isSupportedFile(dropped)) setFile(dropped);
  };

  const handleImport = (): void => {
    if (!file) return;
    upload(file, {
      onSuccess: (data) => {
        const skipped = data.duplicates ? `, ${data.duplicates} дублікатів пропущено` : "";
        toast.success(`Додано ${data.added} контактів${skipped}`);
        onClose();
      },
      onError: (error) => toast.error(error.message),
    });
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

          <TabsContent value="file" className="space-y-4">
            <div
              role="button"
              tabIndex={0}
              aria-label="Обрати файл контактів"
              className="border-border hover:border-primary/50 flex flex-col items-center rounded-lg border-2 border-dashed p-8 text-center transition-colors"
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  inputRef.current?.click();
                }
              }}
            >
              <div className="bg-primary/10 mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                <Upload className="text-primary h-5 w-5" />
              </div>
              {file ? (
                <>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-muted-foreground mt-1 text-xs">{formatFileSize(file.size)}</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium">Перетягніть файл сюди</p>
                  <p className="text-muted-foreground mt-1 text-xs">або натисніть, щоб вибрати</p>
                </>
              )}
              <Button
                type="button"
                size="lg"
                className="mt-4 w-2xs"
                onClick={(event) => {
                  event.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                Вибрати файл
              </Button>
              <p className="text-muted-foreground mt-4 text-xs">Підтримувані формати: CSV, XLSX</p>
              <p className="text-muted-foreground text-xs">Максимальний розмір файлу: 10 МБ</p>
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_FILE_EXTENSIONS}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="bg-primary/5 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Info className="text-primary h-4 w-4 shrink-0" />
                <p className="text-sm font-medium">Вимоги до файлу</p>
              </div>
              <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-9 text-xs">
                <li>Рекомендовані колонки: Ім&apos;я, Телефон</li>
                <li>Допустимі формати телефону: +380 67 123 45 67, 0671234567</li>
                <li>Перший рядок може бути заголовком</li>
              </ul>
            </div>
          </TabsContent>

          {/* Google Sheets import requires a backend endpoint to list spreadsheets/sheets and
              read contacts from a user's file. The existing Google Sheets integration is
              outbound only (it writes completed calls to a sheet). Until that endpoint exists,
              this tab shows the not-connected state and the connect action stays disabled. */}
          <TabsContent value="google_sheets" className="space-y-4">
            <div className="border-border flex flex-col items-center rounded-lg border-2 border-dashed p-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Table2 className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm font-medium">Google Sheets не підключено</p>
              <p className="text-muted-foreground mt-1 max-w-2xs text-xs">
                Підключіть Google-акаунт, щоб імпортувати контакти з ваших таблиць.
              </p>
              <Button type="button" className="mt-4" disabled>
                Підключити Google Sheets
              </Button>
              <p className="text-muted-foreground mt-4 text-xs">
                Відкриється вікно Google для безпечної авторизації.
              </p>
            </div>

            <div className="bg-primary/5 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Info className="text-primary h-4 w-4 shrink-0" />
                <p className="text-sm font-medium">Про безпеку</p>
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                Ми отримаємо доступ тільки до ваших таблиць. Ваші дані в Google залишаються
                конфіденційними.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Скасувати
          </Button>
          <Button onClick={handleImport} disabled={source !== "file" || !file || isPending}>
            {isPending ? "Імпортування..." : "Імпортувати"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
