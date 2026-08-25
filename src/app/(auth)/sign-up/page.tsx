"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { signUpSchema, type SignUpFormData } from "@/lib/schemas";
import { useRegister } from "@/lib/hooks/use-auth";
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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const passwordValue = watch("password", "");

  const onSubmit = (data: SignUpFormData): void => {
    registerMutation.mutate(
      {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      {
        onSuccess: () => {
          toast.success("Акаунт створено");
          router.replace("/dashboard");
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

        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 h-11 w-full rounded-lg text-base font-semibold text-white"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Створення акаунту..." : "Створити акаунт"}
        </Button>
      </form>

      <div className="mt-6">
        <SocialLoginButtons />
      </div>

      <p className="text-muted-foreground mt-8 text-center text-xs leading-relaxed">
        Реєструючись, ви погоджуєтесь з нашими <br />
        <Link href="/terms" className="text-primary hover:underline">
          Умовами використання
        </Link>{" "}
        та{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Політикою конфіденційності
        </Link>
      </p>
    </div>
  );
}
