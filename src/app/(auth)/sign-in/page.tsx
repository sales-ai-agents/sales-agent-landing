"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { signInSchema, type SignInFormData } from "@/lib/schemas";
import { useLogin } from "@/lib/hooks/use-auth";
import { ApiError } from "@/lib/api-client";
import { resolveErrorMessage, AUTH_ERROR_MESSAGES } from "@/lib/error-messages";

export default function SignInPage() {
  const router = useRouter();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignInFormData): void => {
    login.mutate(data, {
      onSuccess: () => {
        toast.success("Вхід виконано успішно");
        router.replace("/dashboard");
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
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Увійти у свій акаунт</h2>
        <p className="text-muted-foreground mt-2 text-lg">
          Немає акаунту?{" "}
          <Link href="/sign-up" className="text-primary font-medium hover:underline">
            Зареєструватися
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Електронна пошта</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
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

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-400 select-none">
            <input
              type="checkbox"
              className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
              defaultChecked
            />
            <span>Запам&apos;ятати мене</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-primary text-sm font-medium hover:underline"
          >
            Забули пароль?
          </Link>
        </div>

        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 h-11 w-full rounded-lg text-base font-semibold text-white"
          disabled={login.isPending}
        >
          {login.isPending ? "Вхід..." : "Увійти"}
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
