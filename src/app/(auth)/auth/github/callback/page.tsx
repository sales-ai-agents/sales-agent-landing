"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useSocialLogin } from "@/lib/hooks/use-auth";
import { ApiError } from "@/lib/api-client";
import { resolveErrorMessage, AUTH_ERROR_MESSAGES } from "@/lib/error-messages";
import { GITHUB_STATE_KEY } from "@/components/auth/social-login-buttons";

function GitHubCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const socialLogin = useSocialLogin();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      processedRef.current = true;
      toast.error("Авторизацію через GitHub скасовано.");
      router.replace("/sign-in");
      return;
    }

    const savedState = sessionStorage.getItem(GITHUB_STATE_KEY);
    sessionStorage.removeItem(GITHUB_STATE_KEY);

    if (!state || state !== savedState) {
      processedRef.current = true;
      toast.error("Помилка безпеки: невідповідність параметра state.");
      router.replace("/sign-in");
      return;
    }

    if (!code) {
      processedRef.current = true;
      toast.error("Не вдалося отримати код авторизації.");
      router.replace("/sign-in");
      return;
    }

    processedRef.current = true;

    socialLogin.mutate(
      { provider: "github", code },
      {
        onSuccess: () => {
          toast.success("Вхід виконано успішно");
          router.replace("/dashboard");
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            toast.error(resolveErrorMessage(err.code, AUTH_ERROR_MESSAGES));
          } else {
            toast.error("Щось пішло не так.");
          }
          router.replace("/sign-in");
        },
      }
    );
  }, [searchParams, socialLogin, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-muted-foreground mt-4 text-sm">Завершуємо авторизацію...</p>
      </div>
    </div>
  );
}

export default function GitHubCallbackPage() {
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
      <GitHubCallbackContent />
    </Suspense>
  );
}
