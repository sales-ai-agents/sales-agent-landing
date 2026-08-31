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

function GoogleSheetsCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const connectGoogleSheets = useConnectGoogleSheets();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      processedRef.current = true;
      clearGoogleSheetsOAuthState();
      toast.error("Підключення Google Sheets скасовано.");
      router.replace("/dashboard/integrations");
      return;
    }

    if (!verifyGoogleSheetsOAuthState(state)) {
      processedRef.current = true;
      toast.error("Помилка безпеки: невідповідність параметра state.");
      router.replace("/dashboard/integrations");
      return;
    }

    if (!code) {
      processedRef.current = true;
      toast.error("Не вдалося отримати код авторизації.");
      router.replace("/dashboard/integrations");
      return;
    }

    processedRef.current = true;

    connectGoogleSheets.mutate(
      { code },
      {
        onSuccess: () => {
          toast.success("Google Sheets успішно підключено!");
          router.replace("/dashboard/integrations");
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            toast.error(err.message ?? "Не вдалося підключити Google Sheets.");
          } else {
            toast.error("Щось пішло не так.");
          }
          router.replace("/dashboard/integrations");
        },
      }
    );
    // connectGoogleSheets is intentionally excluded from deps. The stale closure is safe
    // because processedRef guarantees that the mutation runs only once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-muted-foreground mt-4 text-sm">Підключаємо Google Sheets...</p>
      </div>
    </div>
  );
}

export default function GoogleSheetsCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
            <p className="text-muted-foreground mt-4 text-sm">Завантаження...</p>
          </div>
        </div>
      }
    >
      <GoogleSheetsCallbackContent />
    </Suspense>
  );
}
