"use client";

import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Info,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { useContactsExportPreview } from "@dashboard/hooks";
import { apiUrl } from "@/lib/api-config";
import { formatNumber } from "@/lib/utils";

import { ExportStatCard } from "./export/export-stat-card";
import { ExportPreviewTable } from "./export/export-preview-table";

interface ExportContactsDialogProps {
  search?: string;
  onClose: () => void;
}

export const ExportContactsDialog = ({ search, onClose }: ExportContactsDialogProps) => {
  const { data, isLoading, isError } = useContactsExportPreview(search, true);

  const handleExport = (): void => {
    window.open(apiUrl.contactsExport(search), "_blank", "noopener,noreferrer");
    onClose();
  };

  const exportable = data?.exportable ?? 0;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Експорт</DialogTitle>
          <DialogDescription>Перевірте дані перед експортом</DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" aria-hidden="true" />
          </div>
        )}

        {isError && (
          <p className="text-destructive py-8 text-center text-sm">
            Не вдалося завантажити попередній перегляд. Спробуйте ще раз.
          </p>
        )}

        {data && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <ExportStatCard
                icon={<FileText className="text-primary h-4 w-4" />}
                iconBg="bg-primary/10"
                title="Всього рядків у файлі"
                value={data.total}
              />
              <ExportStatCard
                icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
                iconBg="bg-green-100"
                title="Готово до експорту"
                value={data.exportable}
              />
              <ExportStatCard
                icon={<AlertTriangle className="h-4 w-4 text-orange-500" />}
                iconBg="bg-orange-100"
                title="Дублікати знайдено"
                value={data.duplicates}
              />
              <ExportStatCard
                icon={<XCircle className="h-4 w-4 text-red-500" />}
                iconBg="bg-red-100"
                title="Неправильних номерів"
                value={data.invalid}
              />
            </div>

            <div className="bg-primary/5 flex items-start gap-2 rounded-lg p-3">
              <Info className="text-primary mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p className="text-sm">
                Будуть експортовані {formatNumber(exportable)} контактів. Дублікати та некоректні
                номери будуть пропущені.
                {data.truncated && " Список перевищує ліміт — у файл потрапить не все."}
              </p>
            </div>

            <Tabs defaultValue="ready">
              <TabsList className="gap-4 bg-transparent p-0" variant="line">
                <TabsTrigger
                  value="ready"
                  className="data-active:text-primary after:bg-primary hover:text-primary"
                >
                  Готові до експорту ({formatNumber(data.exportable)})
                </TabsTrigger>
                <TabsTrigger
                  value="duplicates"
                  className="data-active:text-primary after:bg-primary hover:text-primary"
                >
                  Дублікати ({formatNumber(data.duplicates)})
                </TabsTrigger>
                <TabsTrigger
                  value="invalid"
                  className="data-active:text-primary after:bg-primary hover:text-primary"
                >
                  Неправильні номери ({formatNumber(data.invalid)})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {data.sample.length > 0 ? (
              <ExportPreviewTable contacts={data.sample} />
            ) : (
              <p className="text-muted-foreground py-8 text-center text-sm">
                Немає даних для показу
              </p>
            )}
          </div>
        )}

        <div className="mt-2 flex flex-col items-center gap-4">
          <div className="flex w-full justify-end gap-2">
            <Button variant="outline" size="lg" onClick={onClose}>
              Скасувати
            </Button>
            <Button onClick={handleExport} size="lg" disabled={isLoading || exportable === 0}>
              Експортувати {formatNumber(exportable)} контактів
            </Button>
          </div>
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Ваші дані в безпеці. Нічого не буде експортовано без вашого підтвердження
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
