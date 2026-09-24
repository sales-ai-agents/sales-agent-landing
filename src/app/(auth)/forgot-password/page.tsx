"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, Loader2, Mail } from "lucide-react";

import { Button, Input, InputOTP, InputOTPGroup, InputOTPSlot, Label } from "@/components/ui";
import { PasswordInput } from "@/components/auth/password-input";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
} from "@/lib/schemas";
import { usePasswordReset, usePasswordResetConfirm } from "@/lib/hooks";
import { ApiError } from "@/lib/api-client";
import { resolveErrorMessage, AUTH_ERROR_MESSAGES } from "@/lib/error-messages";

const RESEND_COOLDOWN_SEC = 60;

const PASSWORD_REQUIREMENTS = [
  { label: "Мінімум 8 символів", test: (v: string) => v.length >= 8 },
  {
    label: "Містить цифру або спецсимвол",
    test: (v: string) => /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v),
  },
  { label: "Містить велику літеру", test: (v: string) => /[A-ZА-ЯІЇЄҐ]/.test(v) },
] as const;

type Step = "email" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const passwordReset = usePasswordReset();
  const confirmReset = usePasswordResetConfirm();

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const emailForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const passwordValue = resetForm.watch("password", "");

  const onSubmitEmail = (data: ForgotPasswordFormData): void => {
    passwordReset.mutate(data, {
      onSuccess: (response) => {
        setEmail(data.email);
        setHint(response.hint ?? null);
        setStep("reset");
        setCooldown(RESEND_COOLDOWN_SEC);
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

  const handleResend = (): void => {
    if (cooldown > 0) return;
    passwordReset.mutate(
      { email },
      {
        onSuccess: () => {
          setOtp("");
          toast.success("Новий код надіслано");
          setCooldown(RESEND_COOLDOWN_SEC);
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            toast.error(resolveErrorMessage(error.code, AUTH_ERROR_MESSAGES));
          } else {
            toast.error("Щось пішло не так.");
          }
        },
      }
    );
  };

  const handleBackToEmail = (): void => {
    setStep("email");
    setOtp("");
    setHint(null);
    resetForm.reset();
  };

  const onSubmitReset = (data: ResetPasswordFormData): void => {
    if (otp.length < 6) {
      toast.error("Введіть 6-значний код із листа.");
      return;
    }

    confirmReset.mutate(
      { email, code: otp, password: data.password },
      {
        onSuccess: () => {
          toast.success("Пароль успішно змінено. Увійдіть з новим паролем.");
          router.replace("/sign-in");
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            if (error.code === "invalid_code") {
              setOtp("");
              if (error.attemptsLeft === 0) {
                toast.error("Код заблоковано після 5 спроб. Запросіть новий лист.");
                handleBackToEmail();
              } else {
                toast.error(
                  `Невірний код із листа.${typeof error.attemptsLeft === "number" ? ` Залишилось спроб: ${error.attemptsLeft}.` : ""}`
                );
              }
            } else {
              toast.error(resolveErrorMessage(error.code, AUTH_ERROR_MESSAGES));
            }
          } else {
            toast.error("Щось пішло не так.");
          }
        },
      }
    );
  };

  if (step === "reset") {
    return (
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Створіть новий пароль</h2>
          <p className="text-muted-foreground mt-2 text-base">
            {hint ?? `Введіть код із листа на ${email} і придумайте новий пароль`}
          </p>
        </div>

        <div className="bg-primary/5 mb-5 flex items-start gap-3 rounded-lg p-4">
          <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
            <Mail className="text-primary h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Лист надіслано на {email}</p>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Перевірте поштову скриньку та папку &ldquo;Спам&rdquo;
            </p>
          </div>
        </div>

        <form onSubmit={resetForm.handleSubmit(onSubmitReset)} className="space-y-5">
          <div className="flex flex-col gap-3">
            <Label>Код із листа</Label>
            <InputOTP maxLength={6} value={otp} onChange={setOtp} aria-label="Код підтвердження">
              <InputOTPGroup className="gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="h-12 w-12 rounded-lg border text-base"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Новий пароль</Label>
            <PasswordInput
              id="password"
              placeholder="******************"
              {...resetForm.register("password")}
            />
            {resetForm.formState.errors.password && (
              <p role="alert" className="text-sm text-red-600">
                {resetForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="bg-primary/5 rounded-lg p-4">
            <p className="text-muted-foreground mb-2 text-sm">Пароль має містити:</p>
            <ul className="space-y-1" aria-label="Вимоги до пароля">
              {PASSWORD_REQUIREMENTS.map(({ label, test }) => {
                const passed = test(passwordValue);
                return (
                  <li key={label} className="flex items-center gap-3 text-sm">
                    <Check
                      className={`h-4 w-4 ${passed ? "text-green-600" : "text-muted-foreground/40"}`}
                      aria-hidden="true"
                    />
                    <span className={passed ? "text-gray-500" : "text-gray-500/60"}>{label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Підтвердіть новий пароль</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="******************"
              {...resetForm.register("confirmPassword")}
            />
            {resetForm.formState.errors.confirmPassword && (
              <p role="alert" className="text-sm text-red-600">
                {resetForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 h-11 w-full rounded-lg text-base font-semibold text-white"
            disabled={
              confirmReset.isPending ||
              otp.length < 6 ||
              !PASSWORD_REQUIREMENTS.every(({ test }) => test(passwordValue)) ||
              !resetForm.watch("confirmPassword")
            }
          >
            {confirmReset.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Збереження...
              </>
            ) : (
              "Зберегти новий пароль"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-lg text-base"
            onClick={handleResend}
            disabled={passwordReset.isPending || cooldown > 0}
          >
            {passwordReset.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Надсилання...
              </>
            ) : cooldown > 0 ? (
              `Надіслати код повторно (${cooldown}с)`
            ) : (
              "Надіслати код повторно"
            )}
          </Button>
        </form>

        <Button
          type="button"
          variant="ghost"
          className="text-primary mt-6 h-auto p-0 text-sm font-medium"
          onClick={handleBackToEmail}
        >
          ← Повернутися до введення пошти
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Відновлення пароля</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Введіть електронну пошту, яку ви використовуєте для входу в Calls4U
        </p>
      </div>

      <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Електронна пошта</Label>
          <Input
            id="email"
            type="email"
            placeholder="Kulchytskyi@gmail.com"
            className="h-11 rounded-lg"
            {...emailForm.register("email")}
          />
          {emailForm.formState.errors.email && (
            <p role="alert" className="text-sm text-red-600">
              {emailForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 h-11 w-full rounded-lg text-base font-semibold text-white"
          disabled={passwordReset.isPending}
        >
          {passwordReset.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Надсилання...
            </>
          ) : (
            "Надіслати код"
          )}
        </Button>

        <div className="bg-primary/5 flex items-start gap-3 rounded-lg p-4">
          <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
            <Mail className="text-primary h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Ми надішлемо вам лист</p>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Міститиме 6-значний код для створення нового пароля. Перевірте свою поштову скриньку
              та папку &ldquo;Спам&rdquo;
            </p>
          </div>
        </div>

        <p className="text-muted-foreground text-center text-sm">
          Немає акаунту?{" "}
          <Link href="/sign-up" className="text-primary font-medium hover:underline">
            Зареєструватися
          </Link>
        </p>
      </form>

      <Link href="/sign-in" className="text-primary mt-8 block text-sm font-medium hover:underline">
        ← Повернутися до входу
      </Link>
    </div>
  );
}
