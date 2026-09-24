"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";

import { Button, Checkbox, Input, Label } from "@/components/ui";
import { PasswordInput } from "@/components/auth/password-input";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { signUpSchema, type SignUpFormData } from "@/lib/schemas";
import { LEGAL_PAGES } from "@/lib/constants";
import { useRegister, useEmailCode } from "@/lib/hooks";
import { ApiError } from "@/lib/api-client";
import { resolveErrorMessage, AUTH_ERROR_MESSAGES } from "@/lib/error-messages";

const PASSWORD_REQUIREMENTS = [
  { label: "Мінімум 8 символів", test: (value: string) => value.length >= 8 },
  {
    label: "Містить цифру або спецсимвол",
    test: (value: string) => /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
  },
  { label: "Містить велику літеру", test: (value: string) => /[A-ZА-ЯІЇЄҐ]/.test(value) },
] as const;

export default function SignUpPage() {
  const router = useRouter();
  const registerMutation = useRegister();
  const emailCode = useEmailCode();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      termsAccepted: false,
      marketingConsent: false,
    },
  });

  const passwordValue = watch("password", "");

  const onSubmit = (data: SignUpFormData): void => {
    registerMutation.mutate(
      {
        email: data.email,
        password: data.password,
        name: data.name,
        marketing_consent: data.marketingConsent,
      },
      {
        onSuccess: () => {
          emailCode.mutate(undefined, {
            onSuccess: () => router.replace("/email-confirm"),
            onError: () => router.replace("/email-confirm"),
          });
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

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Зареєструйтеся в Calls4U</h2>
        <p className="text-muted-foreground mt-2 text-lg">
          Вже маєте акаунт?{" "}
          <Link href="/sign-in" className="text-primary font-medium hover:underline">
            Увійти
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Ваше ім&apos;я</Label>
          <Input
            id="name"
            placeholder="Ivan Kulchytskyi"
            className="h-11 rounded-lg"
            {...register("name")}
          />
          {errors.name && (
            <p role="alert" className="text-sm text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Електронна пошта</Label>
          <Input
            id="email"
            type="email"
            placeholder="Kulchytskyi@gmail.com"
            className="h-11 rounded-lg"
            {...register("email")}
          />
          {errors.email && (
            <p role="alert" className="text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Пароль</Label>
          <PasswordInput id="password" placeholder="******************" {...register("password")} />
          {errors.password && (
            <p role="alert" className="text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <ul className="space-y-2" aria-label="Вимоги до пароля">
          {PASSWORD_REQUIREMENTS.map(({ label, test }) => {
            const passed = test(passwordValue);

            return (
              <li key={label} className="flex items-center gap-6 text-sm">
                <Check
                  className={`h-4 w-4 ${passed ? "text-green-600" : "text-muted-foreground/40"}`}
                  aria-hidden="true"
                />
                <span className={passed ? "text-gray-500" : "text-gray-500/60"}>{label}</span>
              </li>
            );
          })}
        </ul>

        <div className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="terms-accepted"
              className="group/field-label text-muted-foreground flex items-start gap-3 text-xs leading-relaxed font-normal"
            >
              <Controller
                control={control}
                name="termsAccepted"
                render={({ field }) => (
                  <Checkbox
                    id="terms-accepted"
                    className="mt-0.5"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    aria-invalid={errors.termsAccepted ? true : undefined}
                  />
                )}
              />
              <span>
                Я ознайомився(-лась) та погоджуюсь з{" "}
                <Link href={LEGAL_PAGES.offer.href} className="text-primary hover:underline">
                  Публічною офертою
                </Link>
                ,{" "}
                <Link href={LEGAL_PAGES.serviceTerms.href} className="text-primary hover:underline">
                  Умовами надання послуг
                </Link>
                ,{" "}
                <Link
                  href={LEGAL_PAGES.privacyPolicy.href}
                  className="text-primary hover:underline"
                >
                  Політикою конфіденційності
                </Link>{" "}
                та{" "}
                <Link href={LEGAL_PAGES.cookiePolicy.href} className="text-primary hover:underline">
                  Політикою cookie
                </Link>
                , а також надаю згоду на обробку моїх персональних даних.
              </span>
            </Label>
            {errors.termsAccepted && (
              <p role="alert" className="text-sm text-red-600">
                {errors.termsAccepted.message}
              </p>
            )}
          </div>

          <Label
            htmlFor="marketing-consent"
            className="group/field-label text-muted-foreground flex items-start gap-3 text-xs leading-relaxed font-normal"
          >
            <Controller
              control={control}
              name="marketingConsent"
              render={({ field }) => (
                <Checkbox
                  id="marketing-consent"
                  className="mt-0.5"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              )}
            />
            <span>
              Я погоджуюсь отримувати інформаційні та рекламні повідомлення від calls4u.ai
              (необов&apos;язково, можна відкликати будь-коли).
            </span>
          </Label>
        </div>

        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 h-11 w-full rounded-lg text-base font-semibold text-white"
          disabled={registerMutation.isPending || emailCode.isPending}
        >
          {registerMutation.isPending || emailCode.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Створення акаунту...
            </>
          ) : (
            "Створити акаунт"
          )}
        </Button>
      </form>

      <div className="mt-6">
        <SocialLoginButtons />
      </div>
    </div>
  );
}
