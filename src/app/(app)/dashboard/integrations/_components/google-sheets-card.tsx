"use client";

import { ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import {
  clearGoogleSheetsOAuthState,
  generateAndSaveGoogleSheetsOAuthState,
} from "@/lib/google-sheets-oauth";
import { useGoogleSheetsAuthUrl, useDisconnectGoogleSheets } from "@dashboard/hooks";

interface GoogleSheetsCardProps {
  connected: boolean;
  email?: string;
  ready: boolean;
  status?: string;
  error?: string;
  spreadsheet_url?: string;
}

export const GoogleSheetsCard = ({
  connected,
  email,
  ready,
  status,
  error,
  spreadsheet_url,
}: GoogleSheetsCardProps) => {
  const getAuthUrl = useGoogleSheetsAuthUrl();
  const disconnectGoogleSheets = useDisconnectGoogleSheets();

  const isError = status === "error" || Boolean(error);

  const handleConnect = (): void => {
    let state: string;
    try {
      state = generateAndSaveGoogleSheetsOAuthState();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Не вдалося ініціалізувати безпечне підключення. Перевірте налаштування браузера."
      );
      return;
    }

    getAuthUrl.mutate(state, {
      onSuccess: ({ url }) => {
        window.location.assign(url);
      },
      onError: (err) => {
        clearGoogleSheetsOAuthState();
        if (err instanceof ApiError) {
          toast.error(err.message ?? "Не вдалося отримати посилання для підключення.");
        } else {
          toast.error("Щось пішло не так.");
        }
      },
    });
  };

  const handleDisconnect = (): void => {
    disconnectGoogleSheets.mutate(undefined, {
      onSuccess: () => {
        toast.success("Google Sheets відключено");
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          toast.error(err.message ?? "Не вдалося відключити Google Sheets.");
        } else {
          toast.error("Щось пішло не так.");
        }
      },
    });
  };

  return (
    <div className="border-border bg-background rounded-xl border p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-100">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Google_Sheets_2020_Logo.svg"
            alt="Google Sheets"
            width={30}
            height={30}
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Google Sheets</p>
          {isError ? (
            <>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <span className="text-xs font-medium text-red-600 dark:text-red-400">
                  Помилка синхронізації
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {error === "token_revoked"
                  ? "Доступ відкликано в Google. Будь ласка, перепідключіть інтеграцію."
                  : error === "spreadsheet_gone"
                    ? "Таблицю видалено в Google Drive. Будь ласка, перепідключіть інтеграцію."
                    : "Зʼєднання розірвано. Будь ласка, перепідключіть інтеграцію."}
              </p>
            </>
          ) : connected ? (
            <>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-muted-foreground text-xs">
                  {email ? "Підключено як" : "Підключено"}
                </span>
              </div>
              {email && <p className="mt-0.5 truncate text-xs font-medium">{email}</p>}
            </>
          ) : (
            <>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                <span className="text-muted-foreground text-xs">Не підключено</span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Доступ лише до файлів, створених інтеграцією (дозвіл{" "}
                <span className="font-mono text-[11px]">drive.file</span>). Інші ваші таблиці та
                файли на Google Диску залишаються недоступними.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        {connected && !isError && spreadsheet_url ? (
          <a
            href={spreadsheet_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex items-center gap-1.5 text-xs font-medium hover:underline"
          >
            Відкрити таблицю
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          {isError ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                disabled={disconnectGoogleSheets.isPending}
                aria-busy={disconnectGoogleSheets.isPending}
              >
                {disconnectGoogleSheets.isPending && (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                )}
                Відключити
              </Button>
              <Button
                size="sm"
                onClick={handleConnect}
                disabled={!ready || getAuthUrl.isPending}
                aria-busy={getAuthUrl.isPending}
              >
                {getAuthUrl.isPending && (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                )}
                Перепідключити
              </Button>
            </>
          ) : connected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              disabled={disconnectGoogleSheets.isPending}
              aria-busy={disconnectGoogleSheets.isPending}
            >
              {disconnectGoogleSheets.isPending && (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              )}
              Відключити
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="text-primary border-primary/40 w-full"
              disabled={!ready || getAuthUrl.isPending}
              aria-busy={getAuthUrl.isPending}
              onClick={handleConnect}
            >
              {getAuthUrl.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
              {ready ? "Підключити" : "Незабаром"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
