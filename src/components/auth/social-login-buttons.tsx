"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSocialLogin, useAuthProviders } from "@/lib/hooks/use-auth";
import { ApiError } from "@/lib/api-client";
import { resolveErrorMessage, AUTH_ERROR_MESSAGES } from "@/lib/error-messages";

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ?? "";
const GITHUB_REDIRECT_URI = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI ?? "";

export const GITHUB_STATE_KEY = "github_oauth_state";

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function initiateGitHubLogin() {
  const state = crypto.randomUUID();
  sessionStorage.setItem(GITHUB_STATE_KEY, state);

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", GITHUB_CLIENT_ID);
  url.searchParams.set("redirect_uri", GITHUB_REDIRECT_URI);
  url.searchParams.set("scope", "user:email");
  url.searchParams.set("state", state);

  window.location.href = url.toString();
}

export function SocialLoginButtons() {
  const router = useRouter();
  const socialLogin = useSocialLogin();
  const { data: providers, isLoading: providersLoading } = useAuthProviders();

  const handleSuccess = useCallback(() => {
    toast.success("Вхід виконано успішно");
    router.replace("/dashboard");
  }, [router]);

  const handleError = useCallback((error: unknown) => {
    if (error instanceof ApiError) {
      toast.error(resolveErrorMessage(error.code, AUTH_ERROR_MESSAGES));
    } else {
      toast.error("Щось пішло не так.");
    }
  }, []);

  const handleGoogleSuccess = useCallback(
    (credentialResponse: CredentialResponse) => {
      const idToken = credentialResponse.credential;
      if (!idToken) {
        toast.error("Не вдалося отримати токен від Google.");
        return;
      }
      socialLogin.mutate(
        { provider: "google", id_token: idToken },
        { onSuccess: handleSuccess, onError: handleError }
      );
    },
    [socialLogin, handleSuccess, handleError]
  );

  if (providersLoading || !providers) return null;

  const showGoogle = providers.google;
  const showGitHub = providers.github;

  if (!showGoogle && !showGitHub) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-sm">або продовжити через</span>
        <div className="bg-border h-px flex-1" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {showGoogle && (
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Не вдалося увійти через Google.")}
          />
        )}
        {showGitHub && (
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-sm"
            disabled={socialLogin.isPending}
            onClick={initiateGitHubLogin}
          >
            <GitHubIcon />
            <span className="text-sm font-medium">GitHub</span>
          </Button>
        )}
      </div>
    </div>
  );
}
