"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-client";
import {
  clearGoogleSheetsOAuthState,
  verifyGoogleSheetsOAuthState,
} from "@/lib/google-sheets-oauth";
import { useConnectGoogleSheets } from "@dashboard/hooks";

const INTEGRATIONS_ROUTE = "/dashboard/integrations";

const CallbackLoader = ({ message }: { message: string }) => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      <p className="text-muted-foreground mt-4 text-sm">{message}</p>
    </div>
  </div>
);

const GoogleSheetsCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const connectGoogleSheets = useConnectGoogleSheets();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    const failAndRedirect = (message: string): void => {
      clearGoogleSheetsOAuthState();
      toast.error(message);
      router.replace(INTEGRATIONS_ROUTE);
    };

    if (error) {
      failAndRedirect("Підключення Google Sheets скасовано.");
      return;
    }

    if (!verifyGoogleSheetsOAuthState(state)) {
      failAndRedirect("Помилка безпеки: невідповідність параметра state.");
      return;
    }

    if (!code) {
      failAndRedirect("Не вдалося отримати код авторизації.");
      return;
    }

    connectGoogleSheets.mutate(
      { code },
      {
        onSuccess: () => {
          toast.success("Google Sheets успішно підключено!");
          router.replace(INTEGRATIONS_ROUTE);
        },
        onError: (err) => {
          const message =
            err instanceof ApiError
              ? (err.message ?? "Не вдалося підключити Google Sheets.")
              : "Щось пішло не так.";
          toast.error(message);
          router.replace(INTEGRATIONS_ROUTE);
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router]);

  return <CallbackLoader message="Підключаємо Google Sheets..." />;
};

const GoogleSheetsCallbackPage = () => (
  <Suspense fallback={<CallbackLoader message="Завантаження..." />}>
    <GoogleSheetsCallbackContent />
  </Suspense>
);

export default GoogleSheetsCallbackPage;
