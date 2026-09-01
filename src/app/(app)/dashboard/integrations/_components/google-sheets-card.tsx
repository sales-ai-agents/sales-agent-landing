"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import { saveGoogleSheetsOAuthState } from "@/lib/google-sheets-oauth";
import { useGoogleSheetsAuthUrl, useDisconnectGoogleSheets } from "@dashboard/hooks";

interface GoogleSheetsCardProps {
  connected: boolean;
  email?: string;
  account_email?: string;
  ready: boolean;
}

export const GoogleSheetsCard = ({
  connected,
  email,
  account_email,
  ready,
}: GoogleSheetsCardProps) => {
  const getAuthUrl = useGoogleSheetsAuthUrl();
  const disconnectGoogleSheets = useDisconnectGoogleSheets();

  const displayEmail = email || account_email;

  const handleConnect = (): void => {
    getAuthUrl.mutate(undefined, {
      onSuccess: ({ url }) => {
        if (!saveGoogleSheetsOAuthState(url)) {
          toast.error("Сервер повернув некоректне посилання авторизації.");
          return;
        }

        window.location.assign(url);
      },
      onError: (err) => {
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
          {connected ? (
            <>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-muted-foreground text-xs">
                  {displayEmail ? "Підключено як" : "Підключено"}
                </span>
              </div>
              {displayEmail && (
                <p className="mt-0.5 truncate text-xs font-medium">{displayEmail}</p>
              )}
            </>
          ) : (
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
              <span className="text-muted-foreground text-xs">Не підключено</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        {connected ? (
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
  );
};
