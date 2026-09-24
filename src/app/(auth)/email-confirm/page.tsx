"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

import { Button, InputOTP, InputOTPGroup, InputOTPSlot, Label } from "@/components/ui";
import { useEmailCode, useEmailConfirm, useMe } from "@/lib/hooks";
import { ApiError } from "@/lib/api-client";
import { resolveErrorMessage, AUTH_ERROR_MESSAGES } from "@/lib/error-messages";

const RESEND_COOLDOWN_SEC = 60;

export default function EmailConfirmPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SEC);

  const { data: account } = useMe();
  const emailCode = useEmailCode();
  const emailConfirm = useEmailConfirm();

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const handleOtpChange = (value: string): void => {
    setCode(value);
    if (value.length === 6) {
      emailConfirm.mutate(
        { code: value },
        {
          onSuccess: (response) => {
            if (response.verified || response.already_verified) {
              router.replace("/email-confirmed");
            }
          },
          onError: (error) => {
            setCode("");
            if (error instanceof ApiError) {
              if (error.code === "bad_code") {
                const remaining = error.attemptsLeft ?? 0;
                toast.error(
                  remaining === 0
                    ? "Код заблоковано. Запросіть новий."
                    : `Невірний код. Залишилось спроб: ${remaining}`
                );
              } else if (error.code === "too_many_attempts") {
                toast.error("Занадто багато спроб — запросіть новий код.");
              } else {
                toast.error(resolveErrorMessage(error.code, AUTH_ERROR_MESSAGES));
              }
            } else {
              toast.error("Щось пішло не так.");
            }
          },
        }
      );
    }
  };

  const handleResend = (): void => {
    if (cooldown > 0) return;
    emailCode.mutate(undefined, {
      onSuccess: (response) => {
        if (response.already_verified) {
          toast.success("Пошта вже підтверджена");
          router.replace("/dashboard");
        } else {
          setCode("");
          toast.success("Новий код надіслано");
          setCooldown(RESEND_COOLDOWN_SEC);
        }
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          toast.error(resolveErrorMessage(error.code, AUTH_ERROR_MESSAGES));
        } else {
          toast.error("Щось пішло не так.");
        }
      },
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Підтвердження пошти</h2>
        <p className="text-muted-foreground mt-2 text-base">
          Введіть код із листа, щоб підтвердити свою електронну адресу
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-primary/5 flex items-start gap-3 rounded-lg p-4">
          <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
            <Mail className="text-primary h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">
              Лист надіслано{account?.email ? ` на ${account.email}` : ""}
            </p>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Перевірте поштову скриньку та папку &ldquo;Спам&rdquo;
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label>Код із листа</Label>
          <InputOTP
            maxLength={6}
            value={code}
            onChange={handleOtpChange}
            disabled={emailConfirm.isPending}
            aria-label="Код підтвердження"
          >
            <InputOTPGroup className="gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot key={i} index={i} className="h-12 w-12 rounded-lg border text-base" />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {emailConfirm.isPending && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Перевірка коду...</span>
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-lg text-base"
          onClick={handleResend}
          disabled={emailCode.isPending || cooldown > 0 || emailConfirm.isPending}
        >
          {emailCode.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Надсилання...
            </>
          ) : cooldown > 0 ? (
            `Надіслати повторно (${cooldown}с)`
          ) : (
            "Надіслати код повторно"
          )}
        </Button>
      </div>

      <Link
        href="/dashboard"
        className="text-primary mt-8 block text-sm font-medium hover:underline"
      >
        ← Повернутися до кабінету
      </Link>
    </div>
  );
}
